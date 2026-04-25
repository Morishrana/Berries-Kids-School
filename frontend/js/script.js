const GOOGLE_SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

function goToAdmission() {
  window.location.href = "admission.html";
}

function collectFormData(form) {
  const formData = new FormData(form);
  const payload = {};

  formData.forEach((value, key) => {
    payload[key] = value.toString().trim();
  });

  payload.submitted_at = new Date().toISOString();
  return payload;
}

async function submitToGoogleSheets(form, resultId) {
  const result = document.getElementById(resultId);

  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes("PASTE_YOUR")) {
    if (result) {
      result.innerText = "Add your Google Apps Script URL in js/script.js first.";
      result.className = "result-message error";
    }
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton ? submitButton.innerText : "";

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.innerText = "Submitting...";
  }

  if (result) {
    result.innerText = "Submitting form...";
    result.className = "result-message";
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(collectFormData(form))
    });

    const responseData = await response.json();

    if (!response.ok || responseData.status !== "success") {
      throw new Error(responseData.message || "Submission failed");
    }

    form.reset();

    if (result) {
      result.innerText = responseData.message || "Form submitted successfully.";
      result.className = "result-message success";
    }
  } catch (error) {
    if (result) {
      result.innerText = error.message || "Unable to submit the form.";
      result.className = "result-message error";
    }
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerText = originalButtonText;
    }
  }
}

const admissionForm = document.getElementById("admissionForm");
if (admissionForm) {
  admissionForm.addEventListener("submit", function (event) {
    event.preventDefault();
    submitToGoogleSheets(admissionForm, "result");
  });
}

const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    submitToGoogleSheets(contactForm, "contactResult");
  });
}
