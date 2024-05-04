flatpickr("#departureDate", {
  dateFormat: "Y-m-d",
  minDate: "today",
});
flatpickr("#arrivalDate", {
  dateFormat: "Y-m-d",
  minDate: "today",
});

const ticketList = document.getElementById("ticketList");

fetch()
  .then((response) => {
    if (!response.ok) {
      throw new Error("Ошибка загрузки данных о билетах");
    }
    return response.json();
  })
  .then((tickets) => {
    const ticketElement = document.createElement("div");
    ticketElement.classList.add("ticket");

    ticketElement.innerHTML = `
          <div class="direction">${ticket.cityOf}</div>
          <div class="direction">${ticket.cityTo}</div>
          <div class="date">${ticket.departureDate}</div>
          <div class="time">${ticket.departureTime}</div>
          <button class="buy-button">Купить</button>
      `;

    ticketList.appendChild(ticketElement);
  })
  .catch((error) => {
    console.error("Произошла ошибка:", error);
  });
