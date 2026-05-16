import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@vercel/edge-config';

export async function POST(req: NextRequest) {
  try {
    // Verifica il secret per sicurezza
    const auth = req.headers.get('Authorization');
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    // Scraping pagina Corte Costituzionale
    const res = await fetch('https://www.cortecostituzionale.it/ultimo-deposito', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    const html = await res.text();

    // Estrae il titolo del deposito es. "Deposito 14/05/2026 (dalla 77 alla 80)"
    const match = html.match(/Deposito\s+[\d/]+\s+\(dalla\s+\d+\s+alla\s+\d+\)/);
    if (!match) {
      return NextResponse.json({ message: 'Nessun deposito trovato' });
    }

    const depositoAttuale = match[0].trim();

    // Legge l'ultimo deposito salvato
    const edgeConfig = createClient(process.env.EDGE_CONFIG!);
    const ultimoSalvato = await edgeConfig.get('ultimo-deposito') as string;

    if (depositoAttuale === ultimoSalvato) {
      return NextResponse.json({ message: 'Nessuna novità', deposito: depositoAttuale });
    }

    // È cambiato — aggiorna Edge Config
    await fetch(`https://api.vercel.com/v1/edge-config/${process.env.EDGE_CONFIG_ID}/items`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ operation: 'upsert', key: 'ultimo-deposito', value: depositoAttuale }],
      }),
    });

    // Manda notifica push via OneSignal
    await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify({
        app_id: process.env.ONESIGNAL_APP_ID,
        included_segments: ['All'],
        headings: { it: 'Corte Costituzionale' },
        contents: { it: 'È stato pubblicato un nuovo deposito di sentenze.' },
        url: 'https://www.cortecostituzionale.it/ultimo-deposito',
      }),
    });

    return NextResponse.json({ message: 'Notifica inviata', deposito: depositoAttuale });

  } catch (error: any) {
    console.error('Errore controlla-sentenze:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}