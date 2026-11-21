import { NextRequest, NextResponse } from 'next/server';
import { opzioniModello, eseguiGroq, estraiJson, GroqLimiteRaggiunto } from '@/lib/groq';

export const maxDuration = 60;

/* L'OCR non passa più da Groq: il modello vision che usavamo (llama-3.2-11b-vision)
   è stato dismesso e sull'account Groq non c'è nessun modello che legga immagini.
   Ora le foto vanno a un Worker Cloudflare (cartella ocr-worker/) che usa Workers AI
   con Mistral Small 3.1. Il Worker sta su Cloudflare perché lì il binding AI è già
   autenticato: nessun token API da creare o rinnovare.
   Variabili: OCR_URL e OCR_SECRET. */

async function ocrFoto(base64: string): Promise<string> {
  const url = process.env.OCR_URL;
  const segreto = process.env.OCR_SECRET;
  if (!url || !segreto) throw new Error('OCR non configurato');

  const risposta = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-ocr-secret': segreto },
    body: JSON.stringify({ immagine: base64 }),
    signal: AbortSignal.timeout(30000),
  });
  const dati = await risposta.json().catch(() => ({}));
  if (!risposta.ok) throw new Error(dati?.errore || `OCR HTTP ${risposta.status}`);
  return String(dati?.testo || '');
}

/* Misurato sul caso peggiore (35 flash card): 2063 token di risposta.
   Prenotarne 4096 come prima dimezzava le richieste possibili al minuto,
   perché Groq scala dal budget lo spazio PRENOTATO, non quello usato. */
const TOKEN_RISPOSTA = 2800;

/* Quanto tempo lasciarsi per il piano B. Il Worker, nel caso peggiore
   (35 flash card), ci mette ~42s: sotto questa soglia non lo chiamiamo
   nemmeno, meglio un 429 onesto che una funzione che scade a metà. */
const SOGLIA_FALLBACK_MS = 45_000;

/* Piano B quando Groq è al limite del suo piano: stesso Worker dell'OCR,
   che ha una quota separata. Non sostituisce Groq, interviene solo dove
   prima restituivamo un errore. */
async function generaConWorker(prompt: string, millisecondiDisponibili: number): Promise<string> {
  const url = process.env.OCR_URL;
  const segreto = process.env.OCR_SECRET;
  if (!url || !segreto) throw new Error('Worker non configurato');

  const risposta = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-ocr-secret': segreto },
    body: JSON.stringify({ prompt, maxTokens: TOKEN_RISPOSTA }),
    signal: AbortSignal.timeout(Math.max(5000, millisecondiDisponibili - 2000)),
  });
  const dati = await risposta.json().catch(() => ({}));
  if (!risposta.ok) throw new Error(dati?.errore || `Worker HTTP ${risposta.status}`);
  return String(dati?.testo || '');
}

async function groqGenerate(prompt: string, apiKey: string, restano: () => number): Promise<string> {
  const puoRipiegare = restano() > SOGLIA_FALLBACK_MS;
  try {
    /* se abbiamo un piano B non stiamo ad aspettare Groq: lo usiamo subito */
    return await eseguiGroq(
      apiKey,
      { ...opzioniModello(TOKEN_RISPOSTA), messages: [{ role: 'user', content: prompt }], temperature: 0.1 },
      { ritenta: !puoRipiegare },
    );
  } catch (errore) {
    if (!(errore instanceof GroqLimiteRaggiunto) || !puoRipiegare) throw errore;
    try {
      return await generaConWorker(prompt, restano());
    } catch {
      throw errore;            /* piano B fallito: resta il messaggio onesto sul limite */
    }
  }
}

function calcolaNumeroCard(len: number): number {
  if (len < 2000) return 8;
  if (len < 5000) return 12;
  if (len < 8000) return 18;
  if (len < 12000) return 25;
  return 35;
}

