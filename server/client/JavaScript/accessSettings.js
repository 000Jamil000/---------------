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
        console.error("Error fetching users:", error);
      }
    }
  });

  giveAccessBtn.addEventListener("click", async () => {
    const email = emailInput.value;
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/updateRole",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, role: "MANAGER" }),
        }
      );
      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error("Error updating role:", error);
    }
  });

  deleteManagerBtn.addEventListener("click", async () => {
    const email = emailInput.value;
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/updateRole",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, role: "USER" }),
        }
      );
      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error("Error updating role:", error);
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
