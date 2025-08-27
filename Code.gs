function sendBirthdayMessages() {
  var calendarId = "Primary"; // Specific calendar ID
  var today = new Date();

  // Get today's events
  var events = CalendarApp.getCalendarById(calendarId).getEventsForDay(today);

  // --- set the in Drive image (inline) ---
  var fileId = "Drive Link"; // image drive Link
  var imgBlob = null;
  try {
    imgBlob = DriveApp.getFileById(fileId).getBlob().setName("aniversario.png");
  } catch (e) {
    Logger.log("⚠️ Could not load the image: " + e);
  }

  events.forEach(function(event) {
    var title = (event.getTitle() || "").trim();

    // only process events that contain "birthday"
    if (!/birthday/i.test(title)) return;

    // 1) Extract name from title (eg.: "Tania Birthday" or "Birthday Tania")
    var name = extractNameFromTitle(title);

    // 2) Extract emails from description
    var description = event.getDescription() || "";
    var emails = extractEmails(description);

    if (emails.length === 0) {
      Logger.log("No email found in event: " + title);
      return;
    }

    // 3) Personalised message
    var subject = "Happy birthday 🎂 " + name + "!";
    var message =
      "Happy birthday, " + name + "! 🎉\n\n" +
      "I wish you an amazing birthday day.\n" +
      "And a year to collect amazing memories.\n\n" +
      "Best wishes,\n" +
      "Tânia";

    // HTML with the image in the end (cid:hero)
    var html =
      '<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,sans-serif;line-height:1.7">' +
        '<p>' + message
          .replace(/&/g,'&amp;')
          .replace(/</g,'&lt;')
          .replace(/>/g,'&gt;')
          .replace(/\n\n/g,'</p><p>')
          .replace(/\n/g,'<br>') +
        '</p>' +
        (imgBlob ? '<div style="margin-top:16px;"><img src="cid:hero" alt="Aniversário" style="max-width:100%;height:auto;border-radius:12px;"></div>' : '') +
      '</div>';

    // 4) Send (with imagem inline if available)
    emails.forEach(function(email) {
      if (imgBlob) {
        MailApp.sendEmail(email, subject, message, {
          htmlBody: html,
          inlineImages: { hero: imgBlob } // corresponde ao cid:hero no HTML
        });
      } else {
        MailApp.sendEmail(email, subject, message);
      }
      Logger.log("Enviado para: " + email + " | Evento: " + title);
    });
  });
}

/** Extract the name from the title containing "birthday" (before or after). */
function extractNameFromTitle(title) {
  // Parse by term "birthday" (case-insensitive) and tries to get the name part
  var parts = title.split(/birthday/i);
  var before = (parts[0] || "").replace(/[-–|]/g, "").trim();
  var after  = (parts[1] || "").replace(/[-–|]/g, "").trim();

  var candidate = before || after || "Cliente";

  // Capitalize first letter of each word
  return candidate.replace(/\S+/g, function(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}

/** Extract all the e-mails from description; supports commas, semicolon and tab. */
function extractEmails(text) {
  var emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/g;
  var matches = text.match(emailRegex) || [];
  // Normalize and remove duplicates
  var unique = Array.from(new Set(matches.map(function(e){ return e.trim(); })));
  return unique;
}
