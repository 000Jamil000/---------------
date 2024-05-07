flatpickr("#departureDate", {
  dateFormat: "Y-m-d",
  minDate: "today",
});
flatpickr("#arrivalDate", {
  dateFormat: "Y-m-d",
  minDate: "today",
});

const ticketList = document.getElementById("ticketList");

function redirectToProfile() {
  window.location.href = "http://127.0.0.1:5501/client/HTML/profilePerson.html";
}
