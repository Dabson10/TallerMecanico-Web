import '../main.js'

//Hay que mostrar los datos traidos del login

// Retrieve the logged-in user data from sessionStorage
const datos = sessionStorage.getItem('usuario');


let datosJ = null;
if (datos) {
    datosJ = JSON.parse(datos);
} else {
    window.location.href = '../../login.html';
}
console.log(datosJ);



// Plasmamos los datos del JSON en la pagina web.

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
const vehiculoData = datosJ.vehiculo;

// Render vehicle card (handles null internally)
maquetarCardAuto();


//Maquetar la tarjeta inicial y la de mis vehiculos en el perfil.
function maquetarCardAuto() {
    const cardAuto = document.getElementById('cardAuto');
    const contAutoN = document.getElementById('contAutoN');
    let contenedor = "";
    let perfCont = "";
    if (vehiculoData != null) {
        contenedor = `<div
                                class="inline-flex items-center gap-2 px-3 py-1.5 bg--primary/20 text-(primary rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4 border border-(--color-primary)/30">
                                <div class="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                                Vehículo en Taller
                            </div>

                            <h2 class="text-3xl md:text-4xl font-bold mb-2" data-vehiculo="modelo" id="nombreVe">${vehiculoData.modelo}</h2>
                            <div
                                class="flex flex-wrap items-center gap-3 text-(--color-textl)/70 text-xs md:text-sm font-semibold uppercase tracking-widest mb-8">
                                <span>Placa: ${vehiculoData.placas}</span>
                                <span class="w-1.5 h-1.5 bg-(--color-textl)/50 rounded-full"></span>
                                <span>Marca: ${vehiculoData.marca}</span>
                            </div>
                            <!-- Tarjeta del estado de la orden. -->
                            <div id="cardEstadoA"
                                class="bg-(--color-cardClara)/10 backdrop-blur-md rounded-2xl p-4 md:p-5 inline-block border border-(--color-cardClara)/10 shadow-inner w-full md:w-auto">
                            
                            </div>`;
        perfCont = `<div
                                    class="flex flex-col sm:flex-row items-center justify-between p-4 bg-(--color-secClaro) rounded-2xl border border-(--color-accent)/20 hover:border-(--color-primary) transition-colors">
                                    <div class="flex items-center gap-4 mb-4 sm:mb-0">
                                        <div
                                            class="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-(--color-secAzul)">
                                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-text" data-vehiculo="modelo"> ${vehiculoData.modelo}
                                            </h4>
                                            <p
                                                class="text-xs font-semibold text-text/60 uppercase tracking-widest mt-1">
                                                Placa: ${vehiculoData.placas}</p>
                                        </div>
                                    </div>
                                    <button
                                        class="text-(--color-secAzul) font-bold text-sm bg-(--color-cardClara) px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-shadow">Ver
                                        Expediente</button>
                                </div>`;
    } else {
        console.log('perro');
        contenedor += `<div
                                class="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/20 text-primary rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4 border border-(--color-primary)/30">
                                <div class="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                                Sin vehículo en Taller
                            </div>

                            <h2 class="text-3xl md:text-4xl font-bold mb-2" data-vehiculo="modelo" id="nombreVe">Aun no tiene vehiculo registrado.</h2>
                            `;
        perfCont = `<button
                                    class="mt-4 flex items-center justify-center gap-2 w-full border-2 border-dashed border-(--color-accent) text-(--color-text)/60 font-bold py-4 rounded-2xl hover:bg-(--color-secClaro) hover:border-(--color-primary) hover:text-(--color-secAzul) transition-all">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 4v16m8-8H4"></path>
                                    </svg>
                                    Añadir Vehículo
                                </button>`;
    }
    cardAuto.innerHTML = contenedor;
    contAutoN.innerHTML = perfCont;
}



//Pasamos los datos de las ordenes
const ordenesArray = datosJ.ordenes;
const ordenesContainer = document.getElementById('ordenes');
const cardInfo = document.getElementById("cardEstadoA");
let cardsOrdenes = '';
let cardEstado = "";
if (ordenesArray.length > 0) {
    // There are orders – build the UI cards
    maquetarOrdenes();
} else {
    // No orders for this client
    ordenesContainer.innerHTML = '<p>No cuentas con ordenes.</p>';
}

