export function cambiarTema(boton, svgLuna, svgSol) {
    boton.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        svgLuna.classList.toggle('hidden');
        svgSol.classList.toggle('hidden');
    });
}