import { createClient } from '@vercel/edge-config';

/**
 * ID dell'Edge Config, ricavato dalla connection string:
 *   https://edge-config.vercel.com/<id>?token=<token>
 * Così non serve una variabile d'ambiente EDGE_CONFIG_ID separata
 * (che se manca fa scrivere su .../edge-config/undefined/items).
 */
export function idEdgeConfig(): string | null {
  if (process.env.EDGE_CONFIG_ID) return process.env.EDGE_CONFIG_ID;
  const url = process.env.EDGE_CONFIG;
  if (!url) return null;
  return url.match(/edge-config\.vercel\.com\/([^/?]+)/)?.[1] ?? null;
}

/** Client Edge Config, o null se la connection string non è configurata. */
export function clientEdgeConfig() {
  if (!process.env.EDGE_CONFIG) return null;
  try {
    return createClient(process.env.EDGE_CONFIG);
  } catch (err) {
    console.error('[edge-config] connection string non valida:', err);
    return null;
  }
}

/** Legge una chiave; null se l'Edge Config non è raggiungibile. */
export async function leggiEdgeConfig(chiave: string): Promise<string | null> {
  const client = clientEdgeConfig();
  if (!client) return null;
  try {
    return ((await client.get(chiave)) as string | null) ?? null;
  } catch (err) {
    console.error(`[edge-config] lettura di "${chiave}" fallita:`, err);
    return null;
  }
}

/**
 * Scrive una o più chiavi. Lancia se la scrittura non va a buon fine:
 * un fallimento silenzioso qui significa token e ID mai persistiti.
 */
export async function scriviEdgeConfig(items: { key: string; value: string }[]) {
  const id = idEdgeConfig();
  if (!id) throw new Error('EDGE_CONFIG non configurato: impossibile ricavare l\'ID');
  if (!process.env.VERCEL_TOKEN) throw new Error('VERCEL_TOKEN mancante: scrittura Edge Config impossibile');

  const res = await fetch(`https://api.vercel.com/v1/edge-config/${id}/items`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items: items.map(i => ({ operation: 'upsert', ...i })) }),
  });

  if (!res.ok) {
    throw new Error(`Scrittura Edge Config fallita (${res.status}): ${await res.text()}`);
  }
}
