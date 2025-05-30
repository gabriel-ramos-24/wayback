import {UsuariosAPI} from "../modulos/manipularFetch.js";

//alterar dados de cadastro
document.addEventListener("DOMContentLoaded", () => {
  const nome = document.getElementById("nome");
  const usuario = document.getElementById("usuario");
  const email = document.getElementById("email");
  const btnSalvar = document.getElementById("btnSalvar");
  const usuariosAPI = new UsuariosAPI();
  const usuarioLog = JSON.parse(localStorage.getItem("usuarioLogado"));

  if (usuarioLog) {
    nome.value = usuarioLog.nome;
    usuario.value = usuarioLog.usuario;
    email.value = usuarioLog.email;
   
  } else {
    console.warn("Nenhum usuário logado encontrado no localStorage.");
  }
  
  btnSalvar.addEventListener("click", async () => {
    const novoNome = nome.value;
    const novoUsuario = usuario.value;
    const novoEmail = email.value;

    try {
      const userId = usuarioLog.users;

      if (novoNome !== usuarioLog.nome) {
        const respostaNome = await usuariosAPI.alterarUsuario(userId, "nome", novoNome);
        usuarioLog.nome = respostaNome.nome;
      }
      if (novoUsuario !== usuarioLog.usuario) {
        const respostaUsuario = await usuariosAPI.alterarUsuario(userId, "usuario", novoUsuario);
        usuarioLog.usuario = respostaUsuario.usuario;
      }

      if (novoEmail !== usuarioLog.email) {
        const respostaEmail = await usuariosAPI.alterarUsuario(userId, "email", novoEmail);
        usuarioLog.email = respostaEmail.email;
      }

      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLog));
      alert("Dados alterados com sucesso!");

    } catch (erro) {
      console.error("Erro ao alterar os dados:", erro);
      alert("Erro ao alterar os dados.");
    }
  });

//modal de trocar senha
const modalSenha = document.querySelector('.modalSenha');
const fecharModal = document.getElementById('fecharModalSenha');
const trocarSenha = document.getElementById('btnTrocar');
const btnSalvarSenha = document.getElementById('salvarSenha');
const senhaNova = document.querySelector("#novaSenha");
const confirmar = document.querySelector("#confirmSenha");

function abrirModalSenha() {
  modalSenha.style.display = 'block';
  }
function fechaModal() {
  modalSenha.style.display = 'none';
  senhaNova.value = "";
  confirmar.value = "";
  }

if (trocarSenha) {
  trocarSenha.addEventListener('click', abrirModalSenha);
  }
if (fecharModal) {
  fecharModal.addEventListener('click', fechaModal);
  }
//salvar senha   
    const requisitos = document.createElement("div");
      requisitos.style.color = "black";
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

      senhaNova.parentNode.appendChild(requisitos);

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
  
  senhaNova.addEventListener("input", () => {
  const senha = senhaNova.value;
  const valida = validarSenha(senha);
  })
     if (btnSalvarSenha) {
    btnSalvarSenha.addEventListener("click", async (e) => {
      e.preventDefault();

    if (!validarSenha(senhaNova.value)) {
      alert("Senha inválida. Por favor, cumpra todos os requisitos.");
      return;
    }

    if (senhaNova.value !== confirmar.value) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const userId = usuarioLog.users; 
      const novaSenha = senhaNova.value;

      if (novaSenha !== usuarioLog.senha) {
        const respostaSenha = await usuariosAPI.alterarUsuario(userId, "senha", novaSenha);
        usuarioLog.senha = respostaSenha.senha;

        localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLog));
        alert("Senha alterada com sucesso! ✅");
        fechaModal();
      } else {
        alert("A nova senha não pode ser igual à atual.");
      }
    } catch (erro) {
      console.error("Erro ao alterar os dados:", erro);
      alert("Erro ao alterar os dados.");
    }
  });
}
      

//trocar foto de perfil 
document.getElementById("fotoPerfil").addEventListener("click", function () {
  var modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close" style="cursor: pointer; float: right;">&times;</span>
      <h3>Trocar foto de perfil</h3><hr><br>
      <label for="novaFoto" style="color:black">Escolha nova foto: </label>
      <input type="file" id="novaFoto" name="foto" accept=".png, .jpeg, image/png, image/jpeg">
      <button id="salvarFoto">Salvar Foto</button>
      <p id="mensagem" style="color: red;"></p>
    </div>
  `;
  document.body.appendChild(modal);

  const inputNovaFoto = modal.querySelector("#novaFoto");
  let imagemBase64 = "";

  inputNovaFoto.addEventListener("change", () => {
    const arquivo = inputNovaFoto.files[0];
    if (arquivo) {
      const leitor = new FileReader();
      leitor.onload = () => {
        imagemBase64 = leitor.result;
        console.log(imagemBase64);
      }
      leitor.readAsDataURL(arquivo);
    }
  });

  var botaoFechar = modal.querySelector(".close");
  botaoFechar.addEventListener("click", function () {
    modal.remove();
  });

  var salvarFoto = modal.querySelector("#salvarFoto");
  salvarFoto.addEventListener("click", function () {
    if (imagemBase64) {
      localStorage.setItem("fotoPerfil", imagemBase64);
      alert("Foto salva com sucesso!");
      modal.remove();
      carregarFotoPerfil();
    } else {
      alert("Por favor, selecione uma foto antes de salvar.");
    }
  });
});
function carregarFotoPerfil() {
  const fotoSalva = localStorage.getItem("fotoPerfil");
  if (fotoSalva) {
    const imgPerfil = document.getElementById("fotoPerfil");
    imgPerfil.src = fotoSalva; 
  }
}
carregarFotoPerfil();
})