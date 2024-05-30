document.getElementById("loginButton").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:5000/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.status === 404) {
      // Пользователь не найден
      alert("Пользователь не найден");
      window.location.href = "http://localhost:5000/HTML/Registration.html";
      return;
    }

    if (!response.ok) {
      // Другие ошибки
      throw new Error("Ошибка при входе");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    console.log("Token saved:", localStorage.getItem("token"));

    window.location.href = "http://localhost:5000/HTML/index.html";
  } catch (error) {
    alert(error.message);
  }
});
