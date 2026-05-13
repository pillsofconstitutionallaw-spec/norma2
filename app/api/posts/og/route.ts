import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://orizzontegiuridico.com/wp-json/wp/v2/posts?_embed",
      { next: { revalidate: 60 } }
    );
    if (!response.ok) throw new Error("Errore caricamento post");
    const posts = await response.json();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "Errore server" }, { status: 500 });
  }
}
