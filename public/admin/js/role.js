const tablePermissions = document.querySelector("[table-permissions]");

if (tablePermissions) {
  const buttonSubmit = document.querySelector("[button-submit]");

  buttonSubmit.addEventListener("click", () => {
    let permissions = []; // ✅ reset mỗi lần submit

    const rows = tablePermissions.querySelectorAll("[data-name]");

    rows.forEach((row) => {
      const name = row.getAttribute("data-name");
      const inputs = row.querySelectorAll("input");

      if (name === "id") {
        inputs.forEach((input) => {
          permissions.push({
            id: input.value,
            permissions: [],
          });
        });
      } else {
        inputs.forEach((input, index) => {
          if (input.checked && permissions[index]) {
            permissions[index].permissions.push(name);
          }
        });
      }
    });

    if (permissions.length > 0) {
      const form = document.querySelector("#form-change-permissions");
      const input = form.querySelector("input[name=permissions]");

      input.value = JSON.stringify(permissions);
      form.submit();

      // ✅ clear lại input nếu cần
      // input.value = "";
    }
  });
}
