const profileBtn = document.getElementById("profileBtn");
const settingsBtn = document.getElementById("settingsBtn");

function redirectToProfileAdmin() {
  window.location.href =
    "http://127.0.0.1:5501/client/HTML/Manager/profileAdmin.html";
}

function redirectToAccessSettings() {
  window.location.href =
    "http://127.0.0.1:5501/client/HTML/Manager/accessSettings.html";
}

profileBtn.addEventListener("click", redirectToProfileAdmin);
settingsBtn.addEventListener("click", redirectToAccessSettings);
