import {ModalErro} from "../modulos/manipularFetch.js";
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
      const response = await fetch("https://682a8c8eab2b5004cb36fe12.mockapi.io/api/vi/users/users");
      const usuarios = await response.json();

      const usuarioEncontrado = usuarios.find(
        (u) => u.email === email && u.senha === senha
      ); 

      if (usuarioEncontrado) {
        alert("Login bem-sucedido! 🚀");
        localStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));
        window.location.href = "https://military-merciful-sprint.glitch.me/perfil/perfil.html";
      } else {
        alert("E-mail ou senha inválidos. 😕");
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      alert("Erro ao conectar com o servidor. 😓");
    }
  });
});
