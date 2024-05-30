function saveToLocalStorage() {
  const departureCity = document.getElementById("cityFrom").value;
  const arrivalCity = document.getElementById("destination").value;
  const departureDate = document.getElementById("departureDate").value;
  const returnDate = document.getElementById("arrivalDate").value;
  const timestamp = new Date().getTime();

  localStorage.setItem("departureCity", departureCity);
  localStorage.setItem("arrivalCity", arrivalCity);
  localStorage.setItem("departureDate", departureDate);
  localStorage.setItem("returnDate", returnDate);
  localStorage.setItem("timestamp", timestamp);

  // Удалить данные через одну минуту
  setTimeout(clearLocalStorage, 30000);
}

// Функция для очистки localStorage
function clearLocalStorage() {
  localStorage.removeItem("departureCity");
  localStorage.removeItem("arrivalCity");
  localStorage.removeItem("departureDate");
  localStorage.removeItem("returnDate");
  localStorage.removeItem("timestamp");
}

// Функция для восстановления значений полей ввода из localStorage
function loadFromLocalStorage() {
  const timestamp = localStorage.getItem("timestamp");
  const currentTime = new Date().getTime();

  if (timestamp && currentTime - timestamp < 60000) {
    // Проверка времени
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
  } else {
    clearLocalStorage();
  }
}

function saveTicketsToLocalStorage(tickets) {
  const timestamp = new Date().getTime();
  localStorage.setItem("tickets", JSON.stringify(tickets));
  localStorage.setItem("ticketsTimestamp", timestamp);

  // Удалить билеты через одну минуту
  setTimeout(() => {
    localStorage.removeItem("tickets");
    localStorage.removeItem("ticketsTimestamp");
  }, 60000);
}

// Функция для восстановления списка билетов из localStorage
function loadTicketsFromLocalStorage() {
  const ticketsTimestamp = localStorage.getItem("ticketsTimestamp");
  const currentTime = new Date().getTime();

  if (ticketsTimestamp && currentTime - ticketsTimestamp < 60000) {
    const tickets = localStorage.getItem("tickets");
    if (tickets) {
      return JSON.parse(tickets);
    }
  } else {
    localStorage.removeItem("tickets");
    localStorage.removeItem("ticketsTimestamp");
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
  // Загрузка данных из localStorage при загрузке страницы
  loadFromLocalStorage();

  const savedTickets = loadTicketsFromLocalStorage();
  if (savedTickets.length > 0) {
    displayTickets(savedTickets);
  }

  const searchForm = document.getElementById("searchForm");
  if (searchForm) {
    searchForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      saveToLocalStorage();

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
          saveTicketsToLocalStorage(data.tickets);
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
            <button class="buyButton" data-ticket-id="${
              ticket._id
            }" data-flight-id="${ticket.flightId._id}">Купить</button>
          </div>
        </div>
      `;
      ticketList.appendChild(ticketElement);
    });

    document.querySelectorAll(".buyButton").forEach((button) => {
      button.addEventListener("click", async function () {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("No token found");
          }
          const response = await fetch("http://localhost:5000/api/user/auth", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            const ticketId = this.dataset.ticketId;
            const flightId = this.dataset.flightId;
            openModal(ticketId, flightId);
          } else {
            window.location.href =
              "http://localhost:5000/HTML/Autorization.html";
          }
        } catch (error) {
          console.error("Произошла ошибка:", error);
          window.location.href = "http://localhost:5000/HTML/Autorization.html";
        }
      });
    });
  }

  const modal = document.getElementById("ticketModal");
  const span = document.getElementsByClassName("close")[0];

  function openModal(ticketId, flightId) {
    modal.style.display = "block";
    loadSeats(flightId);
    document.getElementById("confirmPurchase").dataset.ticketId = ticketId;
  }

  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  async function loadSeats(flightId) {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/ticket/seats?flightId=${flightId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Ошибка при загрузке мест");
      }

      const data = await response.json();
      console.log("Места загружены:", data);
      renderSeats(data.seats); // Передаем данные на рендеринг
    } catch (error) {
      console.error("Ошибка при получении мест", error);
    }
  }

  let selectedSeatId = null;

  const renderSeats = (seats) => {
    const seatsContainer = document.getElementById("seats-container");
    seatsContainer.innerHTML = ""; // Очистка контейнера перед добавлением новых элементов
    console.log(seats);

    seats.forEach((seat) => {
      const button = document.createElement("button");
      button.textContent = `Место ${seat.seatNumber}`;
      button.className = "seat-button";
      button.dataset.seatId = seat._id;
      button.addEventListener("click", function () {
        document
          .querySelectorAll(".seat-button")
          .forEach((btn) => btn.classList.remove("selected"));
        button.classList.add("selected");
        selectedSeatId = seat._id;
        console.log(selectedSeatId);
      });
      seatsContainer.appendChild(button);
    });
  };

  document
    .getElementById("confirmPurchase")
    .addEventListener("click", async function () {
      const ticketId = this.dataset.ticketId;

      if (!selectedSeatId) {
        alert("Выберите место");
        return;
      }

      if (!cardNumber) {
        alert("Введите номер карты");
        return;
      }

      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:5000/api/ticket/purchase`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ticketId: selectedSeatId,
            }),
          }
        );

        if (response.ok) {
          alert("Покупка прошла успешно");
          modal.style.display = "none";
          updateTicketStatus(ticketId);
        } else {
          alert("Ошибка при покупке билета");
        }
      } catch (error) {
        console.error("Произошла ошибка:", error);
      }
    });

  function updateTicketStatus(ticketId) {
    const tickets = loadTicketsFromLocalStorage();
    const updatedTickets = tickets.map((ticket) => {
      if (ticket._id === ticketId) {
        ticket.isPurchased = true;
      }
      return ticket;
    });
    saveTicketsToLocalStorage(updatedTickets);
    displayTickets(updatedTickets);
  }
});
