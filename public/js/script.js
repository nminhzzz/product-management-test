//Show alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = Number(showAlert.getAttribute("data-time")) || 3000;
  const closeAlert = showAlert.querySelector("[close-alert]");

  if (closeAlert) {
    closeAlert.addEventListener("click", () => {
      showAlert.classList.add("alert-hidden");
    });
  }

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);
}

//End Show alert
