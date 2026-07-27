import { leggiEdgeConfig } from './edge-config';

export const IG_USER_ID = '17841472725782214';

/** Chiavi Edge Config usate per il token Instagram. */
export const CHIAVE_TOKEN = 'instagram-token';
export const CHIAVE_TOKEN_REFRESH = 'instagram-token-refreshed-at';

/**
 * Token Instagram valido: prima quello rinfrescato dal cron
 * (/api/controlla-instagram, salvato in Edge Config), poi l'env come fallback.
 *
 * I token long-lived scadono dopo 60 giorni: quello nell'env invecchia e basta,
 * solo quello in Edge Config viene tenuto vivo dal refresh settimanale.
 */
export async function tokenInstagram(): Promise<string> {
  const daEdgeConfig = await leggiEdgeConfig(CHIAVE_TOKEN);
  return daEdgeConfig || process.env.INSTAGRAM_TOKEN || '';
}
