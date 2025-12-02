// =========================
// 🌍 ONG CAMINHO DE VOLTA — SCRIPT PRINCIPAL (Etapa 3 Final + Limpeza de Histórico)
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

    salvarDadosLocal("doacoesCaminhoDeVolta", dados);
    mostrarMensagem(form, "✅ Doação registrada com sucesso! Obrigado pela sua generosidade ❤️");
    form.reset();
    atualizarListas();
  });
}

// ===== FORMULÁRIO DE VOLUNTARIADO =====
function configurarFormVoluntario(form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nome = form.querySelector("[name='nome']");
    const email = form.querySelector("[name='email']");
    const telefone = form.querySelector("[name='telefone']");
    const disponibilidade = form.querySelector("[name='disponibilidade']");

    if (!nome.value || !email.value || !validarEmail(email.value) || !telefone.value || !disponibilidade.value) {
      mostrarMensagem(form, "⚠️ Preencha todos os campos corretamente.", "erro");
      return;
    }

    const dados = {
      nome: nome.value.trim(),
      email: email.value.trim(),
      telefone: telefone.value.trim(),
      disponibilidade: disponibilidade.value,
      data: new Date().toLocaleString()
    };

    salvarDadosLocal("voluntariosCaminhoDeVolta", dados);
    mostrarMensagem(form, "✅ Inscrição registrada com sucesso! Obrigado por se voluntariar ❤️");
    form.reset();
    atualizarListas();
  });
}

// ===== Botão de limpeza do histórico de mensagens =====
const btnContatos = document.getElementById("btnLimparContatos");
if (btnContatos) {
  btnContatos.addEventListener("click", () => {
    if (confirm("Tem certeza que deseja apagar o histórico de mensagens?")) {
      localStorage.removeItem("contatosCaminhoDeVolta");
      atualizarListas();
      alert("✅ Histórico de mensagens apagado com sucesso!");
    }
  });
}

// ===== FORMULÁRIO DE CONTATO =====
function configurarFormContato(form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nome = form.querySelector("[name='nome']");
    const email = form.querySelector("[name='email']");
    const mensagem = form.querySelector("[name='mensagem']");

    if (!nome.value || !email.value || !validarEmail(email.value) || !mensagem.value) {
      mostrarMensagem(form, "⚠️ Preencha todos os campos corretamente.", "erro");
      return;
    }

    const dados = {
      nome: nome.value.trim(),
      email: email.value.trim(),
      mensagem: mensagem.value.trim(),
      data: new Date().toLocaleString()
    };

    salvarDadosLocal("contatosCaminhoDeVolta", dados);
    mostrarMensagem(form, "✅ Mensagem enviada com sucesso! Entraremos em contato em breve.");
    form.reset();
    atualizarListas();
  });
}

// ===============================
// 🧩 EXIBIÇÃO DE DADOS SALVOS (TEMPLATES JS)
// ===============================
function atualizarListas() {
  const listaDoacoes = document.getElementById("lista-doacoes");
  if (listaDoacoes) {
    const doacoes = JSON.parse(localStorage.getItem("doacoesCaminhoDeVolta")) || [];
    listaDoacoes.innerHTML = doacoes.length
      ? doacoes.map(templateDoacao).join("")
      : "<p>Nenhuma doação registrada ainda.</p>";
  }

  const listaVoluntarios = document.getElementById("lista-voluntarios");
  if (listaVoluntarios) {
    const voluntarios = JSON.parse(localStorage.getItem("voluntariosCaminhoDeVolta")) || [];
    listaVoluntarios.innerHTML = voluntarios.length
      ? voluntarios.map(templateVoluntario).join("")
      : "<p>Nenhum voluntário cadastrado ainda.</p>";
  }

  const listaContatos = document.getElementById("lista-contatos");
  if (listaContatos) {
    const contatos = JSON.parse(localStorage.getItem("contatosCaminhoDeVolta")) || [];
    listaContatos.innerHTML = contatos.length
      ? contatos.map(templateContato).join("")
      : "<p>Nenhuma mensagem recebida ainda.</p>";
  }
}

