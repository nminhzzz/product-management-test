const inputsQuantity = document.querySelectorAll("input[name='quantity']");
if (inputsQuantity.length > 0) {
  inputsQuantity.forEach((input) => {
    input.addEventListener("change", (e) => {
      const newQuantity = e.target.value;
      const productId = input.getAttribute("product-id");
      window.location.href = `/cart/update/${productId}/${newQuantity}`;
    });
  });
}
