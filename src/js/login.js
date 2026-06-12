import '../main.js'


const cambioBtn = document.querySelectorAll('#btncambio');
const formularios = document.querySelectorAll('.formulario');
if (cambioBtn) {
    console.log('éxiste')
}

cambioBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        formularios.forEach(form => {
            form.classList.add('ocultar')
        })
        let data = btn.dataset.formu;
        switch (data) {
            case "crear":
                data = "iniciar";
                break;
            case "iniciar":
                data = "crear";
                break;
        }
        console.log(`Se cambiara a ${data}`);
        const formAct = document.querySelector(`[data-form="${data}"]`);
        formAct.classList.toggle('ocultar');
    });
});