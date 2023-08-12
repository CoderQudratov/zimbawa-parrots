const add_parot_form = document.querySelector(".add-parrot");
function handleAddParrot(event) {
  const formData = new FormData(event.target);
  let parrotObj = {
    name: formData.get("parrot-title"),
    img: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFycm90fGVufDB8fDB8fHww&w=1000&q=80",
    price:'parrot-price'
  };
}
add_parot_form.addEventListener("submit", handleAddParrot);
