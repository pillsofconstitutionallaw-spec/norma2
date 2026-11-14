/* Modello Groq usato da tutte le funzioni AI del sito.
 *
 * I modelli llama-3.x sono stati dismessi da Groq: le chiamate rispondevano
 * 404 e le funzioni AI erano ferme. Tenendo il modello in un punto solo,
 * il prossimo cambio si fa qui (o via GROQ_MODEL, senza toccare il codice).
 */

export const MODELLO_TESTO = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

/* I gpt-oss ragionano prima di rispondere e i token di ragionamento pescano
 * dallo stesso budget della risposta: con un tetto basso capita che il
 * ragionamento se lo mangi tutto e `content` torni VUOTO.
 * Da qui: ragionamento basso e un minimo di budget garantito. */
export function opzioniModello(maxTokens = 1024): Record<string, unknown> {
  const opzioni: Record<string, unknown> = {
    model: MODELLO_TESTO,
    max_completion_tokens: Math.max(maxTokens, 1500),
  };
  if (/gpt-oss/i.test(MODELLO_TESTO)) opzioni.reasoning_effort = 'low';
  return opzioni;
}

/* Errore riconoscibile: serve a distinguere "Groq è al limite" da un guasto vero,
 * così la pagina può dire all'utente di riprovare tra un minuto invece di
 * mostrare un generico "errore di generazione". */
export class GroqLimiteRaggiunto extends Error {
  constructor(public attesaSecondi: number) {
    super(`Groq al limite: riprovare tra ${attesaSecondi}s`);
    this.name = 'GroqLimiteRaggiunto';
  }
}

/* Il piano gratuito Groq concede 8000 token al minuto, e `max_completion_tokens`
 * viene PRENOTATO sul budget anche se la risposta è più corta: chiedere più
 * spazio del necessario riduce di molto le richieste possibili al minuto.
 * Qui una sola ritentata, rispettando l'attesa indicata da Groq. */
export async function eseguiGroq(
  apiKey: string,
  corpo: Record<string, unknown>,
  /* Con `ritenta: false` non aspettiamo: serve a chi ha già un piano B
     e non vuole bruciare secondi preziosi fermo ad aspettare Groq. */
  { ritenta = true }: { ritenta?: boolean } = {},
): Promise<string> {
  for (let tentativo = 0; tentativo < 2; tentativo++) {
    const risposta = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(corpo),
    });

    if (risposta.status === 429) {
      const attesa = Math.ceil(Number(risposta.headers.get('retry-after')) || 8);
      if (ritenta && tentativo === 0 && attesa <= 15) {
        await new Promise((ok) => setTimeout(ok, attesa * 1000));
        continue;
      }
      throw new GroqLimiteRaggiunto(attesa);
    }

    const dati = await risposta.json().catch(() => ({}));
    if (!risposta.ok) throw new Error(dati?.error?.message || `Groq HTTP ${risposta.status}`);
    return String(dati?.choices?.[0]?.message?.content || '');
  }
  throw new GroqLimiteRaggiunto(60);
}

/* Il modello a volte incornicia il JSON o ci mette una frase davanti:
 * togliamo i backtick e teniamo il primo blocco [...] o {...} completo. */
export function estraiJson(grezzo: string): string {
  const pulito = grezzo.replace(/```json|```/g, '').trim();
  const primo = pulito.search(/[[{]/);
  if (primo === -1) return pulito;
  const apre = pulito[primo];
  const chiude = apre === '[' ? ']' : '}';
  const ultimo = pulito.lastIndexOf(chiude);
  return ultimo > primo ? pulito.slice(primo, ultimo + 1) : pulito;
}
