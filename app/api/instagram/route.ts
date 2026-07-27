import { NextResponse } from 'next/server';
import { IG_USER_ID, tokenInstagram } from '@/lib/instagram';

export async function GET() {
  const token = await tokenInstagram();
  if (!token) {
    console.error('[instagram] nessun token disponibile (né Edge Config né INSTAGRAM_TOKEN)');
    return NextResponse.json({ error: 'Token Instagram mancante', data: [] }, { status: 503 });
  }

  try {
    const [mediaRes, profileRes] = await Promise.all([
      fetch(`https://graph.instagram.com/v25.0/${IG_USER_ID}/media?fields=id,media_type,media_url,thumbnail_url,permalink,timestamp,caption&limit=9&access_token=${token}`),
      fetch(`https://graph.instagram.com/v25.0/${IG_USER_ID}?fields=profile_picture_url,username&access_token=${token}`)
    ]);
    const media = await mediaRes.json();
    const profile = await profileRes.json();

    // Graph API risponde 200 con un oggetto `error` quando il token è scaduto o revocato:
    // senza questo controllo il feed resta vuoto senza che nessuno se ne accorga.
    if (media?.error) {
      console.error('[instagram] Graph API ha rifiutato il token:', media.error);
      return NextResponse.json(
        { error: media.error.message ?? 'Errore Graph API', data: [] },
        { status: 502 }
      );
    }

    return NextResponse.json({ ...media, profile });
  } catch (e) {
    console.error('[instagram] fetch fallita:', e);
    return NextResponse.json({ error: 'Fetch failed', data: [] }, { status: 500 });
  }
}
