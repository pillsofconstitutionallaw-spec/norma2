import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const testo = body?.testo || '';

    if (!testo) {
      return NextResponse.json({
        principio: '',
        concetti: [],
      });
    }

    const principio = testo.split('.').slice(0, 2).join('.');

    const concetti = testo
      .replace(/[.,;:!?()]/g, '')
      .split(' ')
      .filter((p: string) => p.length > 6)
      .filter((v: string, i: number, arr: string[]) => arr.indexOf(v) === i)
      .slice(0, 8);

    return NextResponse.json({
      principio,
      concetti,
    });

  } catch (e) {
    return NextResponse.json({
      principio: '',
      concetti: [],
    });
  }
}