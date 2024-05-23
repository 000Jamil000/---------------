document.addEventListener("DOMContentLoaded", function () {
  const personData = document.getElementById("personData");
  if (personData) {
    searchForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const firstName = document.getElementById("name").value;
      const middleName = document.getElementById("middleName").value;
      const lastName = document.getElementById("lastName").value;
      const email = document.getElementById("email").value;
      const seriesPassport = document.getElementById("seriesPassport").value;
      const numberPassport = document.getElementById("numberPassport").value;
      const issuedBy = document.getElementById("issuedBy").value;
      const departmentCode = document.getElementById("departmentCode").value;

      try {
        const response = await fetch(
          `http://localhost:5000/api/user/newData?firstName=${encodeURIComponent(
            firstName
          )}&middleName=${encodeURIComponent(
            middleName
          )}&lastName=${encodeURIComponent(
            lastName
          )}&email=${encodeURIComponent(
            email
          )}&seriesPassport=${encodeURIComponent(
            seriesPassport
          )}&numberPassport=${encodeURIComponent(
            numberPassport
          )}&issuedBy=${encodeURIComponent(
            issuedBy
          )}&departmentCode=${encodeURIComponent(departmentCode)}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
        } else {
          console.error("Ошибка при сохранении данных");
        }
      } catch (error) {
        console.error("Произошла ошибка:", error);
      }
    });
  }
});
