import '../main.js'

//Hay que mostrar los datos traidos del login

const datos = sessionStorage.getItem('usuario');

let datosJ = null;

if (datos) {
    datosJ = JSON.parse(datos);
} else {
    window.location.href = '../../login.html';
}
console.log(datosJ);



// Plasmamos los datos del JSON en la pagina web.
/**
 * Nueva idea, para no tener muchas variables de componentes en donde se pondra la info,
 * mejor con un id en todos los que llevaran informacion usar querySelectorAll llamarlos y poner un 
 * data-component=""; con un valor similar al nombre del atributo. para que sea mas facil.
 */
// El icono del usuario del perfil
const icon = document.querySelectorAll('#icon');
icon.forEach(i => {
    i.innerText = datosJ.nombre.charAt(0);
});
// icon.innerText = datosJ.nombre.charAt(0);
const usuario = document.querySelectorAll('[data-usuario]');

// Plasma los datos del cliente de una forma dinamica.
usuario.forEach(dato => {
    let data = dato.dataset.usuario;

    if (datosJ[data] !== undefined) {
        dato.textContent = datosJ[data];
    }
});
// Plasma los datos del vehiculo de manrea dinamica
const vehiculoD = document.querySelectorAll('[data-vehiculo]');
vehiculoD.forEach(dato => {
    let data = dato.dataset.vehiculo;
    let objVehiculo = datosJ.vehiculo;
    if (objVehiculo && objVehiculo[data] !== undefined) {
        dato.textContent = objVehiculo[data];
    }
});

//Pasamos los datos de las ordenes
const ordenDat = datosJ.ordenes;
const ordenesCont = document.getElementById('ordenes');
if (ordenDat) {
    if (ordenDat.length() > 0) {
        maquetarOrdenes();
    } else {
        ordenesCont.innerHTML = '<p>No cuentas con ordenes.</p>'
    }
}
let cardsOrdenes = '';

function maquetarOrdenes() {
    ordenDat.forEach(order => {
        //Obtenemos la lista de detalles sobre la orden.
        const detalles = order.detalles;
        let totalDet = 0.0;
        if (detalles) {

            detalles.forEach(detalle => {
                console.log(`cantidad: ${detalle.cantidad} | precio unitario: ${detalle.precio_unitario}`);
                totalDet += detalle.cantidad * detalle.precio_unitario;
            });
        }
        let color = estadosOrdenes(order.estado);

        console.log(totalDet);
        cardsOrdenes += `<div
                        class="bg-(--color-cardClara) rounded-[24px] p-6 shadow-sm flex flex-col border border-transparent hover:border-(--color-accent)/30 transition-colors cursor-pointer group">
                        <div class="flex justify-between items-center mb-5">
                            <div
                                class="bg-${color} text-text px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                ${order.estado}</div>
                            <span
                                class="text-]text/50 text-xs font-bold uppercase tracking-wider">ORD-${order.id_orden}</span>
                        </div>
                        <h4 class="font-bold text-lg mb-2 text-text">Detalles</h4>
                        <p class="text-text/60 text-sm mb-6 line-clamp-2 leading-relaxed">${order.problema}
                        </p>
                        <div class="mt-auto pt-4 border-t border-accent/20 flex justify-between items-center">
                            <span class="text-base font-bold text-text">$${totalDet} <span
                                    class="text-xs text-text/50 font-medium">MXN</span></span>
                            <span
                                class="text-(--color-secAzul) group-hover:translate-x-1 font-bold text-sm transition-transform flex items-center gap-1">Ver
                                Detalles <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5l7 7-7 7"></path>
                                </svg></span>
                        </div>
                    </div>`
    });
}
function estadosOrdenes(estado) {
    let color = "";
    switch (estado) {
        case "RECIBIDO":
            color = "(--color-recibidos)"
            break;
        case "EN_PROCESO":
            color = "(--color-pendiente)"
            break;
        case "LISTO":
            color = "(--color-accent)"
            break;
        case "ENTREGADO":
            color = "(--color-primary)"
            break
    }
    return color;
};
ordenesCont.innerHTML = cardsOrdenes

const vistas = {
    vehiculo: document.getElementById('view-vehicle'),
    ordenes: document.getElementById('view-orders'),
    perfil: document.getElementById('view-profile')
};

const navegacion = {
    vehiculo: document.getElementById('nav-vehicle'),
    ordenes: document.getElementById('nav-orders'),
    perfil: document.getElementById('nav-profile')
};

// Helper para manejar clases activas/inactivas en los botones de nav
const activarPestana = (elemento, estaActivo) => {
    if (estaActivo) {
        elemento.classList.add('bg-accent/20', 'text-primary');
        elemento.classList.remove('text-text/70', 'hover:bg-accent/10');
    } else {
        elemento.classList.remove('bg-accent/20', 'text-(--color-secAzul)');
        elemento.classList.add('text-text/70', 'hover:bg-accent/10');
    }
};

function cambiarVista(nombreVista) {
    Object.values(vistas).forEach(vista => {
        if (vista) vista.classList.add('hidden');
    });

    if (vistas[nombreVista]) {
        vistas[nombreVista].classList.remove('hidden');
    }

    Object.keys(navegacion).forEach(clave => {
        if (navegacion[clave]) activarPestana(navegacion[clave], clave === nombreVista);
    });
}

if (navegacion.vehiculo) {
    navegacion.vehiculo.addEventListener('click', (e) => {
        e.preventDefault();
        cambiarVista('vehiculo');
    });
}

if (navegacion.ordenes) {
    navegacion.ordenes.addEventListener('click', (e) => {
        e.preventDefault();
        cambiarVista('ordenes');
    });
}

if (navegacion.perfil) {
    navegacion.perfil.addEventListener('click', (e) => {
        e.preventDefault();
        cambiarVista('perfil');
    });
}

cambiarVista('vehiculo');