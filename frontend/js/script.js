// Homepage API call
fetch("http://127.0.0.1:8000/")
  .then(res => res.json())
  .then(data => {
    const output = document.getElementById("output");
    if (output) {
      output.innerText = data.message;
    }
  })
  .catch(() => {
    const output = document.getElementById("output");
    if (output) {
      output.innerText = "Server not running ❌";
    }
  });


// Button function
function goToAdmission() {
    window.location.href = "admission.html";
}


// 👇 FORM SUBMIT CODE (NEW ADD)
const form = document.getElementById("admissionForm");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
      name: document.getElementById("name").value,
      father: document.getElementById("father").value,
      email: document.getElementById("email").value,
      student_class: document.getElementById("class").value
    };

    fetch("http://127.0.0.1:8000/admission", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(data => {
        document.getElementById("result").innerText = data.message;
      })
      .catch(() => {
        document.getElementById("result").innerText = "Error ❌";
      });
  });
}