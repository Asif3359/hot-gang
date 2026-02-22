import { NextResponse } from "next/server";

/** Always fetch fresh data from Google (no caching). */
export const dynamic = "force-dynamic";

/**
 * Fetches team/jury data from Google Sheets via a deployed Apps Script Web App.
 * Set GOOGLE_SHEETS_SCRIPT_URL in .env to your deployed script URL.
 */
export async function GET() {
  const scriptUrl = process.env.GOOGLE_SHEETS_SCRIPT_URL;
  if (!scriptUrl) {
    return NextResponse.json(
      { error: "GOOGLE_SHEETS_SCRIPT_URL is not configured" },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(scriptUrl, {
      redirect: "follow",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const text = await res.text();

    // Google often returns HTML (login page, error page) instead of JSON
    const trimmed = text.trim();
    if (trimmed.startsWith("<")) {
      console.error(
        "Sheet API returned HTML instead of JSON. Ensure the Apps Script is deployed as Web app with 'Who has access: Anyone', and run it once in the browser to grant access.",
        "Response preview:",
        trimmed.slice(0, 200)
      );
      return NextResponse.json(
        {
          error:
            "Sheet URL returned a web page instead of data. In Google Apps Script: Deploy as Web app → Who has access: Anyone. Open the Web app URL once in a browser and click Allow.",
        },
        { status: 502 }
      );
    }

    if (!res.ok) {
      throw new Error(`Sheet API returned ${res.status}: ${text.slice(0, 100)}`);
    }

    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to fetch team data:", err);
    return NextResponse.json(
      { error: "Could not load team data. Check GOOGLE_SHEETS_SCRIPT_URL." },
      { status: 502 }
    );
  }
}
