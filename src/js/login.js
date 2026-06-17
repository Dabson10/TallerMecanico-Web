import '../main.js'
import { traerCliente } from './services/cuentasAuth.js';
//Tenemos dos JSON para poder conectarse rapido a los datos del usuario.
const clienteLog = 'sadractadeo19@gmail.com';
const tecnicoLog = 'juan_mecanico@gmail.com';
// import '../../.cliente.html'



//Vamos a hacer una validación simple antes de pasar a la pagina web de cada rol.
const btnCliente = document.getElementById('btnCliente');
const btnTecnico = document.getElementById('btnTecnico');

clienteDatos();
async function clienteDatos() {
    try {
        btnCliente.addEventListener('click', async () => {
            //Ahora pasamos el JSON con las contraseñas 
            const clienteDatos = await traerCliente(clienteLog);
            console.log(clienteDatos);
            sessionStorage.setItem("usuario", JSON.stringify(clienteDatos));
            window.location.href = '../../cliente.html';
        });
    } catch (error) {
        console.log(`Error del tipo: ${error}`);
    }
}

// Ocultar el input de nuemero de telefono y el apeliido  para tecnicos.
//Obtenemos la URL pero en especifico despues del "?" osea los valores pasados por parametro
const pregunta = window.location.search;
//Ahora instanciamos sobre pregunta para poder obtener los valores del parametro.
const parametro = new URLSearchParams(pregunta);
//Obtenemos el parametro de rol
const rol = parametro.get("rol");
//Ahora debemos buscar los inputs que no usaran los tecnicos.
const inputsCliente = document.querySelectorAll('.cliente');
if (rol === "tecnico") {
    inputsCliente.forEach(inp => {
        inp.classList.toggle('hidden');
    });
}



// Mostrar contraseña
const svgBtns = document.querySelectorAll('#btn-svg');

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