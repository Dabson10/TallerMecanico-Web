import './style.css'
import { cambiarTema } from './tema'
// Solo meto logica aqui
const btnTema = document.getElementById('btn-tema');
const svgSol = document.getElementById('svg-sol');
const svgLuna = document.getElementById('svg-luna');

cambiarTema(btnTema, svgLuna, svgSol);

