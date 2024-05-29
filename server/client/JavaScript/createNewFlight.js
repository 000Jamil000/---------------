const profileBtn = document.getElementById("profileBtn");
const routeManagementBtn = document.getElementById("settingsBtn");

function redirectToProfileManager() {
  window.location.href =
    "http://localhost:5000/HTML/Manager/profileManager.html";
}

function redirectToRouteManagement() {
  window.location.href =
    "http://localhost:5000/HTML/Manager/routeManagement.html";
}

profileBtn.addEventListener("click", redirectToProfileManager);
routeManagementBtn.addEventListener("click", redirectToRouteManagement);

const departureDate = flatpickr("#departureDate", {
  dateFormat: "Y-m-d",
  minDate: "today",
});

function isNumberKey(evt) {
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
  return true;
}

document.addEventListener("DOMContentLoaded", function () {
  const createNewFlight = document.getElementById("createNewFlight");
  const token = localStorage.getItem("token");

  // Функция для отправки запроса на удаление билета
  async function deleteTicket(
    departureCity,
    arrivalCity,
    departureDate,
    departureTime,
    arrivalTime,
    flightNumber,
    serviceClass,
    seatNumber,
    price
  ) {
    try {
      const response = await fetch("http://localhost:5000/api/ticket/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          departureCity,
          arrivalCity,
          departureDate,
          departureTime,
          arrivalTime,
          flightNumber,
          serviceClass,
          seatNumber,
          price,
        }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при удалении билета");
      } else {
        const data = await response.json();
        console.log("Билет успешно удален", data);
      }
    } catch (error) {
      console.error("Произошла ошибка при удалении билета:", error);
    }
  }

  async function createTicket(
    departureCity,
    arrivalCity,
    departureDate,
    departureTime,
    arrivalTime,
    flightNumber,
    serviceClass,
    seatNumber,
    price,
    ticketCount
  ) {
    try {
      const response = await fetch(
        "http://localhost:5000/api/ticket/newTicket",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            departureCity,
            arrivalCity,
            departureDate,
            departureTime,
            arrivalTime,
            flightNumber,
            serviceClass,
            seatNumber,
            price,
            ticketCount,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при сохранении данных");
      } else {
        const data = await response.json();
        console.log("Данные успешно сохранены", data);
      }
    } catch (error) {
      console.error("Произошла ошибка:", error);
    }
  }

  createNewFlight.addEventListener("submit", async function (event) {
    event.preventDefault();
    const departureCity = document.getElementById("departureCity").value;
    const arrivalCity = document.getElementById("arrivalCity").value;
    const departureDate = document.getElementById("departureDate").value;
    const departureTime = document.getElementById("departureTime").value;
    const arrivalTime = document.getElementById("arrivalTime").value;
    const flightNumber = document.getElementById("flightNumber").value;
    const serviceClass = document.getElementById("serviceClass").value;
    const seatNumber = document.getElementById("seatNumber").value;
    const price = document.getElementById("price").value;
    const ticketCount = document.getElementById("ticketCount").value;

    const submitButton = event.submitter;

    // Если нажата кнопка "Добавить рейс"
    if (submitButton.classList.contains("addFlight")) {
      createTicket(
        departureCity,
        arrivalCity,
        departureDate,
        departureTime,
        arrivalTime,
        flightNumber,
        serviceClass,
        seatNumber,
        price,
        ticketCount
      );
    }

    // Если нажата кнопка "Удалить рейс"
    if (submitButton.classList.contains("deleteFlight")) {
      deleteTicket(
        departureCity,
        arrivalCity,
        departureDate,
        departureTime,
        arrivalTime,
        flightNumber,
        serviceClass,
        seatNumber,
        price
      );
    }
  });

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
});
