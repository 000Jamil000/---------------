const redirectToProfile = async () => {
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
      window.location.href = data.redirectUrl;
    } else {
      window.location.href = "http://localhost:5000/HTML/Autorization.html";
    }
  } catch (error) {
    console.error("Произошла ошибка:", error);
    window.location.href = "http://localhost:5000/HTML/Autorization.html";
  }
};

// Привязываем обработчик события нажатия на иконку профиля
const profileIcon = document.getElementById("redirectToProfile");
profileIcon.addEventListener("click", redirectToProfile);
