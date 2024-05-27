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
