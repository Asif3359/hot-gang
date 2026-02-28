/**
 * HOT GANG – Google Apps Script (bound to your response sheet)
 * - doGet: returns sheet rows as JSON for the site
 * - doPost: appends a row from the site; enforces unique jersey number only (no size+number check)
 */

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

function doPost(e) {
  try {
    var body = e.postData ? JSON.parse(e.postData.contents) : {};
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0];
    var data = sheet.getDataRange().getValues();
    var headers = data.length > 0 ? data[0] : [];
    if (headers.length === 0 || !headers[0]) {
      sheet.getRange(1, 1, 1, 5).setValues([[
        "Timestamp",
        "Your Name (jersey name)",
        "jersey Number",
        "Size",
        "Phone Number",
      ]]);
      headers = ["Timestamp", "Your Name (jersey name)", "jersey Number", "Size", "Phone Number"];
      data = [headers];
    }
    // Only jersey number must be unique (one per member); no same-size-with-number check
    var jerseyCol = -1;
    var jerseyNames = ["jersey Number", "Jurcy Number", "jerseyNumber"];
    for (var h = 0; h < headers.length; h++) {
      if (jerseyNames.indexOf(headers[h]) !== -1) {
        jerseyCol = h;
        break;
      }
    }
    var num = String(body.jerseyNumber || "").trim();
    if (jerseyCol >= 0 && num) {
      for (var r = 1; r < data.length; r++) {
        if (String(data[r][jerseyCol] || "").trim() === num) {
          return jsonResponse({ error: "Jersey number " + num + " is already taken." });
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

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
