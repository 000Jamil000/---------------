// Функция для сохранения значений полей ввода в localStorage
function saveToLocalStorage() {
  const departureCity = document.getElementById("cityFrom").value;
  const arrivalCity = document.getElementById("destination").value;
  const departureDate = document.getElementById("departureDate").value;
  const returnDate = document.getElementById("arrivalDate").value;

  localStorage.setItem("departureCity", departureCity);
  localStorage.setItem("arrivalCity", arrivalCity);
  localStorage.setItem("departureDate", departureDate);
  localStorage.setItem("returnDate", returnDate);
}

// Функция для восстановления значений полей ввода из localStorage
function loadFromLocalStorage() {
  const departureCity = localStorage.getItem("departureCity");
  const arrivalCity = localStorage.getItem("arrivalCity");
  const departureDate = localStorage.getItem("departureDate");
  const returnDate = localStorage.getItem("returnDate");

  if (departureCity) {
    document.getElementById("cityFrom").value = departureCity;
  }
  if (arrivalCity) {
    document.getElementById("destination").value = arrivalCity;
  }
  if (departureDate) {
    document.getElementById("departureDate").value = departureDate;
  }
  if (returnDate) {
    document.getElementById("arrivalDate").value = returnDate;
  }
}

// Функция для сохранения списка билетов в localStorage
function saveTicketsToLocalStorage(tickets) {
  localStorage.setItem("tickets", JSON.stringify(tickets));
}

// Функция для восстановления списка билетов из localStorage
function loadTicketsFromLocalStorage() {
  const tickets = localStorage.getItem("tickets");
  if (tickets) {
    return JSON.parse(tickets);
  }
  return [];
}

const departureDate = flatpickr("#departureDate", {
  dateFormat: "Y-m-d",
  minDate: "today",
  onChange: function (selectedDates, dateStr, instance) {
    arrivalDate.set("minDate", dateStr);
    saveToLocalStorage();
  },
});

const arrivalDate = flatpickr("#arrivalDate", {
  dateFormat: "Y-m-d",
  minDate: "today",
  onChange: function () {
    saveToLocalStorage();
  },
});

document.addEventListener("DOMContentLoaded", function () {
  loadFromLocalStorage(); // Восстановление значений при загрузке страницы

  const savedTickets = loadTicketsFromLocalStorage(); // Восстановление списка билетов
  if (savedTickets.length > 0) {
    displayTickets(savedTickets);
  }

  const searchForm = document.getElementById("searchForm");
  if (searchForm) {
    searchForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      saveToLocalStorage(); // Сохранение значений при отправке формы

      const departureCity = document.getElementById("cityFrom").value;
      const arrivalCity = document.getElementById("destination").value;
      const departureDate = document.getElementById("departureDate").value;
      const returnDate = document.getElementById("arrivalDate").value;

      try {
        const response = await fetch(
          `http://localhost:5000/api/ticket?departureCity=${encodeURIComponent(
            departureCity
          )}&arrivalCity=${encodeURIComponent(
            arrivalCity
          )}&departureDate=${encodeURIComponent(
            departureDate
          )}&returnDate=${encodeURIComponent(returnDate)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          saveTicketsToLocalStorage(data.tickets); // Сохранение билетов
          displayTickets(data.tickets);
        } else {
          console.error("Ошибка при получении билетов");
        }
      } catch (error) {
        console.error("Произошла ошибка:", error);
      }
    });
  }

  function displayTickets(tickets) {
    const ticketList = document.getElementById("ticketList");
    ticketList.innerHTML = "";

    if (tickets.length === 0) {
      ticketList.innerHTML = "<p>Билеты не найдены</p>";
      return;
    }

    tickets.forEach((ticket) => {
      const ticketElement = document.createElement("div");
      ticketElement.classList.add("ticket");
      ticketElement.innerHTML = `
        <div class="ticket-details">
          <div>
            <p>${ticket.flightId.departureCity} - ${
        ticket.flightId.arrivalCity
      }</p>
            <p>Дата вылета: ${new Date(
              ticket.flightId.departureDate
            ).toLocaleDateString()}</p>
            <p>Время вылета: ${ticket.flightId.departureTime}</p>
            <p>Время прилета: ${ticket.flightId.arrivalTime}</p>
            <p>Класс: ${ticket.flightId.serviceClass}</p>
          </div>
          <div class="price-and-buy">
            <p>${ticket.price}$</p>
            <button>Купить</button>
          </div>
        </div>
      `;
      ticketList.appendChild(ticketElement);
    });
  }

  // Сохранение значений при изменении полей ввода
  document
    .getElementById("cityFrom")
    .addEventListener("input", saveToLocalStorage);
  document
    .getElementById("destination")
    .addEventListener("input", saveToLocalStorage);
  document
    .getElementById("departureDate")
    .addEventListener("input", saveToLocalStorage);
  document
    .getElementById("arrivalDate")
    .addEventListener("input", saveToLocalStorage);
});
