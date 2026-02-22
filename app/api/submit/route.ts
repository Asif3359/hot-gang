import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SCRIPT_URL = process.env.GOOGLE_SHEETS_SCRIPT_URL;

export async function POST(request: Request) {
  if (!SCRIPT_URL) {
    return NextResponse.json(
      { error: "GOOGLE_SHEETS_SCRIPT_URL is not configured" },
      { status: 503 }
    );
  }

  let body: { name?: string; jerseyNumber?: string; size?: string; phone?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const jerseyNumber = typeof body.jerseyNumber === "string" ? body.jerseyNumber.trim() : "";
  const size = typeof body.size === "string" ? body.size.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";

  if (!name || !jerseyNumber || !size || !phone) {
    return NextResponse.json(
      { error: "Name, jersey number, size, and phone are required" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, jerseyNumber, size, phone }),
      cache: "no-store",
    });
    const text = await res.text();

    if (text.trim().startsWith("<")) {
      return NextResponse.json(
        { error: "Sheet app returned an error. Add doPost to your Apps Script (see docs)." },
        { status: 502 }
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: "Could not save. Try again." },
        { status: 502 }
      );
    }

    let data: { ok?: boolean; error?: string };
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json({ ok: true });
    }
    if (data.error) {
      return NextResponse.json(
        { error: data.error },
        { status: 409 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Submit to sheet failed:", err);
    return NextResponse.json(
      { error: "Could not save. Try again." },
      { status: 502 }
    );
  }
}
