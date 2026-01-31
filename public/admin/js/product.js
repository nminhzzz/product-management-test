// change-status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  console.log(formChangeStatus);
  const path = formChangeStatus.getAttribute("data-path");

  buttonChangeStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");
      let statusChange = statusCurrent == "active" ? "inactive" : "active";
      const action = path + `/${statusChange}/${id}?_method=PATCH`;
      formChangeStatus.action = action;
      formChangeStatus.submit();
    });
  });
}
//chang-multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector('input[name="checkAll"]');
  const inputsId = checkboxMulti.querySelectorAll('input[name="id"]');
  inputCheckAll.addEventListener("click", () => {
    if (inputCheckAll.checked) {
      inputsId.forEach((input) => {
        input.checked = true;
      });
    } else {
      inputsId.forEach((input) => {
        input.checked = false;
      });
    }
  });
  inputsId.forEach((input) => {
    input.addEventListener("click", () => {
      const countChecked = checkboxMulti.querySelectorAll(
        'input[name="id"]:checked'
      ).length;
      if (countChecked === inputsId.length) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
    });
  });
}
//end change-multi

//form change-multi

const formChangeMulti = document.querySelector(
  'form[name="form-change-multi"]'
);

if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();
    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const inputsChecked = checkboxMulti.querySelectorAll(
      'input[name="id"]:checked'
    );
    const inputIds = document.querySelector(`input[name="ids"]`);

    const typeChange = e.target.elements.type.value;
    if (typeChange == "delete-all") {
      const isConfirm = confirm("bạn có muốn xoá những sản phẩm này không");
      if (!isConfirm) {
        return;
      }
    }
    if (inputsChecked.length > 0) {
      let ids = [];
      inputsChecked.forEach((input) => {
        const id = input.value;
        if (typeChange == "change-position") {
          const positionChange = input
            .closest("tr")
            .querySelector(`input[name="position"]`).value;
          ids.push(`${id}-${positionChange}`);
        } else {
          ids.push(id);
        }
      });
      inputIds.value = ids.join(", ");
      formChangeMulti.submit();
    } else {
      alert("vui lòng chọn ít nhất một bản ghi");
    }
  });
}
//end form change-multi
// end change status

//delete product
const buttonDelete = document.querySelectorAll("[button-delete]");
if (buttonDelete.length > 0) {
  const formDeleteItem = document.querySelector("#form-delete-item");
  const path = formDeleteItem.getAttribute("data-path");
  buttonDelete.forEach((button) => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("bạn có chắc chắn xoá không");
      if (isConfirm) {
        const id = button.getAttribute("data-id");
        const action = `${path}/${id}?_method=DELETE`;
        formDeleteItem.action = action;
        formDeleteItem.submit();
      }
    });
  });
}

//end delete product
