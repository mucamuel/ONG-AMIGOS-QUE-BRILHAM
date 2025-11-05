document.addEventListener('DOMContentLoaded', () => {
    // Menu responsivo
    const nav = document.querySelector('nav ul');
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'Menu';
    toggleBtn.style.background = '#004080';
    toggleBtn.style.color = '#fff';
    toggleBtn.style.border = 'none';
    toggleBtn.style.padding = '10px';
    document.querySelector('header').prepend(toggleBtn);
    toggleBtn.addEventListener('click', () => {
        nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    });

    // Validação avançada
    const form = document.querySelector('form');
    if(form){
        form.addEventListener('submit', (e) => {
            const cpf = document.getElementById('cpf').value;
            if(cpf.length < 14){
                alert('CPF inválido!');
                e.preventDefault();
            }
        });
    }

    // Animação simples
    document.querySelectorAll('section').forEach(sec => {
        sec.style.opacity = 0;
        sec.style.transition = 'opacity 1s';
        setTimeout(() => {sec.style.opacity = 1;}, 500);
    });
});