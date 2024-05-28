document.addEventListener("DOMContentLoaded", function () {
  const personData = document.getElementById("personData");

  // Получение токена из localStorage
  const token = localStorage.getItem("token");

  // Функция для получения данных профиля пользователя
  async function fetchUserProfile() {
    try {
      const response = await fetch(
        "http://localhost:5000/api/user/getInfoPerson",
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
    document.getElementById("email").value = data.user.email;
    document.getElementById("dateOfBirth").value = data.user.dateOfBirth;
    document.getElementById("seriesPassport").value = data.passport.series;
    document.getElementById("numberPassport").value = data.passport.number;
    document.getElementById("issuedBy").value = data.passport.issuedBy;
    document.getElementById("departmentCode").value =
      data.passport.divisionCode;
  }

  // Вызов функции для получения профиля при загрузке страницы
  fetchUserProfile();

  if (personData) {
    personData.addEventListener("submit", async function (event) {
      event.preventDefault();

      const firstName = document.getElementById("name").value;
      const middleName = document.getElementById("middleName").value;
      const lastName = document.getElementById("lastName").value;
      const email = document.getElementById("email").value;
      const dateOfBirth = document.getElementById("dateOfBirth").value; // Считывание даты рождения
      const seriesPassport = document.getElementById("seriesPassport").value;
      const numberPassport = document.getElementById("numberPassport").value;
      const issuedBy = document.getElementById("issuedBy").value;
      const departmentCode = document.getElementById("departmentCode").value;

      try {
        const response = await fetch("http://localhost:5000/api/user/newData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName,
            middleName,
            lastName,
            email,
            dateOfBirth, // Включение даты рождения в JSON
            passport: {
              series: seriesPassport,
              number: numberPassport,
              issuedBy,
              divisionCode: departmentCode,
            },
          }),
        });

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
