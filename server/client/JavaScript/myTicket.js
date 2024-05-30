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

  // Функция для отображения билетов
  function displayTickets(tickets) {
    myTicketContainer.innerHTML = ""; // Очистка контейнера перед отображением новых данных
    if (tickets.length === 0) {
      myTicketContainer.innerHTML = "<p>У вас нет купленных билетов.</p>";
    } else {
      tickets.forEach((ticket) => {
        const ticketElement = document.createElement("div");
        ticketElement.classList.add("ticket");

        ticketElement.innerHTML = `
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
            <p><strong>Цена:</strong> ${ticket.price}</p>
          `;

        myTicketContainer.appendChild(ticketElement);
      });
    }
  }

  // Вызов функции для получения билетов при загрузке страницы
  fetchUserTickets();
});
