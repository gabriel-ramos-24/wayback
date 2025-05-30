// Importando a classe ItensAPI e ModalErro
import {ItensAPI} from "../modulos/manipularFetch.js";
import {ModalErro} from "../modulos/manipularFetch.js";
const Modal = new ModalErro();

// Pegar o valor id repassado na queryString  
const queryString = window.location.search;  
const urlParams = new URLSearchParams(queryString);  
const id = urlParams.get('id');  

// Pegar os ids dos elementos dinâmicos  
const titulo = document.getElementById("titulo");  
const imagem = document.getElementById("imagem");  
const field_classe = document.getElementById("field_classe");  
const field_tipo = document.getElementById("field_tipo");  
const field_local = document.getElementById("field_local");  
const field_data = document.getElementById("field_data");  
const field_descricao = document.getElementById("field_descricao");  

const obter = new ItensAPI();

async function buscar() {  
  
    
    const objeto = await obter.obterDados(id - 1);
    if (objeto) {  
        // Armazena as respostas  
        const resposta_titulo = objeto.titulo;  
        const resposta_imagem = objeto.imagem;
        const resposta_classe = objeto.classe;  
        const resposta_tipo = objeto.tipo;  
        const resposta_local = objeto.local;  
        const resposta_data = objeto.data;  
        const resposta_descricao = objeto.descricao;  

        // Atualiza o conteúdo dos elementos  
        titulo.textContent = resposta_titulo;  
        
        // Aqui criamos a tag <img> com a URL da imagem  
        imagem.src = resposta_imagem;   
        
        field_classe.textContent = resposta_classe;  
        field_tipo.textContent = resposta_tipo;  
        field_local.textContent = resposta_local;  
        field_data.textContent = resposta_data;  
        field_descricao.textContent = resposta_descricao;  
    } else {  
        window.location.href = '../erro/notFound.html';
    }  
}  

buscar();

// Inicio: codigo para adicionar a funcionalidade de reportar o objeto atual
const reportar = document.getElementById("btn-reportar");
reportar.addEventListener("click", () => {
    Modal.abriModal("Você tem certeza que deseja reportar este item: " + titulo.textContent, "decisao");
});
// Fim




// Inicio: codigo para adicionar a funcionalidade de compartilhar a url atual do site
const compartilhar = document.getElementById("btn-compartilhar");
compartilhar.addEventListener("click", () => {
    const urlAtual = window.location.href;
    navigator.share({url: urlAtual});
});
// Fim



// Inicio: menu suspenso

const icon_bars = document.getElementById("icon-bars");  
icon_bars.addEventListener("click", () => {  
    var maior = document.querySelectorAll('.maior');  
    
    maior.forEach(function(ativar) {  
        ativar.classList.toggle('ativar');  
    });  
});


// Fim

// Inicio: abrir chat
const abrirChat = document.getElementById("btn-chat");
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));// pegar o nome do usuario no LocalStorage

abrirChat.addEventListener("click", async () => {
    const objeto = await obter.obterDados(id - 1);
    if (objeto.autor === usuarioLogado.usuario) {
        Modal.abriModal("Você, " + usuarioLogado.nome + ", é a própria pessoa que publicou o item. Quer conversar com você mesmo?", "ok");
    } else {
        window.location.href = "https://military-merciful-sprint.glitch.me/conversa/chat.html?novaConversa=" + (id);
    }
  
});