function calcolaNumeroTest(len: number): number {
  if (len < 2000) return 5;
  if (len < 5000) return 8;
  if (len < 8000) return 10;
  return 15;
}

export async function POST(req: NextRequest) {
  const inizio = Date.now();
  const restano = () => 58_000 - (Date.now() - inizio);   /* maxDuration è 60s: 2s di margine */
  try {
    const body = await req.json();
    const { tipo, immagini } = body; // immagini: string[] (base64)

    const apiKey = process.env.GROQ_API_KEY_PDF;
    if (!apiKey) {
      return NextResponse.json({ errore: 'API KEY GROQ NON TROVATA' }, { status: 500 });
    }

    if (!Array.isArray(immagini) || immagini.length === 0) {
      return NextResponse.json({ errore: 'Nessuna immagine ricevuta' }, { status: 400 });
    }

    /* Le foto si leggono in parallelo: una alla volta, con 8 immagini,
       si sforerebbe il tempo massimo della funzione. Se una foto fallisce
       le altre proseguono. */
    const esiti = await Promise.allSettled(immagini.slice(0, 8).map((b64: string) => ocrFoto(b64)));
    const testi: string[] = esiti
      .filter((e): e is PromiseFulfilledResult<string> => e.status === 'fulfilled' && !!e.value.trim())
      .map((e) => e.value.trim());

    if (testi.length === 0) {
      return NextResponse.json({ errore: 'Nessun testo leggibile nelle foto. Riprova con immagini più nitide.' }, { status: 400 });
    }

    const testoCompleto = testi.join('\n\n').substring(0, 10000);
    const nCard = calcolaNumeroCard(testoCompleto.length);
    const nTest = calcolaNumeroTest(testoCompleto.length);

    if (tipo === 'flashcard') {
      const prompt = `Sei un docente universitario di giurisprudenza italiano.
Documento di studio fornito:
${testoCompleto}

Crea esattamente ${nCard} flash card basate SOLO su questo documento.
Regole: no markdown, no backtick, risposte max 3 righe, copri tutti gli argomenti in modo uniforme.
Rispondi SOLO con JSON valido:
[{"domanda":"...","risposta":"..."}]`;

      const raw = estraiJson(await groqGenerate(prompt, apiKey, restano));
      try {
        const carte = JSON.parse(raw);
        if (!Array.isArray(carte)) throw new Error();
        return NextResponse.json({ carte, testo: testoCompleto });
      } catch {
        return NextResponse.json({ errore: 'Errore generazione flashcard. Riprova.' }, { status: 500 });
      }
    }

    if (tipo === 'test') {
      const prompt = `Sei un docente universitario di giurisprudenza italiano.
Documento di studio fornito:
${testoCompleto}

Crea esattamente ${nTest} domande a risposta multipla basate SOLO su questo documento.
Regole: no markdown, 4 opzioni per domanda, una sola corretta, opzioni plausibili.
Rispondi SOLO con JSON valido:
[{"domanda":"...","opzioni":["A) ...","B) ...","C) ...","D) ..."],"corretta":0}]`;

      const raw = estraiJson(await groqGenerate(prompt, apiKey, restano));
      try {
        const domande = JSON.parse(raw);
        if (!Array.isArray(domande)) throw new Error();
        return NextResponse.json({ domande });
      } catch {
        return NextResponse.json({ errore: 'Errore generazione test. Riprova.' }, { status: 500 });
      }
    }

    return NextResponse.json({ errore: 'Tipo non valido' }, { status: 400 });

  } catch (error: any) {
    if (error instanceof GroqLimiteRaggiunto) {
      return NextResponse.json(
        { errore: `Troppe richieste in poco tempo. Riprova tra ${error.attesaSecondi} secondi.` },
        { status: 429 },
      );
    }
    console.error('Errore studio-foto:', error);
    return NextResponse.json({ errore: 'Errore interno. Riprova.' }, { status: 500 });
  }
}
