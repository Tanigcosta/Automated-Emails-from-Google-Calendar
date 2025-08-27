# Calendar → Email Automation (Google Apps Script)

Send friendly, branded emails **automatically** based on your Google Calendar events.
This script reads events for **today**, extracts **recipients from the event description**, personalizes the message with the **name in the event title**, and can **embed an image from Google Drive** at the end of the email.

---

## ✨ Features

* **Calendar-driven**: runs daily and scans events scheduled for today.
* **Human-friendly input**: list recipients directly in the **event description**.
* **Personalization**: name is taken from the **event title** (e.g., `Tania Birthday`).
* **Inline image**: embeds a Drive image at the end of the email (not just attached).
* **Safe defaults**: logs clearly, and skips events without recipients.

> The sample copy in the script is in Portuguese and references “Pure stay”.
> You can edit the message text to match your brand and tone.

---

## 🧩 How it works (high level)

1. Looks up your calendar by **Calendar ID**.
2. Gets **today’s events** and filters by titles containing `birthday` (case-insensitive).
3. From the title, extracts the **name** (e.g., `Tania Birthday` → `Tania`).
4. From the description, extracts **all emails** it finds.
5. Sends an email to each recipient. If a Drive **image** is available, embeds it inline at the end.

---

## ✅ Prerequisites

* A Google account with access to:

  * **Google Calendar** (the calendar you want to read)
  * **Gmail** (to send emails)
  * **Google Drive** (if you use an inline image)
* A calendar with events following the format:

  * **Title**: `Name Birthday` (e.g., `Tania Birthday`)
  * **Description**: includes one or more emails (comma/semicolon/space separated)

**Authorizations (first run):**

* `CalendarApp` (read events)
* `MailApp` (send emails)
* `DriveApp` (read the image blob for inline embedding)

---

## 🚀 Setup (step-by-step)

1. Open **Google Apps Script**: go to [https://script.new](https://script.new)
2. Paste your code into `Code.gs`.
3. Set your **Calendar ID** (you can keep `"primary"` or use a specific ID).

   * To find a Calendar ID: Google Calendar → **⋮** next to the calendar → **Settings & sharing** → **Integrate calendar** → **Calendar ID**.
4. (Optional) Pick an **image in Google Drive** to embed at the end of the email.

   * Get its **File ID** from the sharing link (`.../d/<FILE_ID>/view`).
   * The script uses: `DriveApp.getFileById('<FILE_ID>').getBlob()`.
   * Make sure **your account** (the one running the script) can access that file.
5. Click **Run** → choose `sendBirthdayMessages` → approve permissions.

---

## 🧪 Create a test event

In Google Calendar (same account that runs the script):

* **Title**: `Tania Birthday`
* **Description**:

  ```
  tania@example.com, reservas@empresa.pt
  ```
* Make it an event **for today** (the script checks “today”).

Run the function again. You should see logs like:

```
Enviado para: tania@example.com | Evento: Tania Birthday
```

> If you added a Drive File ID in the script, the image will appear at the end of the email as an **inline** image.

---

## ⏱️ Automate it (daily trigger)

In Apps Script:

1. Left sidebar → **Triggers**.
2. **Add Trigger** → Function: `sendBirthdayMessages`
3. Event source: **Time-driven**
4. Type: **Day timer** (e.g., 08:00)
5. Save.

Now it runs every day at the time you chose.

---

## 🔧 Configuration notes (matching this script)

* **Event title pattern**: the script looks for the word `birthday` in the title and extracts the name either **before** or **after** that word (e.g., `Birthday Tania` also works).
* **Recipients**: any valid emails in the **Description** are collected (comma/semicolon/space separated).
* **Inline image**: the script references the image with `cid:hero` and embeds it in the email HTML body.

If you want to:

* **Target different events** (not only “birthday”): change the filter `if (!/birthday/i.test(title)) return;`
* **Use a different name rule**: edit `extractNameFromTitle()` to match your conventions.
* **Change the copy/branding**: edit the `subject`, `message`, and the HTML block.

---

## 🔐 Security & best practices

* **Do not publish secrets**: you don’t need secrets for this script, but never commit keys/tokens if you add APIs later.
* **Access control**: the Drive file does **not** need to be public; it only needs to be readable by the script’s account.
* **Quotas**: Apps Script & Gmail have daily quotas. Keep your sends reasonable.
* **Timezone**: set the script timezone in **Project Settings** to match your operations.

---

## 🩺 Troubleshooting

* **`TypeError: Cannot read properties of null (reading 'getEventsForDay')`**
  Your calendar ID is wrong or inaccessible. Try `"primary"` or paste the exact Calendar ID from *Settings & sharing*.
* **No emails found**
  Ensure the event description includes at least one valid email.
* **Image not showing**
  The Drive file might not be accessible to the script account, or the email client blocked images. Inline images are more reliable than external URLs.
* **Nothing sent**
  Check execution logs (left sidebar → **Executions**). Also confirm the event is **today** and the title includes `birthday`.

---