function maquetarOrdenes() {
    // Build HTML cards for each order in the orders array
    ordenesArray.forEach(order => {
        // Extract order details and compute total price
        const detalles = order.detalles || [];
        let total = 0.0;
        detalles.forEach(det => {
            console.log(`cantidad: ${det.cantidad} | precio unitario: ${det.precio_unitario}`);
            total += det.cantidad * det.precio_unitario;
        });
        // Determine badge color based on order status
        const badgeColor = estadosOrdenes(order.estado);
        console.log(badgeColor);
        // Assemble the card HTML (using Tailwind-like utility classes)
        cardsOrdenes += `
        <div class="bg-(--color-cardClara) rounded-[24px] p-6 shadow-sm flex flex-col border border-transparent hover:border-(--color-accent)/30 transition-colors cursor-pointer group">
            <div class="flex justify-between items-center mb-5">
                <div class="${badgeColor} text-text px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    ${order.estado}
                </div>
                <span class="text-text/50 text-xs font-bold uppercase tracking-wider">ORD-${order.id_orden}</span>
            </div>
            <h4 class="font-bold text-lg mb-2 text-text">Detalles</h4>
            <p class="text-text/60 text-sm mb-6 line-clamp-2 leading-relaxed">${order.problema}</p>
            <div class="mt-auto pt-4 border-t border-accent/20 flex justify-between items-center">
                <span class="text-base font-bold text-text">$${total.toFixed(2)} <span class="text-xs text-text/50 font-medium">MXN</span></span>
                <span class="text-(--color-secAzul) group-hover:translate-x-1 font-bold text-sm transition-transform flex items-center gap-1">
                    Ver Detalles
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </span>
            </div>
        </div>`;
        if (order.estado != "ENTREGADO") {
            let cantidad = cargaEstado(order.estado);
            //Si es diferente a entregado entonces mostramos la pequeña tarjeta de estado..
            cardEstado += `<p
                                    class="text-[10px] md:text-xs text-(--color-textl)/70 uppercase tracking-widest mb-1.5 font-bold">
                                    Estado Actual de la Orden</p>
                                <div class="flex flex-col  ">
                                    <span class="text-[13px] md:text-xs text-(--color-textl)/70 tracking-widest mb-1.5 font-bold">${order.estado}</span>
                                    <span class="text-lg md:text-xl font-bold text-(--color-textl)">                                        ${order.problema}</span>
                                </div>
                                <div class="mt-4 bg-black/30 rounded-full h-1.5 w-full overflow-hidden">
                                    <div class="w-${cantidad} ${badgeColor} h-full rounded-full"></div>
                                </div>
                                <div
                                    class="flex justify-between mt-2 text-[10px] text-(--color-textl)/70 font-bold uppercase tracking-wider">
                                    <span>RECIBIDO</span>
                                    <span class="text-(--color-textl)">EN_PROCESO</span>
                                    <span>LISTO</span>
                                </div>`
        } else {
            cardEstado += `<p
                                    class="text-[10px] md:text-xs text-(--color-textl)/70 uppercase tracking-widest mb-1.5 font-bold">
                                    Estado Actual de la Orden</p>
                                <div class="flex flex-col  ">
                                    <span class="text-lg md:text-xl font-bold text-(--color-textl)">No hay ordenes actuales.</span>
                                </div>
                                `
        }
    });
    // Render the constructed cards into the container
    ordenesContainer.innerHTML = cardsOrdenes;
    cardInfo.innerHTML = cardEstado;
}

function cargaEstado(estado) {
    switch (estado) {
        case "RECIBIDO":
            return "1/6";
        case "EN_PROCESO":
            return "1/2";
        case "LISTO":
            return "full";
        case "ENTREGADO":
            return "full"
    }
}
function estadosOrdenes(estado) {
    // Map order status to a CSS color variable
    switch (estado) {
        case "RECIBIDO":
            return "bg-[var(--color-recibidos)]";
        case "EN_PROCESO":
            return "bg-[var(--color-proceso)]";
        case "LISTO":
            return "bg-accent";
        case "ENTREGADO":
            return "bg-primary";
        default:
            return "";
    }
};

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