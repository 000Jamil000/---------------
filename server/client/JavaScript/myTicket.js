document.addEventListener("DOMContentLoaded", function () {
  const myTicketContainer = document.getElementById("myTicket");

  // Получение токена из localStorage
  const token = localStorage.getItem("token");

  // Функция для получения купленных билетов пользователя
  async function fetchUserTickets() {
    try {
      const response = await fetch(
        "http://localhost:5000/api/ticket/getUserTicket",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при получении билетов пользователя");
      }

      const data = await response.json();
      displayTickets(data.tickets);
    } catch (error) {
      console.error("Произошла ошибка:", error);
    }
  }

  logoutBtn.addEventListener("click", async () => {
    try {
      const response = await fetch("http://localhost:5000/api/user/logout", {
        method: "POST",
      });
      const result = await response.json();
      alert(result.message);
      localStorage.removeItem("token");
      window.location.href = "http://localhost:5000/HTML/index.html";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  });

  const deleteBtn = document.getElementById("deleteBtn");
  deleteBtn.addEventListener("click", async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/user/deleteUser",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            token,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Ошибка при удалении аккаунта");
      } else {
        const data = await response.json();
        console.log("Аккаунт успешно удален", data);
        localStorage.removeItem("token");
        window.location.href = "http://localhost:5000/HTML/index.html";
      }
    } catch (error) {
      console.error("Произошла ошибка при удалении аккаунта:", error);
    }
  });
  // Функция для отображения билетов
  function displayTickets(tickets) {
    const myTicketContainer = document.getElementById("myTicketContainer");
    myTicketContainer.innerHTML = ""; // Очистка контейнера перед отображением новых данных
    // Очистка контейнера перед отображением новых данных
    if (tickets.length === 0) {
      myTicketContainer.innerHTML = "<p>У вас нет купленных билетов.</p>";
    } else {
      tickets.forEach((ticket) => {
        const ticketElement = document.createElement("div");
        ticketElement.classList.add("ticket");

        ticketElement.innerHTML = `
        <div class="ticket-details">
          <div>
            <p><strong>Рейс:</strong> ${ticket.flightId.departureCity} - ${
          ticket.flightId.arrivalCity
        }</p>
            <p><strong>Дата вылета:</strong> ${new Date(
              ticket.flightId.departureDate
            ).toLocaleDateString()}</p>
            <p><strong>Время вылета:</strong> ${
              ticket.flightId.departureTime
            }</p>
            <p><strong>Время прибытия:</strong> ${
              ticket.flightId.arrivalTime
            }</p>
            <p><strong>Класс обслуживания:</strong> ${
              ticket.flightId.serviceClass
            }</p>
            <p><strong>Номер места:</strong> ${ticket.seatNumber}</p>
          </div>
          <div class="price-and-buy">
            <p>${ticket.price}$</p>
          </div>
        </div>
      `;

        myTicketContainer.appendChild(ticketElement);
      });
    }
  }

  // Вызов функции для получения билетов при загрузке страницы
  fetchUserTickets();
});
