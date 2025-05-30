/* Segue a lista de todos os comandos da API

    // 0° passo: Incrementar via modulo estas 3 classes em seu código
    Vai no seu arquivo <head> do html e MODIFIQUE o seu arquivo.js com a seguinte linha de código:
    <script type="module" src="seu_arquivo_padrão"></script>

    Faça isso no inicio do seu arquivo principal.js:
    import {ItensAPI} from "../modulos/manipularFetch.js";
    import {ChatAPI} from "../modulos/manipularFetch.js";
    import {UsuariosAPI} from "../modulos/manipularFetch.js";


    // 1° passo: Obrigatorio instanciar objeto a partir de uma dessas classes (apenas aquela que vc irá usar)
    const nome_do_objeto = new ItensAPI();
    const nome_do_objeto = new UsuariosAPI();
    const nome_do_objeto = new ChatAPI();

    // 2° passo: Utilizar alguma função e seu parametro, se houver (Todas as funções dessas classes são assincronas e necessitam de await para esperar uma promise)

    // Obeservação para Chat:
    Obter Mensagens sem parametros retorna todas as mensagens presente na API, caso deseje utilizar o protocolo como parametro, retornará um 
    arquivo JSON contendo a ordem da conversa de acordo com essa estrutura:
    msg1..2..3..4 = {autor: "nome do autor", mensagem: "mensagem utilizada"}

    Enviar Mensagens sempre colocara em ordem alfabetica o nome dos autores separados por # com o intuito de padronizar o protocolo

*/

export class ItensAPI {
    // Adicionei a URL dos nossos objetos
    #URL_API = "https://6801402081c7e9fbcc420482.mockapi.io/objeto";

    // Retorna, se positivo, um arquivo JSON com todos os itens (sem parametros) ou um item especifico pronto para manipular
    async obterDados(id = "nulo") {
        try {
            const resposta = await fetch(this.#URL_API);
            const respostaJSON = await resposta.json();
            if (id === "nulo") {return respostaJSON} // retorna o arquivo JSON inteiro
            else {return respostaJSON[id]} // retorna um item especifico
                 
        } catch (erro) {
            console.warn("Erro ao tentar acessar a API: " + erro);
            return [];
        }
    }

    // Necessita de 8 parametros para enviar no banco de dados, sendo os 2 últimos opcionais
    async adicionarDados(titulo, local, data, descricao, autor, imagem, classe, tipo) {
        const novoItem = {
            titulo: titulo,
            classe: classe,
            tipo: tipo,
            local: local,
            data: data,
            descricao: descricao,
            autor: autor,
            imagem: imagem
        }

        try {
            const resposta = await fetch(this.#URL_API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(novoItem)
            });
            const respostaJSON = await resposta.json();
            return respostaJSON;

        } catch (erro) {
            console.warn("Erro ao tentar acessar a API: " + erro); 
            return [];
        }
    }

    // Necessita de id do item para excluir no banco de dados
    async excluirDados(id) {
        try {
            const resposta =  await fetch(this.#URL_API + "/" + id, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const respostaJSON = await resposta.json();
            return respostaJSON;
                
        } catch (erro) {
            console.warn("Erro ao tentar acessar a API: " + erro);
            return [];
        }
    }

    // Necessita de id, chave e valor para alterar 1 parte de um item especifico
    async alterarDados(id, chave, valor) {
        const atualizarItem = {
            [chave]: valor
        }

        try {
            const resposta = await fetch(this.#URL_API + "/" + id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(atualizarItem)
            });
            const respostaJSON = await resposta.json();
            return respostaJSON;

        } catch (erro) {
            console.warn("Erro ao tentar acessar a API: " + erro); 
            return [];
        }
    }

}

export class UsuariosAPI {
    // Adicionei a URL dos Usuarios
    #URL_API = "https://682a8c8eab2b5004cb36fe12.mockapi.io/api/vi/users/users";

    // Retorna, se positivo, um arquivo JSON com todos os usuarios (sem parametros) ou um usuario especifico pronto para manipular
    async obterUsuario(users = "nulo") {
        try {
            const resposta = await fetch(this.#URL_API);
            const respostaJSON = await resposta.json();
            if (users === "nulo") {return respostaJSON} // retorna o arquivo JSON inteiro
            else {return respostaJSON[users]} // retorna um item especifico
                 
        } catch (erro) {
            console.warn("Erro ao tentar acessar a API: " + erro);
            return [];
        }
    }

    // Permite cadastrar um novo usuario
    async cadastrarUsuario(nome, email, senha, usuario) {
        const novoUsuario = {
            nome: nome,
            email: email,
            senha: senha,
            usuario: usuario
        }

        try {
            const resposta = await fetch(this.#URL_API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(novoUsuario)
            });
            const respostaJSON = await resposta.json();
            return respostaJSON;

        } catch (erro) {
            console.warn("Erro ao tentar acessar a API: " + erro); 
            return [];
        }
    }

