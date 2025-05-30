document.addEventListener("DOMContentLoaded", () => {
      const senhaInput = document.getElementById("senha");
      const btnLogin = document.querySelector(".btn-login");

      // Criação visual dos requisitos
      const requisitos = document.createElement("div");
      requisitos.style.color = "white";
      requisitos.style.fontSize = "14px";
      requisitos.style.marginTop = "10px";

      requisitos.innerHTML = `
        <ul id="validadorSenha" style="list-style: none; padding-left: 0;">
          <li id="minChar">❌ Pelo menos 8 caracteres</li>
          <li id="maiuscula">❌ Pelo menos 1 letra maiúscula</li>
          <li id="minuscula">❌ Pelo menos 1 letra minúscula</li>
          <li id="numero">❌ Pelo menos 1 número</li>
        </ul>
      `;

      senhaInput.parentNode.appendChild(requisitos);

      function validarSenha(senha) {
        const minChar = senha.length >= 8;
        const maiuscula = /[A-Z]/.test(senha);
        const minuscula = /[a-z]/.test(senha);
        const numero = /[0-9]/.test(senha);

        document.getElementById("minChar").textContent = (minChar ? "✅" : "❌") + " Pelo menos 8 caracteres";
        document.getElementById("maiuscula").textContent = (maiuscula ? "✅" : "❌") + " Pelo menos 1 letra maiúscula";
        document.getElementById("minuscula").textContent = (minuscula ? "✅" : "❌") + " Pelo menos 1 letra minúscula";
        document.getElementById("numero").textContent = (numero ? "✅" : "❌") + " Pelo menos 1 número";

        return minChar && maiuscula && minuscula && numero;
      }

      senhaInput.addEventListener("input", () => {
        const senha = senhaInput.value;
        const valida = validarSenha(senha);
        btnLogin.disabled = !valida;
        btnLogin.style.opacity = valida ? "1" : "0.6";
        btnLogin.style.cursor = valida ? "pointer" : "not-allowed";
      });

      document.querySelector("form").addEventListener("submit", (e) => {
        if (!validarSenha(senhaInput.value)) {
          e.preventDefault();
          alert("Senha inválida. Por favor, cumpra todos os requisitos.");
        }
      });
    });