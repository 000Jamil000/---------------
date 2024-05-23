document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  // Функция для отправки запроса на сервер
  async function fetchUserProfile() {
    try {
      const response = await fetch("/api/profile");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Ошибка при получении профиля пользователя", error);
    }
  }

  // Функция для заполнения полей формы данными пользователя
  async function populateFormFields() {
    const profileData = await fetchUserProfile();
    if (!profileData) return;

    const {
      user: { firstName, lastName, middleName, email },
      passport: { series, number, issuedBy, divisionCode },
    } = profileData;

    form.querySelector('input[name="firstName"]').value = firstName;
    form.querySelector('input[name="lastName"]').value = lastName;
    form.querySelector('input[name="middleName"]').value = middleName;
    form.querySelector('input[name="email"]').value = email;
    form.querySelector('input[name="series"]').value = series;
    form.querySelector('input[name="number"]').value = number;
    form.querySelector('input[name="issuedBy"]').value = issuedBy;
    form.querySelector('input[name="divisionCode"]').value = divisionCode;
  }

  // Вызываем функцию заполнения полей формы при загрузке страницы
  populateFormFields();
});
