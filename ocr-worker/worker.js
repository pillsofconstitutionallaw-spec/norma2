/* OCR per norma2: estrae il testo dalle foto con Workers AI.
 *
 * Sta su Cloudflare e non dentro norma2 perché il binding `AI` è già
 * autenticato: non serve creare né rinnovare nessun token API.
 * norma2 lo chiama passando il segreto condiviso nell'header x-ocr-secret.
 *
 * Modello: Mistral Small 3.1 (Apache 2.0). NON usare i Llama vision di
 * Cloudflare: la licenza obbligatoria esclude i residenti nell'Unione Europea.
 *
 * Deploy:  cd ocr-worker && wrangler deploy
 * Segreto: wrangler secret put OCR_SECRET
 */

/* Stesso modello per le due cose: legge immagini e genera testo. */
const MODELLO = '@cf/mistralai/mistral-small-3.1-24b-instruct';

const PROMPT = 'Estrai tutto il testo presente in questa immagine, mantenendo la struttura '
  + '(titoli, paragrafi, elenchi). Trascrivi fedelmente quello che vedi, senza correggere '
  + 'la grammatica e senza aggiungere niente. Rispondi solo con il testo estratto, senza commenti.';

function json(dati, status) {
  return new Response(JSON.stringify(dati), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

/* Confronto a tempo costante: evita di far indovinare il segreto un byte alla volta. */
function segretoValido(ricevuto, atteso) {
  if (!atteso || typeof ricevuto !== 'string' || ricevuto.length !== atteso.length) return false;
  let diff = 0;
  for (let i = 0; i < atteso.length; i++) diff |= ricevuto.charCodeAt(i) ^ atteso.charCodeAt(i);
  return diff === 0;
}

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') return json({ errore: 'Metodo non consentito.' }, 405);
    if (!segretoValido(request.headers.get('x-ocr-secret'), env.OCR_SECRET)) {
      return json({ errore: 'Non autorizzato.' }, 401);
    }

    let body;
    try { body = await request.json(); } catch { return json({ errore: 'Richiesta non valida.' }, 400); }

    /* Seconda funzione: generare testo quando Groq è al limite del suo piano.
       Il percorso delle immagini qui sotto resta identico a prima. */
    const prompt = String((body && body.prompt) || '');
    if (prompt) {
      if (prompt.length > 40000) return json({ errore: 'Prompt troppo lungo.' }, 413);
      const tetto = Math.min(Number(body.maxTokens) || 2800, 4000);
      try {
        const r = await env.AI.run(MODELLO, {
          messages: [{ role: 'user', content: prompt }],
          max_tokens: tetto,
          temperature: 0.1,
        });
        const testo = String((r && r.response) || '').trim();
        if (!testo) return json({ errore: 'Risposta vuota.' }, 502);
        return json({ testo });
      } catch (e) {
        return json({ errore: 'Generazione non disponibile: ' + String((e && e.message) || e) }, 502);
      }
    }

    /* base64 puro oppure data URI: accettiamo entrambi */
    let immagine = String((body && body.immagine) || '');
    const virgola = immagine.indexOf(',');
    if (immagine.startsWith('data:') && virgola > -1) immagine = immagine.slice(virgola + 1);
    if (!immagine) return json({ errore: 'Nessuna immagine ricevuta.' }, 400);
    if (immagine.length > 8_000_000) return json({ errore: 'Immagine troppo grande.' }, 413);

    try {
      const r = await env.AI.run(MODELLO, {
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: PROMPT },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${immagine}` } },
          ],
        }],
        max_tokens: 1500,
        temperature: 0.1,
      });
      const testo = String((r && r.response) || '').trim();
      if (!testo) return json({ errore: 'Nessun testo leggibile.' }, 502);
      return json({ testo });
    } catch (e) {
      return json({ errore: 'OCR non disponibile: ' + String((e && e.message) || e) }, 502);
    }
  },
};
