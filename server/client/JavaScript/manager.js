const profileBtn = document.getElementById("profileBtn");
const settingsBtn = document.getElementById("settingsBtn");

function redirectToProfileManager() {
  window.location.href =
    "http://127.0.0.1:5501/client/HTML/Manager/profileManager.html";
}

function redirectToRouteManagement() {
  window.location.href =
    "http://127.0.0.1:5501/client/HTML/Manager/routeManagement.html";
}

profileBtn.addEventListener("click", redirectToProfileManager);
settingsBtn.addEventListener("click", redirectToRouteManagement);

const departureDate = flatpickr("#departureDate", {
  dateFormat: "Y-m-d",
  minDate: "today",
  onChange: function (selectedDates, dateStr, instance) {
    arrivalDate.set("minDate", dateStr);
  },
});

const arrivalDate = flatpickr("#arrivalDate", {
  dateFormat: "Y-m-d",
  minDate: "today",
});
