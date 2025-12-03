// =========================
// 🌍 AMIGOS QUE BRILHAM — SCRIPT PRINCIPAL (Etapa 3 Final + Limpeza de Histórico)
// =========================

document.addEventListener("DOMContentLoaded", () => {
  configurarSPA();
  configurarFormularios();
  atualizarListas();
  configurarBotoesLimpeza();
});

// ===============================
// 🔧 FUNÇÕES GERAIS
// ===============================

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function salvarDadosLocal(chave, dados) {
  const existentes = JSON.parse(localStorage.getItem(chave)) || [];
  existentes.push(dados);
  localStorage.setItem(chave, JSON.stringify(existentes));
}

function mostrarMensagem(form, texto, tipo = "sucesso") {
  const antiga = form.querySelector(".mensagem-form");
  if (antiga) antiga.remove();

  const msg = document.createElement("div");
  msg.className = `mensagem-form ${tipo}`;
  msg.textContent = texto;
  form.appendChild(msg);

  setTimeout(() => msg.remove(), 4000);
}

// ===============================
// 🧭 SISTEMA SPA (Single Page Application)
// ===============================
function configurarSPA() {
  const conteudo = document.getElementById("conteudo");
  const linksSPA = document.querySelectorAll("nav a[data-page]");

  if (!conteudo || linksSPA.length === 0) return;

  linksSPA.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const url = link.getAttribute("data-page");

      carregarPaginaSPA(url);
      window.history.pushState({}, "", `#${url}`);

      linksSPA.forEach(l => l.classList.remove("ativo"));
      link.classList.add("ativo");
    });
  });

  const hash = window.location.hash.replace("#", "") || "inicio.html";
  carregarPaginaSPA(hash);
}

function carregarPaginaSPA(url) {
  fetch(`./paginas/${url}`)
    .then(response => {
      if (!response.ok) throw new Error("Erro ao carregar página");
      return response.text();
    })
    .then(html => {
      const conteudo = document.getElementById("conteudo");
      conteudo.innerHTML = html;

      configurarFormularios();
      atualizarListas();
      configurarBotoesLimpeza(); // 🔥 ativa botões de limpeza nas páginas carregadas
      window.scrollTo({ top: 0, behavior: "smooth" });
    })
    .catch(err => {
      document.getElementById("conteudo").innerHTML =
        "<p style='color:red; text-align:center;'>Erro ao carregar conteúdo 😕</p>";
      console.error(err);
    });
}

// ===============================
// 📋 CONFIGURAÇÃO DE FORMULÁRIOS
// ===============================
function configurarFormularios() {
  const formDoacao = document.getElementById("formDoacao");
  const formVoluntario = document.getElementById("formVoluntario");
  const formContato = document.getElementById("form-contato");

  if (formDoacao) configurarFormDoacao(formDoacao);
  if (formVoluntario) configurarFormVoluntario(formVoluntario);
  if (formContato) configurarFormContato(formContato);
}

// ===== FORMULÁRIO DE DOAÇÃO =====
function configurarFormDoacao(form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nome = form.querySelector("[name='nome']");
    const email = form.querySelector("[name='email']");
    const valor = form.querySelector("[name='valor']");
    const pagamento = form.querySelector("[name='pagamento']");
    const frequencia = form.querySelector("[name='frequencia']:checked");

    if (!nome.value || !email.value || !validarEmail(email.value) || !valor.value || !pagamento.value || !frequencia) {
      mostrarMensagem(form, "⚠️ Preencha todos os campos corretamente.", "erro");
      return;
    }

    const dados = {
      nome: nome.value.trim(),
      email: email.value.trim(),
      valor: valor.value,
      pagamento: pagamento.value,
      frequencia: frequencia.value,
      data: new Date().toLocaleString()
    };
