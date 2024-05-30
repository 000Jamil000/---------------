document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("emailInput");
  const datalist = document.getElementById("userEmails");
  const giveAccessBtn = document.getElementById("giveAccessBtn");
  const deleteManagerBtn = document.getElementById("deleteManagerBtn");

  emailInput.addEventListener("input", async () => {
    const email = emailInput.value;
    if (email.length > 2) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/admin/searchUsers?email=${email}`
        );
        const users = await response.json();
        datalist.innerHTML = "";
        users.forEach((user) => {
          const option = document.createElement("option");
          option.value = user.email;
          datalist.appendChild(option);
        });
      } catch (error) {
        console.error("Ошибка при поиске пользователей:", error);
      }
    }
  });

  giveAccessBtn.addEventListener("click", async () => {
    const token = localStorage.getItem("token");

    const email = emailInput.value;
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/updateRole",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email, role: "MANAGER" }),
        }
      );
      const result = await response.json();
      alert(result.message);
      fetchManagers(); // Обновить список менеджеров после изменения роли
    } catch (error) {
      console.error("Ошибка при обновлении роли:", error);
    }
  });

  deleteManagerBtn.addEventListener("click", async () => {
    const token = localStorage.getItem("token");
    const email = emailInput.value;
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/updateRole",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email, role: "USER" }),
        }
      );
      const result = await response.json();
      alert(result.message);
      fetchManagers(); // Обновить список менеджеров после изменения роли
    } catch (error) {
      console.error("Ошибка при обновлении роли:", error);
    }
  });

  async function fetchManagers() {
    try {
      const response = await fetch("http://localhost:5000/api/admin/getStuff");
      const managers = await response.json();
      const managersTableBody = document.querySelector("#managersTable tbody");
      managersTableBody.innerHTML = ""; // Очистка предыдущих данных

      managers.forEach((manager) => {
        const row = document.createElement("tr");
        const emailCell = document.createElement("td");
        emailCell.textContent = manager.email;
        const nameCell = document.createElement("td");
        if (manager.firstName && manager.lastName) {
          nameCell.textContent = `${manager.lastName} ${manager.firstName} ${
            manager.middleName || ""
          }`;
        } else {
          nameCell.textContent = manager.email;
        }
        row.appendChild(emailCell);
        row.appendChild(nameCell);
        managersTableBody.appendChild(row);
      });
    } catch (error) {
      console.error("Ошибка при получении менеджеров:", error);
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
  fetchManagers(); // Получить менеджеров при загрузке страницы
});
