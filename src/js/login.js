import '../main.js'

// Mostrar contraseña
const svgBtns = document.querySelectorAll('#btn-svg');
const inpPass = document.querySelectorAll('#pass-cre');

//Recorre los botoenes y verifica en cual sera su dirección.
svgBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        let data = btn.dataset.svg;
        //Filtramos si el svg es para crear o iniciar sesion
        if (data.includes('crear')) {
            //Ahora si cambiamos el svg y el input
            cambioSimple(data, btn, "crear")
        } else if (data.includes('iniciar')) {
            cambioSimple(data, btn, "iniciar")
        }
    });
});
/**
 * Esta funcion sirve para no repetir dos veces el codigo.
 * @param {*} dataBtn : Valor de data del boton.
 * @param {*} btn : Boton que fue presionado.
 * @param {*} localizado : Valor que sera pasado para saber si es crear o inciar.
 */
function cambioSimple(dataBtn, btn, localizado) {
    let svgData = "";
    if (dataBtn.includes('abierto')) {
        //Si es abierto entonces cerramos el ojo y cambiamos el tipo de input
        btn.classList.add('hidden')
        //Localizamos el svg y hacemos cambios
        svgData = "cerrado-" + localizado;
        const cambiosvg = document.querySelector(`[data-svg="${svgData}"]`);
        cambiosvg.classList.toggle('hidden');
        //Hacemos el cambio del input
        const inputPass = document.querySelector(`[data-input="${localizado}"]`);
        inputPass.type = "text";
        inputPass.placeholder = "Contraseña";
    } else {
        btn.classList.add('hidden')
        svgData = "abierto-" + localizado;
        const cambiosvg = document.querySelector(`[data-svg="${svgData}"]`);
        cambiosvg.classList.toggle('hidden')
        const inputPass = document.querySelector(`[data-input="${localizado}"]`);
        inputPass.type = "password";
        inputPass.placeholder = "••••••••••";

    }
}


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