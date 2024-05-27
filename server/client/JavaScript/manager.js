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

document.addEventListener("DOMContentLoaded", function () {
  const personDataManager = document.getElementById("personDataManager");

  // Получение токена из localStorage
  const token = localStorage.getItem("token");

  // Функция для получения данных профиля пользователя
  async function fetchManagerProfile() {
    try {
      const response = await fetch(
        "http://localhost:5000/api/user/getInfoManager",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при получении данных профиля");
      }

      const data = await response.json();
      populateProfileForm(data);
    } catch (error) {
      console.error("Произошла ошибка:", error);
    }
  }

  // Функция для заполнения формы данными профиля
  function populateProfileForm(data) {
    document.getElementById("name").value = data.user.firstName;
    document.getElementById("middleName").value = data.user.lastName;
    document.getElementById("lastName").value = data.user.middleName;
    document.getElementById("post").value = data.user.post;
  }

  // Вызов функции для получения профиля при загрузке страницы
  fetchManagerProfile();

  if (personDataManager) {
    personDataManager.addEventListener("submit", async function (event) {
      event.preventDefault();

      const firstName = document.getElementById("name").value;
      const middleName = document.getElementById("middleName").value;
      const lastName = document.getElementById("lastName").value;
      const post = document.getElementById("post").value;

      try {
        const response = await fetch(
          "http://localhost:5000/api/user/newDataManager",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              firstName,
              middleName,
              lastName,
              post,
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
    });
  }
});
