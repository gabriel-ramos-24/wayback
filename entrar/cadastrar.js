import {ModalErro} from "../modulos/manipularFetch.js";
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;
    const confirmar = document.getElementById("confirmar").value;

    // Validação simples
    if (senha !== confirmar) {
      alert("As senhas não coincidem!");
      return;
    }

    // Dados que serão enviados para a API
    const data = {
      nome,
      email,
      usuario,
      senha
    };

    try {
      const response = await fetch("https://682a8c8eab2b5004cb36fe12.mockapi.io/api/vi/users/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert("Usuário cadastrado com sucesso!");
        localStorage.setItem("usuarioLogado", JSON.stringify(data));
        window.location.href = "https://military-merciful-sprint.glitch.me/entrar/login.html"; //Redirecionando o usuário para a tela de login após o cadastro bem sucedido
        form.reset(); // limpa o formulário
      } else {
        alert("Erro ao cadastrar. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao enviar para o MockAPI:", error);
      alert("Erro de rede. Verifique sua conexão.");
    }
  });
});
