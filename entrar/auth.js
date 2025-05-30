import {ModalErro} from "../modulos/manipularFetch.js";
const Modal = new ModalErro();

document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  const btnLogin = document.getElementById("btn_login");

  // Parte de Gabriel: inserção de div para alerta de erro
  
  const inserirCSS = document.createElement("style");
  inserirCSS.innerHTML = `
    .divErroConteiner {
      display: none;
      position: fixed;
      top: 0px;
      left: 0px;
      background-color: rgba(30, 30, 30, 0.9);
      width: 100vw;
      height: 100vh;
      z-index: 1001;
      align-items: center;
      justify-content: center;
    }
    
    .divErroConteinerCentral {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      border-radius: 10px;
      background-color: white;
      width: 70vw;
      max-width: 600px;
      height: 50vh;
      box-shadow: -4px 4px 10px 5px rgba(30, 30, 30, 0.9), 4px -4px 10px 5px rgba(30, 30, 30, 0.9), -4px -4px 10px 5px rgba(30, 30, 30, 0.9), 4px 4px 10px 5px rgba(30, 30, 30, 0.9);
    }
    
    .divImgSombra {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    
    .divErroConteinerCentral > div > img {
      position: relative;
      top: 20px;
      width: clamp(100px, 7vw, 300px);
      height: clamp(100px, 7vw, 300px);
      border-radius: 50%;
    }
    
    .divSombra {
      position: relative;
      width: 50%;
      top: 30px;
      box-shadow: 1px 1px 10px 3px black;
    }
    
    .divErroConteinerCentral > p {
      text-align: center;
      padding: 0px 10px;
    }
    
    .divbtnModal {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100%;
      height: 10%;
    }
    
    .divbtnModal > a {
      display: flex;
      justify-content: center;
      align-items: center; 
      height: 100%;
      width: 50%;
      cursor: pointer;
    }
    
    .divbtnModal > a:hover {
      opacity: 0.8;
    }
    
    .divbtnModal > a:first-child {
      border-bottom-left-radius: 10px;
    }
    
    .divbtnModal > a:last-child {
      border-bottom-right-radius: 10px;
    }
    

    
    .ativada {
      animation: aparecer 0.5s linear forwards;
    }
    
    .desativada {
      animation: desaparecer 0.5s linear forwards;
    }
    
    @keyframes aparecer {
      from {
        opacity: 0;
        transform: translateY(100%);
      }
      
      to {
        opacity: 1;
        transform: translateY(0);
      } 
    }
    
    @keyframes desaparecer {
      from {
        opacity: 1;
        transform: translateY(0);
      }

      to {
        opacity: 0;
        transform: translateY(100%);
      }
    }
  `;
  document.body.appendChild(inserirCSS);
  
  
  
  const divErroConteiner = document.createElement("div");
  divErroConteiner.className = "divErroConteiner";
  document.body.appendChild(divErroConteiner);
  
  const divErroConteinerCentral = document.createElement("div");
  divErroConteinerCentral.className = "divErroConteinerCentral";
  divErroConteiner.appendChild(divErroConteinerCentral);
  
  const divImgSombra = document.createElement("div");
  divImgSombra.className = "divImgSombra";
  divErroConteinerCentral.appendChild(divImgSombra);

  const divErro_img = document.createElement("img");
  divErro_img.className = "objImg";
  divImgSombra.appendChild(divErro_img);
  
  const divSombra = document.createElement("div");
  divSombra.className = "divSombra";
  divImgSombra.appendChild(divSombra);
  
  const divErro_p = document.createElement("p");
  divErro_p.id = "divErro_p";
  divErroConteinerCentral.appendChild(divErro_p);
  
  const divErro_confirmar = document.createElement("div");
  divErro_confirmar.className = "divbtnModal";
  divErroConteinerCentral.appendChild(divErro_confirmar);
  
  
  
  if (usuario) {
    // Usuário está logado: muda botão para logout
    btnLogin.innerHTML = '<i class="fa-solid fa-arrow-right-from-bracket">&nbsp;&nbsp;LOGOUT</i>';
    btnLogin.style.backgroundColor = "#ffdddd";
  } else {
    // Usuário não está logado: bloquear botões de acesso
    const bloquear_btns = document.querySelectorAll(".opcoes > a");
    bloquear_btns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        Modal.abriModal("Você precisa entrar ou cadastrar usuário para acessar esta página!", "ok");
      });
    });
    
    const pegarURL = window.location.href;
    if (pegarURL === "https://military-merciful-sprint.glitch.me/publicar/publicar.html" || pegarURL === "https://military-merciful-sprint.glitch.me/perfil/perfil.html" || pegarURL === "https://military-merciful-sprint.glitch.me/itens/objetoIndex.html" || pegarURL === "https://military-merciful-sprint.glitch.me/conversa/chat.html") {
        Modal.abriModal("Você precisa entrar ou cadastrar usuário para acessar esta página!", "ok", sair);
    }
  }
  
  btnLogin.addEventListener("click", () => {
    if (usuario) {Modal.abriModal("Você tem certeza que deseja sair?", "decisao", sair)} else {window.location.href = "https://military-merciful-sprint.glitch.me/entrar/login.html"}
  });
  
});

function sair() {
  localStorage.clear();
  window.location.href = "https://military-merciful-sprint.glitch.me/home/homePage.html";

}
