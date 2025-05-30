import { ChatAPI } from "../modulos/manipularFetch.js";
import { ItensAPI } from "../modulos/manipularFetch.js";


const Chat = new ChatAPI();
const Itens = new ItensAPI();
document.addEventListener("DOMContentLoaded", async () => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));// pegar o nome do usuario no LocalStorage
    const nossoAutor = usuarioLogado.usuario; // pega o nome do usuario
    
  
    const queryString = window.location.search;  
    const urlParams = new URLSearchParams(queryString);  
    const novaConversa = urlParams.get('novaConversa');
    if (novaConversa) {
      const PrimeiraMSG = new ChatAPI();
      const finder = await Itens.obterDados(novaConversa - 1);
      await PrimeiraMSG.enviarMensagens(nossoAutor, finder.autor, "Olá!", novaConversa);
      
    }  
    
    const geralConversas = await Chat.obterMensagens();
    let protocolos = [];
    for (let cadaConversa of geralConversas) {
        if ((cadaConversa.autor === nossoAutor || cadaConversa.participante === nossoAutor) && protocolos.includes(cadaConversa.protocolo) === false) {
            protocolos.push(cadaConversa.protocolo);
            // chamar função para adicionar filhos à classe conteinerPessoas
            //console.log(cadaConversa);
            adicionarPessoasDivs(nossoAutor, cadaConversa.protocolo, cadaConversa.protocolo.split("?")[1], cadaConversa.autor, cadaConversa.participante);
            
        }
    }
});

const divAvo = document.getElementById("conteinerPessoas");

async function adicionarPessoasDivs(nossoAutor, protocolo, item, autor, participanteMSG) {
    const dados = await Itens.obterDados(item - 1);


    const divConversa = document.createElement("div");
    divConversa.className = "topicoConversa";


    const isAutor = dados.autor === nossoAutor;
    divConversa.classList.add(isAutor ? "conversa-autor" : "conversa-participante");

  
    divConversa.addEventListener("click", () => {
        const conversaEspecial = document.getElementById("conversaEspecial");
        conversaEspecial.className = "conversa ativada";

        abrirMensagens(nossoAutor, protocolo, dados);

        const conteiner = document.getElementById("conteinerPessoas");
        conteiner.style.pointerEvents = "none";
        setTimeout(() => {
            conteiner.style.pointerEvents = "auto";
        }, 550);
    });


    const img = document.createElement("img");
    img.src = dados.imagem;
    img.alt = "Foto";
    divConversa.appendChild(img);


    const p = document.createElement("p");
    const outroNome = (autor === nossoAutor) ? participanteMSG : autor;
    p.textContent = `${dados.titulo} - ${outroNome}`;
    divConversa.appendChild(p);


    divAvo.appendChild(divConversa);
}



async function abrirMensagens(nossoAutor, protocolo, dados) {
    // Dividir em 3 partes a aba mensagens: topo, corpo, digitação
    
    // topo
    const topo = document.createElement("div");
    topo.className = "topoM";

    const btn_voltar = document.createElement("i");
    btn_voltar.className = "fa-solid fa-arrow-left";
    btn_voltar.addEventListener("click", () => {
        const classe_da_conversa = document.querySelector(".ativada");
        const desativarClique = document.getElementById("conteinerPessoas");
        desativarClique.style.pointerEvents = "none";
        classe_da_conversa.className = "conversa desativada";
        setTimeout(() => {
          classe_da_conversa.classList.remove("conversa");
          classe_da_conversa.classList.remove("desativada");
          classe_da_conversa.innerHTML = "";
          desativarClique.style.pointerEvents = "auto";
        }, 550);
    });

    const tituloTopo = document.createElement("p");
    tituloTopo.textContent = dados.titulo;

    topo.appendChild(btn_voltar);
    topo.appendChild(tituloTopo);
    
    // corpo
    const corpo = document.createElement("div");
    var msgs = await Chat.obterMensagens(protocolo);
    corpo.className = "corpoM";
    for (let valor of Object.values(msgs)) {
        const msg = document.createElement("div");
        msg.className = (valor.autor === nossoAutor) ? "msgAutor" : "msgParticipante";
        msg.textContent = valor.mensagem;
        corpo.appendChild(msg);
    }
    /*
    setInterval(async () => {
        msgs = await Chat.obterMensagens(protocolo);
        corpo.innerHTML = "";
        for (let valor of Object.values(msgs)) {
            const msg = document.createElement("div");
            msg.className = (valor.autor === nossoAutor) ? "msgAutor" : "msgParticipante";
            msg.textContent = valor.mensagem;
            corpo.appendChild(msg);
        }
    }, 3000);
    */


    // digitação
    const digitacao = document.createElement("div");
    digitacao.className = "digitacaoM";

    const campo_de_mensagens = document.createElement("input");
    campo_de_mensagens.id = "field_msg_" + protocolo;
    campo_de_mensagens.setAttribute("placeholder", "Digite algo...");
    digitacao.appendChild(campo_de_mensagens);

    const enviar_mensagens = document.createElement("i");
    enviar_mensagens.className = "fa-solid fa-paper-plane";
    enviar_mensagens.addEventListener("click", async () => {
      
        if (campo_de_mensagens.value === "") return;
        const [parte1, resto] = protocolo.split('#');
        const [parte2] = resto.split('?');
        const outroNome = (parte1 === nossoAutor) ? parte2 : parte1;
        
        await Chat.enviarMensagens(nossoAutor, outroNome, campo_de_mensagens.value, dados.id);

        const colocar_msg_tela_enviar = document.createElement("div");
        colocar_msg_tela_enviar.textContent = campo_de_mensagens.value;
        colocar_msg_tela_enviar.className = "msgAutor";
        corpo.appendChild(colocar_msg_tela_enviar);
        campo_de_mensagens.value = "";


    });


    digitacao.appendChild(enviar_mensagens); 
    

    // inserindo tudo
    const conversaEspecial = document.getElementById("conversaEspecial");
    conversaEspecial.appendChild(topo);
    conversaEspecial.appendChild(digitacao);
    setTimeout(() => {conversaEspecial.appendChild(corpo);}, 750);
    


}
