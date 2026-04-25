# Google Sheets Setup

This project no longer needs the local Python backend for form submission.

## What to connect

Both frontend forms submit to one Google Apps Script web app:

- `frontend/admission.html`
- `frontend/contact.html`

The URL must be added in:

- `frontend/js/script.js`

Replace:

```js
const GOOGLE_SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
```

with your deployed Apps Script web app URL.

## Google Sheet

Create a Google Sheet with two tabs:

1. `Admissions`
2. `Contacts`

Use these headers.

### Admissions tab

```text
submitted_at | name | father | email | student_class
```

### Contacts tab

```text
submitted_at | parent_name | phone | email | message
```

## Apps Script

Open `Extensions > Apps Script` from the Google Sheet and paste this:

```javascript
const ADMISSIONS_SHEET = "Admissions";
const CONTACTS_SHEET = "Contacts";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");
    const formType = data.formType;
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
      formType === "contact" ? CONTACTS_SHEET : ADMISSIONS_SHEET
    );

    if (!sheet) {
      throw new Error("Sheet tab not found");
    }

    if (formType === "contact") {
      sheet.appendRow([
        data.submitted_at || "",
        data.parent_name || "",
        data.phone || "",
        data.email || "",
        data.message || ""
      ]);
    } else {
      sheet.appendRow([
        data.submitted_at || "",
        data.name || "",
        data.father || "",
        data.email || "",
        data.student_class || ""
      ]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "Form submitted successfully."
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Deploy

1. Click `Deploy > New deployment`
2. Choose `Web app`
3. Execute as `Me`
4. Who has access: `Anyone`
5. Deploy and copy the web app URL
6. Paste that URL into `frontend/js/script.js`

## Notes

- The browser submits directly to Google Apps Script.
- The `backend/` folder is no longer required for form handling.
