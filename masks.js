document.addEventListener('DOMContentLoaded', () => {
    const cpf = document.getElementById('cpf');
    cpf.addEventListener('input', () => {cpf.value = cpf.value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');});
    const telefone = document.getElementById('telefone');
    telefone.addEventListener('input', () => {telefone.value = telefone.value.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');});
    const cep = document.getElementById('cep');
    cep.addEventListener('input', () => {cep.value = cep.value.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2');});
});