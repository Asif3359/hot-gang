# Google Forms + Sheets setup for HOT GANG

This guide connects your landing page to Google Forms (for collecting data) and Google Sheets (so the site can show who has which jury number).

## 1. Create the Google Form

1. Go to [Google Forms](https://forms.google.com) and create a new form.
2. Add these questions (exact names matter for the table on the site):
   - **Jurcy Number** — Short answer (e.g. 1, 2, 3)
   - **Name** — Short answer
   - **Size** — Short answer or dropdown: S, M, L, XL, etc.
   - **Phone Number** — Short answer
3. Optional: add more fields (e.g. Timestamp is automatic); the landing page shows Jurcy #, Name, Size, Phone.
4. Click **Send** → copy the form link and set it as `NEXT_PUBLIC_GOOGLE_FORM_URL` in `.env`.

## 2. Link Form to a Google Sheet

1. In the form, open the **Responses** tab.
2. Click the green **Sheets** icon → **Create a new spreadsheet** (or link to an existing one).
3. Name the sheet (e.g. "HOT GANG Responses"). The first row will be the question titles; each new row is a response.

## 3. Expose sheet data as JSON (Apps Script)

So the Next.js app can show “who has which jury number”, the sheet data must be available as JSON. Use Google Apps Script:

1. Open the **same** Google Sheet that receives the form responses (Responses → link to Sheets). The script must be bound to this sheet.
2. In that sheet, go to **Extensions** → **Apps Script**.
3. Delete any sample code and paste this (returns JSON even on error so you can see what went wrong):

```javascript
function doGet() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0];
    var data = sheet.getDataRange().getValues();

    if (data.length < 2) {
      return jsonResponse([]);
    }

    var headers = data[0];
    var rows = [];

    for (var i = 1; i < data.length; i++) {
      var row = {};
      for (var j = 0; j < headers.length; j++) {
        row[headers[j]] = data[i][j] != null ? String(data[i][j]) : "";
      }
      rows.push(row);
    }
    return jsonResponse(rows);
  } catch (e) {
    return jsonResponse({ error: e.toString() });
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

// Append a row when the website submits the form (POST from Next.js).
function doPost(e) {
  try {
    var body = e.postData ? JSON.parse(e.postData.contents) : {};
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0];
    var data = sheet.getDataRange().getValues();
    var headers = data.length > 0 ? data[0] : [];
    if (headers.length === 0 || !headers[0]) {
      sheet
        .getRange(1, 1, 1, 5)
        .setValues([
          [
            "Timestamp",
            "Your Name (jersey name)",
            "jersey Number",
            "Size",
            "Phone Number",
          ],
        ]);
      headers = [
        "Timestamp",
        "Your Name (jersey name)",
        "jersey Number",
        "Size",
        "Phone Number",
      ];
      data = [headers];
    }
    var jerseyCol = -1;
    for (var h = 0; h < headers.length; h++) {
      if (headers[h] === "jersey Number" || headers[h] === "Jurcy Number") {
        jerseyCol = h;
        break;
      }
    }
    var num = String(body.jerseyNumber || "").trim();
    if (jerseyCol >= 0 && num) {
      for (var r = 1; r < data.length; r++) {
        if (String(data[r][jerseyCol] || "").trim() === num) {
          return jsonResponse({
            error: "Jersey number " + num + " is already taken.",
          });
        }
      }
    }
    sheet.appendRow([
      new Date(),
      body.name || "",
      body.jerseyNumber || "",
      body.size || "",
      body.phone || "",
    ]);
    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ error: err.toString() });
  }
}
```

**If you still get an HTML error (“ত্রুটি”) when opening the Web app URL:** the script may be standalone (not bound to the sheet). Use this version instead and set your **Sheet ID** (from the sheet URL: `https://docs.google.com/spreadsheets/d/`**`SHEET_ID`**`/edit`):

```javascript
var SHEET_ID = "YOUR_SPREADSHEET_ID"; // Replace with the ID from your sheet URL

function doGet() {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheets()[0];
    var data = sheet.getDataRange().getValues();

    if (data.length < 2) {
      return jsonResponse([]);
    }

    var headers = data[0];
    var rows = [];
    for (var i = 1; i < data.length; i++) {
      var row = {};
      for (var j = 0; j < headers.length; j++) {
        row[headers[j]] = data[i][j] != null ? String(data[i][j]) : "";
      }
      rows.push(row);
    }
    return jsonResponse(rows);
  } catch (e) {
    return jsonResponse({ error: e.toString() });
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function doPost(e) {
  try {
    var body = e.postData ? JSON.parse(e.postData.contents) : {};
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheets()[0];
    var data = sheet.getDataRange().getValues();
    var headers = data.length > 0 ? data[0] : [];
    if (headers.length === 0 || !headers[0]) {
      sheet
        .getRange(1, 1, 1, 5)
        .setValues([
          [
            "Timestamp",
            "Your Name (jersey name)",
            "jersey Number",
            "Size",
            "Phone Number",
          ],
        ]);
      headers = [
        "Timestamp",
        "Your Name (jersey name)",
        "jersey Number",
        "Size",
        "Phone Number",
      ];
      data = [headers];
    }
    var jerseyCol = -1;
    for (var h = 0; h < headers.length; h++) {
      if (headers[h] === "jersey Number" || headers[h] === "Jurcy Number") {
        jerseyCol = h;
        break;
      }
    }
    var num = String(body.jerseyNumber || "").trim();
    if (jerseyCol >= 0 && num) {
      for (var r = 1; r < data.length; r++) {
        if (String(data[r][jerseyCol] || "").trim() === num) {
          return jsonResponse({
            error: "Jersey number " + num + " is already taken.",
          });
        }
      }
    }
    sheet.appendRow([
      new Date(),
      body.name || "",
      body.jerseyNumber || "",
      body.size || "",
      body.phone || "",
    ]);
    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ error: err.toString() });
  }
}
```

4. Save the project (e.g. name it "HOT GANG Sheet API").
5. Deploy:
   - Click **Deploy** → **New deployment** (or **Manage deployments** → Edit → New version).
   - Type: **Web app**.
   - **Execute as:** Me. **Who has access:** Anyone.
   - Click **Deploy**, authorize when asked, then copy the **Web app URL**.
6. **Important:** Open that Web app URL **in your browser** (while signed in as the owner). If Google shows “This app isn’t verified” → **Advanced** → **Go to … (unsafe)**. Then click **Allow**. This authorizes “Anyone” to run the app; until you do this, calls from your site will get an HTML error page (“ত্রুটি”) instead of JSON.
7. Put the Web app URL in `.env` as `GOOGLE_SHEETS_SCRIPT_URL`. The same URL is used for both **reading** the table (GET) and **saving** from the website form (POST). If you added `doPost` later, redeploy: **Deploy** → **Manage deployments** → **Edit** → **New version** → **Deploy**.

## 4. Env file

Copy `.env.example` to `.env` and set:

- `NEXT_PUBLIC_GOOGLE_FORM_URL` — your form’s “Send” link.
- `GOOGLE_SHEETS_SCRIPT_URL` — the Apps Script Web app URL from step 3.

Restart the Next.js dev server after changing `.env`.

## 5. Column names

The landing page table uses these column names (must match your form questions):

| Column in Sheet | Used for                 |
| --------------- | ------------------------ |
| Jurcy Number    | Jurcy #                  |
| Name            | Name                     |
| Size            | Size (S, M, L, XL, etc.) |
| Phone Number    | Phone                    |

## Troubleshooting

- **“Sheet URL returned a web page” or “ত্রুটি” (Error) page**  
  The script is returning HTML instead of JSON. Do this:
  1. **Script must be bound to the form-response sheet.** Open the Google Sheet that receives form responses (the one you linked in the form’s Responses tab) → **Extensions** → **Apps Script**. Do not use a standalone script; create the script from this sheet.
  2. Replace the script with the version above (with `try/catch`). **Deploy** → **Manage deployments** → **Edit** (pencil) → **Version** = New version → **Deploy**. Then open the Web app URL in your browser once and click **Allow** when Google asks.
  3. If you still see an error, the script now returns JSON like `{ "error": "..." }`. Your landing page will show that message so you can fix the cause (e.g. wrong sheet, permissions).

- **“Could not load team data”**  
  Check that `GOOGLE_SHEETS_SCRIPT_URL` is correct and the Apps Script is deployed as **Web app** with **Who has access: Anyone**.

- **Empty table**  
  Submit at least one test response in the form and wait a minute; the app caches sheet data for 60 seconds.

- **Wrong columns**  
  Ensure form question titles match the names above (or update `app/types/team.ts` to match your sheet headers).
