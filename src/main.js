import './style.css'
import { cambiarTema } from './js/tema'
import { carruselImagenes } from './js/carrusel';
// Solo meto logica aqui
const btnTema = document.getElementById('btn-tema');
const svgSol = document.getElementById('svg-sol');
const svgLuna = document.getElementById('svg-luna');

// Función para cambiar de tema
if (btnTema) {
    cambiarTema(btnTema, svgLuna, svgSol);
}

const btns = document.querySelectorAll('.btnCarrusel');
const cards = document.querySelectorAll('.cardCarrusel');
//Función de carrusel de imagenes.
carruselImagenes(btns, cards);
