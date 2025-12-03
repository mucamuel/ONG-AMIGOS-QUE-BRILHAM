// ==========================
// 📞 MÁSCARAS + API VIA CEP (Compatível com SPA)
// ==========================

// Função genérica para aplicar máscara enquanto digita
function aplicarMascara(input, mascara) {
  input.addEventListener("input", () => {
    let valor = input.value.replace(/\D/g, "");
    let resultado = "";
    let indice = 0;

    for (let caractere of mascara) {
      if (caractere === "#") {
        if (indice < valor.length) {
          resultado += valor[indice];
          indice++;
        }
      } else {
        resultado += caractere;
      }
    }

    input.value = resultado;
  });
}

// ==========================
// 📋 FUNÇÃO PRINCIPAL PARA APLICAR TODAS AS MÁSCARAS
// ==========================
function aplicarMascarasFormularios() {
  // ----- Doações -----
  const telefoneDoacao = document.getElementById("telefoneDoacao");
  if (telefoneDoacao) aplicarMascara(telefoneDoacao, "(##) #####-####");

  const cpfDoacao = document.getElementById("cpfDoacao");
  if (cpfDoacao) aplicarMascara(cpfDoacao, "###.###.###-##");

  const cepDoacao = document.getElementById("cepDoacao");
  if (cepDoacao) {
    aplicarMascara(cepDoacao, "#####-###");
    cepDoacao.addEventListener("blur", () => {
      buscarCEP(cepDoacao.value, {
        endereco: document.getElementById("enderecoDoacao"),
        bairro: document.getElementById("bairroDoacao"),
        cidade: document.getElementById("cidadeDoacao"),
        uf: document.getElementById("ufDoacao"),
      });
    });
  }

  // ----- Voluntariado -----
  const telefoneVoluntario = document.getElementById("telefoneVoluntario");
  if (telefoneVoluntario) aplicarMascara(telefoneVoluntario, "(##) #####-####");

  // ----- Contato -----
  const telefoneContato = document.getElementById("telefoneContato");
  if (telefoneContato) aplicarMascara(telefoneContato, "(##) #####-####");

  const cepContato = document.getElementById("cepContato");
  if (cepContato) {
    aplicarMascara(cepContato, "#####-###");
    cepContato.addEventListener("blur", () => {
      buscarCEP(cepContato.value, {
        endereco: document.getElementById("enderecoContato"),
      });
    });
  }
}

// ==========================
// 🌎 API VIA CEP — AUTO-PREENCHIMENTO
// ==========================
function buscarCEP(cep, campos) {
  const cepLimpo = cep.replace(/\D/g, "");
  if (cepLimpo.length !== 8) return;

  fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
    .then(response => response.json())
    .then(dados => {
      if (dados.erro) {
        alert("❌ CEP não encontrado. Verifique e tente novamente.");
        return;
      }

      if (campos.endereco) campos.endereco.value = dados.logradouro || "";
      if (campos.bairro) campos.bairro.value = dados.bairro || "";
      if (campos.cidade) campos.cidade.value = dados.localidade || "";
      if (campos.uf) campos.uf.value = dados.uf || "";
    })
    .catch(() => alert("⚠️ Erro ao buscar o CEP. Verifique sua conexão."));
}

// ==========================
// 🔄 OBSERVADOR PARA REAPLICAR MÁSCARAS (SPA)
// ==========================

document.addEventListener("DOMContentLoaded", aplicarMascarasFormularios);

// Reexecuta quando o conteúdo da SPA muda
const observer = new MutationObserver(() => {
  aplicarMascarasFormularios();
});
observer.observe(document.getElementById("conteudo"), { childList: true, subtree: true });