    // Permite alterar uma parte por vez de um usuario especifico
    async alterarUsuario(users, chave, valor) {
        const usuarioAlterado = {
            [chave]: valor
        }

        try {
            const resposta = await fetch(this.#URL_API + "/" + users, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(usuarioAlterado)
            });
            const respostaJSON = await resposta.json();
            return respostaJSON;

        } catch (erro) {
            console.warn("Erro ao tentar acessar a API: " + erro); 
            return [];
        }
    }

    async deletarUsuario(users) {
        const resposta = await fetch(this.#URL_API + "/" + users, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const respostaJSON = await resposta.json();
        return respostaJSON;        
    }
}

export class ChatAPI {
    // Adicionei a URL do nosso chat
    #URL_API = "https://682c95f84fae18894753289d.mockapi.io/wayback/chat/Comentarios";

    // Retorna, se positivo, um arquivo JSON com todos as mensagens (sem parametros) ou todas as mensagens de um protocolo especifico pronto para manipular
    async obterMensagens(protocolo = "nulo") {
        let grupoMensagens = {}
        try {
            const resposta = await fetch(this.#URL_API);
            const respostaJSON = await resposta.json();
            if (protocolo === "nulo") {return respostaJSON} // retorna o arquivo JSON inteiro
            else {
                if (!protocolo.includes("#") || !protocolo.includes("?")) return console.warn("Protocolo Incorreto por não conter #");
                let quantidade = 0;
                for (let i = 0; i < respostaJSON.length; i++) {
                    if (respostaJSON[i].protocolo === protocolo) {
                        quantidade++;
                        grupoMensagens["msg" + quantidade] = {autor: respostaJSON[i].autor, mensagem: respostaJSON[i].mensagem};
                    }
                }
                return grupoMensagens;
            } // retorna as mensagens de um protocolo especifico
                 
        } catch (erro) {
            console.warn("Erro ao tentar acessar a API: " + erro);
            return [];
        }
    }

    async enviarMensagens(autor, participante, mensagem, id_item) {
        let protocolo = (autor.localeCompare(participante) < 0) ? autor + "#" + participante : participante + "#" + autor;
        protocolo = protocolo + "?" + id_item;
        const novaMensagem = {
            autor: autor,
            participante: participante,
            mensagem: mensagem,
            protocolo: protocolo
        }

        try {
            const resposta = await fetch(this.#URL_API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(novaMensagem)
            });
            const respostaJSON = await resposta.json();
            return respostaJSON;

        } catch (erro) {
            console.warn("Erro ao tentar acessar a API: " + erro); 
            return [];
        }
    }
}

export class ModalErro {
    
