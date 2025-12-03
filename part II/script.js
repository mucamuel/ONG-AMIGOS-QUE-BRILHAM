const btnMenu = document.getElementById("btn-menu");
const nav = document.getElementById("menu");

btnMenu.addEventListener("click", () => {
  nav.classList.toggle("ativo");
});
