const redirectToProfile = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/user/check", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Предположим, что вы используете localStorage для хранения токена
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      // Пользователь авторизован, перенаправляем на страницу профиля
      window.location.href = "http://localhost:5000/HTML/profilePerson.html";
    } else {
      // Пользователь не авторизован, перенаправляем на страницу входа
      window.location.href = "http://localhost:5000/HTML/Autorization.html";
    }
  } catch (error) {
    console.error("Произошла ошибка:", error);
    // Если произошла ошибка при запросе, перенаправляем на страницу входа
    window.location.href = "http://localhost:5000/HTML/Autorization.html";
  }
};

// Привязываем обработчик события нажатия на иконку профиля
const profileIcon = document.getElementById("redirectToProfile");
profileIcon.addEventListener("click", redirectToProfile);