  abriModal(mensagem, modelo, funcao = () => {}) {
    const procurarClasse = document.querySelector(".divErroConteiner");
    const inserirmsg = document.querySelector(".divErroConteinerCentral > p");
    inserirmsg.textContent = mensagem;
    if (procurarClasse) {
      
      procurarClasse.style.display = "flex";
      procurarClasse.classList.add("ativada");
      procurarClasse.classList.remove("desativada");
      document.body.style.overflowY = "hidden";
      const procurarDivBtn = document.querySelector(".divbtnModal");
      procurarDivBtn.innerHTML = "";
      if (modelo === "ok") {
        document.querySelector(".objImg").src = "https://cdn.glitch.global/8ff313da-1dcc-45d6-8163-d9dda5d323f1/exclamacao12.png?v=1748533747054";
        const btn_ok = document.createElement("a");
        btn_ok.setAttribute("tabindex", "0");
        btn_ok.addEventListener("mouseenter", () => {
          document.querySelector(".divErroConteinerCentral").style.boxShadow = "-4px 4px 10px 3px turquoise, 4px -4px 10px 3px turquoise, -4px -4px 10px 3px turquoise, 4px 4px 10px 3px turquoise";
          document.querySelector(".divErroConteinerCentral").style.transition = "box-shadow 1s";
        });
        btn_ok.addEventListener("mouseleave", () => {
          document.querySelector(".divErroConteinerCentral").style.boxShadow = "-4px 4px 10px 5px rgba(30, 30, 30, 0.9), 4px -4px 10px 5px rgba(30, 30, 30, 0.9), -4px -4px 10px 5px rgba(30, 30, 30, 0.9), 4px 4px 10px 5px rgba(30, 30, 30, 0.9)";
        });
        btn_ok.addEventListener("click", () => {
          if (procurarClasse.classList.contains("ativada")) {
              procurarClasse.classList.remove("ativada");
              procurarClasse.classList.add("desativada");
              document.body.style.overflowY = "auto";

              setTimeout(() => {
                procurarClasse.style.display = "none";
              }, 500);
          }
          
          
          
          funcao();
        });
        btn_ok.className = "btn_ok_cancelar";
        btn_ok.textContent = "Ok";
        btn_ok.style.backgroundColor = "turquoise";
        btn_ok.style.width = "100%";
        btn_ok.style.height = "100%";
        procurarDivBtn.appendChild(btn_ok);
        
      } else if (modelo === "decisao") {
        document.querySelector(".objImg").src = "https://cdn.glitch.global/8ff313da-1dcc-45d6-8163-d9dda5d323f1/ponto_interrogacao.png?v=1748541561492";
        const btn_cancel = document.createElement("a");
        btn_cancel.addEventListener("mouseenter", () => {
          document.querySelector(".divErroConteinerCentral").style.boxShadow = "-4px 4px 10px 3px orange, 4px -4px 10px 3px orange, -4px -4px 10px 3px orange, 4px 4px 10px 3px orange";
          document.querySelector(".divErroConteinerCentral > div > *").style.transform = "translateX(-40px) rotate(-30deg)";
          document.querySelector(".divErroConteinerCentral > div > *").style.transition = "all 1s";
          document.querySelector(".divErroConteinerCentral").style.transition = "box-shadow 1s";
        });
        btn_cancel.addEventListener("mouseleave", () => {
          document.querySelector(".divErroConteinerCentral").style.boxShadow = "-4px 4px 10px 5px rgba(30, 30, 30, 0.9), 4px -4px 10px 5px rgba(30, 30, 30, 0.9), -4px -4px 10px 5px rgba(30, 30, 30, 0.9), 4px 4px 10px 5px rgba(30, 30, 30, 0.9)";
          document.querySelector(".divErroConteinerCentral > div > *").style.transform = "translateX(0) rotate(0deg)";
        });
        btn_cancel.addEventListener("click", () => {
          if (procurarClasse.classList.contains("ativada")) {
              procurarClasse.classList.remove("ativada");
              procurarClasse.classList.add("desativada");
              document.body.style.overflowY = "auto";
              setTimeout(() => {
                procurarClasse.style.display = "none";
              }, 500);
          }
        });
        btn_cancel.className = "btn_ok_cancelar";
        btn_cancel.textContent = "Cancelar";
        btn_cancel.style.backgroundColor = "orange";
        btn_cancel.style.width = "50%";
        btn_cancel.style.height = "100%";
        
        const btn_confirmar = document.createElement("a");
        btn_confirmar.addEventListener("mouseenter", () => {
          document.querySelector(".divErroConteinerCentral").style.boxShadow = "-4px 4px 10px 3px green, 4px -4px 10px 3px green, -4px -4px 10px 3px green, 4px 4px 10px 3px green";
          document.querySelector(".divErroConteinerCentral > div > *").style.transform = "translateX(40px) rotate(30deg)";
          document.querySelector(".divErroConteinerCentral > div > *").style.transition = "all 1s";
          document.querySelector(".divErroConteinerCentral").style.transition = "box-shadow 1s";
        });
        btn_confirmar.addEventListener("mouseleave", () => {
          document.querySelector(".divErroConteinerCentral").style.boxShadow = "-4px 4px 10px 5px rgba(30, 30, 30, 0.9), 4px -4px 10px 5px rgba(30, 30, 30, 0.9), -4px -4px 10px 5px rgba(30, 30, 30, 0.9), 4px 4px 10px 5px rgba(30, 30, 30, 0.9)";
          document.querySelector(".divErroConteinerCentral > div > *").style.transform = "translateX(0) rotate(0deg)";
        });
        btn_confirmar.addEventListener("click", () => {
          funcao();
        });
        btn_confirmar.className = "btn_confirmar";
        btn_confirmar.textContent = "Confirmar";
        btn_confirmar.style.backgroundColor = "green";
        btn_confirmar.style.width = "50%";
        btn_confirmar.style.height = "100%";
        procurarDivBtn.appendChild(btn_cancel);
        procurarDivBtn.appendChild(btn_confirmar);
      } else {
        console.error("Parametro de Classe Invalido para a Modal Ok/Decisao");
      }
    }
    
    
  }
}