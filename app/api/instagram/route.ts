import { NextResponse } from 'next/server';

const IG_USER_ID = '17841472725782214';
const IG_TOKEN = process.env.INSTAGRAM_TOKEN!;

export async function GET() {
  try {
    const [mediaRes, profileRes] = await Promise.all([
      fetch(`https://graph.instagram.com/v25.0/${IG_USER_ID}/media?fields=id,media_type,media_url,thumbnail_url,permalink,timestamp,caption&limit=9&access_token=${IG_TOKEN}`),
      fetch(`https://graph.instagram.com/v25.0/${IG_USER_ID}?fields=profile_picture_url,username&access_token=${IG_TOKEN}`)
    ]);
    const media = await mediaRes.json();
    const profile = await profileRes.json();
    return NextResponse.json({ ...media, profile });
  } catch (e) {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}