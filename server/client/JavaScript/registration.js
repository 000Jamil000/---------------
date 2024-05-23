function show_hide_password(target) {
  var input = document.getElementById("passwordOne");
  if (input.classList.contains("password-visible")) {
    input.type = "password";
    input.classList.remove("password-visible");
  } else {
    input.type = "text";
    input.classList.add("password-visible");
  }
  return false;
}

document.addEventListener("DOMContentLoaded", function () {
  const registrationForm = document.getElementById("registrationForm");
  const registerButton = document.querySelector(".createAccount");

  if (registrationForm && registerButton) {
    registrationForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("passwordOne").value;
      const passwordTwo = document.getElementById("passwordTwo").value;

      // Обработка совпадения паролей
      if (password !== passwordTwo) {
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.textContent = "Пароли не совпадают!";
        console.log("sddsfs");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/user/registration",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          }
        );

        if (response.ok) {
          // Регистрация успешна
          window.location.href = "http://localhost:5000/HTML/index.html";
        } else {
          // Обработка ошибки при регистрации
          const errorMessage = document.getElementById("errorMessage");
          errorMessage.textContent = "Ошибка при регистрации";
        }
      } catch (error) {
        // Обработка ошибок сети или других ошибок
        console.error("Произошла ошибка:", error);
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.textContent = "Произошла ошибка. Попробуйте позже.";
      }
    });

    // Активация кнопки при совпадении паролей
    document.addEventListener("input", function () {
      const passwordOne = document.getElementById("passwordOne").value;
      const passwordTwo = document.getElementById("passwordTwo").value;
      const email = document.getElementById("email").value;
      registerButton.disabled = passwordOne !== passwordTwo && !email;
    });
  }
});
