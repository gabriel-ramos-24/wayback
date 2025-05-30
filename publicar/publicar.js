import {ModalErro} from "../modulos/manipularFetch.js";
// Espera o carregamento do DOM
document.addEventListener("DOMContentLoaded", function () {

//modificar data 
  function formatarDataBrasil(dataISO) {
  const partes = dataISO.split("-");
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}
// Função para redimensionar a imagem e retornar base64 comprimido
function resizeImage(file) {
  const maxWidth = 800; // largura máxima
  const maxHeight = 800; // altura máxima

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const img = new Image();

      img.onload = function () {
        let width = img.width;
        let height = img.height;

        // Calcula proporção para redimensionar
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        // Cria canvas para desenhar imagem redimensionada
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Gera base64 comprimida em jpeg com qualidade 0.7 (70%)
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        resolve(dataUrl);
      };

      img.onerror = function (error) {
        reject(error);
      };

      img.src = event.target.result;
    };

    reader.onerror = function (error) {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}
  const form = document.getElementById("publicarForm");
  const dataInput = document.getElementById("data");
  const cancelarBtn = document.querySelector(".cancelar");

  const mensagemDataInvalida = "A data não pode ser no futuro. Por favor, selecione uma data válida.";

// Botão cancelar limpa o formulário
  cancelarBtn.addEventListener("click", () => {
    form.reset();
  });

// Função para converter arquivo para base64
  
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    
    const publicarBtn = form.querySelector(".publicar");//desabilitar o o botão de publicar no início do envio
          publicarBtn.disabled = true;
          publicarBtn.textContent = "Publicando...";
    
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));// pegar o nome do usuario no LocalStorage
    const usuario = usuarioLogado.usuario; // pega o nome do usuario

    
 //notificar o usuario para preencher todos    
    const campos = [
  document.getElementById("nome").value.trim(),
  document.getElementById("localizacao").value.trim(),
  document.getElementById("tipo").value,
  document.getElementById("classe").value,
  dataInput.value,
  document.getElementById("descricao").value.trim()
];

if (campos.some(campo => !campo)) {
  alert("Por favor preencha os dados.");
  
  publicarBtn.disabled = false;
  publicarBtn.textContent = "Publicar";//reabilitar o botão publicar se tiver dados incompletos

  return;
}

    const hoje = new Date().toISOString().split("T")[0];
    const dataSelecionada = dataInput.value;
    const dataFormatada = formatarDataBrasil(dataSelecionada);


// Validação da data
    if (dataSelecionada > hoje) {
      alert(mensagemDataInvalida);
      
      publicarBtn.disabled = false;
      publicarBtn.textContent = "Publicar";//reabilitar o botão publicar se tiver dados incompletos
      return;
    }

    let imagemBase64 = "";

    const fotoInput = document.getElementById("foto");
    if (fotoInput.files.length > 0) {
      const file = fotoInput.files[0];
    
    // Verificar tipo de arquivo (aceitar apenas JPEG ou PNG)
    const fileType = file.type;
    const allowedTypes = ["image/jpeg", "image/png"];
    
   // Se o tipo não for válido, interrompe a execução 
      if (!allowedTypes.includes(fileType)) {
        alert("Por favor, envie uma imagem JPEG ou PNG.");
        
        publicarBtn.disabled = false;
        publicarBtn.textContent = "Publicar";//reabilitar o botão publicar se tiver dados incompletos
        
        return; // Interrompe o processo
      }
        try {
        imagemBase64 = await resizeImage(fotoInput.files[0]);
      } catch (error) {
        console.error("Erro ao converter imagem:", error);
        alert("Erro ao processar a imagem.");
        
        publicarBtn.disabled = false;
        publicarBtn.textContent = "Publicar";//reabilitar o botão publicar se tiver dados incompletos
        
        return;
      }
    }

// Montar objeto para envio
    const data = {
      titulo: document.getElementById("nome").value,
      local: document.getElementById("localizacao").value,
      tipo: document.getElementById("tipo").value,
      classe: document.getElementById("classe").value,
      data: dataFormatada,
      descricao: document.getElementById("descricao").value,
      imagem: imagemBase64,// base64 da imagem ou string vazia
      ativo: document.getElementById("ativo").value,
      autor: usuario  
    };

// Enviar para API
  try {
  const response = await fetch("https://6801402081c7e9fbcc420482.mockapi.io/objeto", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (response.ok) {
    alert("Item publicado com sucesso!");
    form.reset();
  } else {
    const errorText = await response.text();
    alert(`Erro ao publicar. Status: ${response.status}. Resposta: ${errorText}`);
  }
} catch (error) {
  console.error("Erro ao enviar para a API:", error);
  alert("Erro de rede. Verifique sua conexão.");
} finally {
  // reabilitar botão ao final de tudo (sucesso ou erro)
  publicarBtn.disabled = false;
  publicarBtn.textContent = "Publicar";
}
});
});
