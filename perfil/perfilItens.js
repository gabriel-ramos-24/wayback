import {ItensAPI} from "../modulos/manipularFetch.js";
import {ModalErro} from "../modulos/manipularFetch.js";

const itens = new ItensAPI();
const lista = document.getElementById("lista");

async function carregarObjetos() {
  try {
    const resposta = await fetch("https://6801402081c7e9fbcc420482.mockapi.io/objeto");
    const dados = await resposta.json();
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    const nomeUsuario = usuarioLogado.usuario || usuarioLogado;  
    const publicacoesUser = dados.filter(obj => obj.autor === nomeUsuario);

    lista.innerHTML = "";
    if (publicacoesUser.length === 0) {
      lista.innerHTML = "<p>Você ainda não possui itens publicados!</p>";
      return;
    }
    publicacoesUser.forEach(obj => {
      const div = document.createElement("div");
      div.className = "publicado";
      const inativo = localStorage.getItem(`publi_${obj.id}_inativo`) === "true";
      if (inativo) Object.assign(div.style, { backgroundColor: "gray", opacity: "0.6" });

      div.innerHTML = `
        <h3>${obj.titulo}</h3>
        <img src="${obj.imagem}"><hr>
        <strong> Local: ${obj.local}</strong><hr>
        <strong> Data: ${obj.data}</strong><hr>
        <p>${obj.descricao}</p>
        <div class="card-buttons">
          <button onclick="editarItem(${obj.id}, '${obj.titulo}', '${obj.local}', '${obj.tipo}', '${obj.classe}', '${obj.data}', '${obj.descricao}', '${obj.imagem}', '${obj.ativo}')">Editar</button>
          <button class="btnInativar" data-id="${obj.id}">${inativo ? 'Ativar' : 'Inativar'}</button>
          <button onclick="window.location.href ='https://military-merciful-sprint.glitch.me/conversa/chat.html';">Chat</button>
        </div>
      `;
      lista.appendChild(div);
    });
  } catch (e) {
    console.error("Erro ao carregar itens", e);
    lista.innerHTML = "<p>Erro ao carregar seus itens publicados.</p>";
  }
}


const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
const form = document.getElementById("formulario");
const inputAtivo = document.getElementById("ativo");
const inputTitulo = document.getElementById("titulo");
const inputLocal = document.getElementById("local");
const inputData = document.getElementById("data");
const inputClasse = document.getElementById("classe");
const inputTipo = document.getElementById("tipo");
const inputImagem = document.getElementById("imagem");
const inputDescricao = document.getElementById("descricao");
const inputId = document.getElementById("id");
const nomeUsuario = usuarioLogado.usuario || usuarioLogado; 
const autor = nomeUsuario;
let imagemBase64 = "";

inputImagem.addEventListener("change", () => {
  const arq = inputImagem.files[0];
  if (arq) redimensionarImagem(arq, 800, 1, b64 => imagemBase64 = b64);
});

function redimensionarImagem(file, maxWidth = 800, quality = 1, cb) {
  const img = new Image();
  const reader = new FileReader();

  reader.onload = e => img.src = e.target.result;
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const scale = maxWidth / img.width;

    canvas.width = maxWidth;
    canvas.height = img.height * scale;
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);

    cb(canvas.toDataURL('image/jpeg', quality));
  };

  reader.readAsDataURL(file);
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const ativo = inputAtivo.value;
  const titulo = inputTitulo.value.trim();
  const tipo = inputTipo.value.trim();
  const classe = inputClasse.value.trim();
  const local = inputLocal.value.trim();
  const data = inputData.value.trim();
  const descricao = inputDescricao.value.trim();
  const id = inputId.value;
  const objetos = {titulo, tipo, classe, local, data, descricao, imagem: imagemBase64, autor};

  try {
    await itens.alterarDados(id, "titulo", titulo);
    await itens.alterarDados(id, "tipo", tipo);
    await itens.alterarDados(id, "classe", classe);
    await itens.alterarDados(id, "local", local);
    await itens.alterarDados(id, "data", data);
    await itens.alterarDados(id, "descricao", descricao);
    await itens.alterarDados(id, "imagem", imagemBase64);
    await itens.alterarDados(id, "autor", autor);
    await itens.alterarDados(id, "ativo", ativo);

    form.reset();
    alert("Alterado com sucesso");
    carregarObjetos();
    fecharModalEditar();
  } catch (err) {
    console.error("Erro ao alterar item:", err);
  }
})

function editarItem(id, titulo, local, tipo, classe, data, descricao, imagem, ativo) {
  inputId.value = id;
  inputTitulo.value = titulo;
  inputLocal.value = local;
  inputTipo.value = tipo;
  inputClasse.value = classe;
  inputData.value = data;
  inputDescricao.value = descricao;
  inputAtivo.value = ativo;
  imagemBase64 = imagem;
  abrirModalEditar(); 
}
window.editarItem = editarItem;
const modalEditar = document.getElementById("editarItem");
document.getElementById("fecharModalEditar").onclick = fecharModalEditar;
document.getElementById("cancelarModal").onclick = e => { e.preventDefault(); fecharModalEditar(); imagemBase64 = "";};

function abrirModalEditar() { modalEditar.style.display = "block"; }
function fecharModalEditar() { modalEditar.style.display = "none"; form.reset(); }
 
lista.addEventListener("click", e => {
  if (e.target.classList.contains("btnInativar")) {
    inativarPublicacao(e.target.getAttribute("data-id"), e.target);
  }
});
async function inativarPublicacao(id, botao) {
  const div = botao.closest(".publicado");
  const inativo = localStorage.getItem(`publi_${id}_inativo`) === "true";
  const novoStatus = inativo ? "sim" : "nao";

  if (!inativo) {
    if (!confirm("Tem certeza que deseja inativar essa publicação?")) return;
    localStorage.setItem(`publi_${id}_inativo`, "true");
    div.style.backgroundColor = "gray";
    div.style.opacity = "0.6";
    botao.textContent = "Ativar";
    div.querySelectorAll("button").forEach(b => {
      if (!b.classList.contains("btnInativar")) b.disabled = true;
    });
  } else {
    localStorage.removeItem(`publi_${id}_inativo`);
    div.style.backgroundColor = "";
    div.style.opacity = "1";
    botao.textContent = "Inativar";
    div.querySelectorAll("button").forEach(b => {
      if (!b.classList.contains("btnInativar")) b.disabled = false;
    });
  }
await fetch(`https://6801402081c7e9fbcc420482.mockapi.io/objeto/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ativo: novoStatus })
})
}
carregarObjetos();