// ===============================
// 🗑️ BOTÕES DE LIMPEZA DE HISTÓRICO
// ===============================
function configurarBotoesLimpeza() {
  const btnDoacoes = document.getElementById("btnLimparDoacoes");
  if (btnDoacoes) {
    btnDoacoes.addEventListener("click", () => {
      if (confirm("Tem certeza que deseja apagar o histórico de doações?")) {
        localStorage.removeItem("doacoesCaminhoDeVolta");
        atualizarListas();
        alert("✅ Histórico de doações apagado com sucesso!");
      }
    });
  }

  const btnVoluntarios = document.getElementById("btnLimparVoluntarios");
  if (btnVoluntarios) {
    btnVoluntarios.addEventListener("click", () => {
      if (confirm("Tem certeza que deseja apagar o histórico de voluntários?")) {
        localStorage.removeItem("voluntariosCaminhoDeVolta");
        atualizarListas();
        alert("✅ Histórico de voluntários apagado com sucesso!");
      }
    });
  }
}

// ===============================
// 💬 TEMPLATES VISUAIS
// ===============================
function templateDoacao(d) {
  return `
    <div class="card-template doacao">
      <div class="card-title">${d.nome}</div>
      <div class="card-info">💰 R$${d.valor} — ${d.pagamento.toUpperCase()} (${d.frequencia})</div>
      <div class="card-date">${d.data}</div>
    </div>
  `;
}

function templateVoluntario(v) {
  return `
    <div class="card-template voluntario">
      <div class="card-title">${v.nome}</div>
      <div class="card-info">🤝 ${v.disponibilidade} | ${v.telefone}</div>
      <div class="card-date">${v.data}</div>
    </div>
  `;
}

function templateContato(c) {
  return `
    <div class="card-template contato">
      <div class="card-title">${c.nome}</div>
      <div class="card-info">✉️ ${c.email}</div>
      <p>${c.mensagem}</p>
      <div class="card-date">${c.data}</div>
    </div>
  `;
}

// ===============================
// 🚀 CARREGAR AUTOMATICAMENTE A PÁGINA INICIAL
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const conteudo = document.getElementById("conteudo");
  const paginaInicial = "inicio.html";

  fetch(`paginas/${paginaInicial}`)
    .then(res => res.text())
    .then(html => conteudo.innerHTML = html)
    .catch(() => conteudo.innerHTML = "<p style='color:red;'>Erro ao carregar conteúdo 😕</p>");
});
/* =========================================
   ♿ Tema escuro + Alto contraste (persistência)
   ========================================= */
(function () {
  const root = document.documentElement;
  const btnTema = document.getElementById('btnTema');
  const btnContraste = document.getElementById('btnContraste');

  // Estados salvos
  const temaSalvo = localStorage.getItem('cdv:theme');          // 'dark' | 'light' | null
  const contrasteSalvo = localStorage.getItem('cdv:contrast');  // 'high' | 'normal' | null

  // Aplica estados salvos
  if (temaSalvo) root.setAttribute('data-theme', temaSalvo);
  if (contrasteSalvo) root.setAttribute('data-contrast', contrasteSalvo);

  // Atualiza rótulos/aria
  function refreshLabels() {
    const dark = root.getAttribute('data-theme') === 'dark';
    const high = root.getAttribute('data-contrast') === 'high';

    if (btnTema) {
      btnTema.setAttribute('aria-pressed', String(dark));
      btnTema.textContent = dark ? '☀️ Modo claro' : '🌙 Modo escuro';
    }
    if (btnContraste) {
      btnContraste.setAttribute('aria-pressed', String(high));
      btnContraste.textContent = high ? '🌓 Contraste padrão' : '🌓 Alto contraste';
    }
  }
  refreshLabels();

  // Alterna tema escuro/claro
  btnTema?.addEventListener('click', () => {
    const atual = root.getAttribute('data-theme');
    const prox = atual === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', prox);
    localStorage.setItem('cdv:theme', prox);
    refreshLabels();
  });

  // Alterna alto contraste
  btnContraste?.addEventListener('click', () => {
    const atual = root.getAttribute('data-contrast');
    const prox = atual === 'high' ? 'normal' : 'high';
    if (prox === 'normal') {
      root.removeAttribute('data-contrast');
      localStorage.setItem('cdv:contrast', 'normal');
    } else {
      root.setAttribute('data-contrast', 'high');
      localStorage.setItem('cdv:contrast', 'high');
    }
    refreshLabels();
  });

  // Acessibilidade extra: fecha foco no topo ao carregar SPA
  const observer = new MutationObserver(() => {
    const h2 = document.querySelector('#conteudo h1, #conteudo h2');
    if (h2) h2.setAttribute('tabindex', '-1'), h2.focus();
  });
  const conteudo = document.getElementById('conteudo');
  if (conteudo) observer.observe(conteudo, { childList: true, subtree: true });
})();
