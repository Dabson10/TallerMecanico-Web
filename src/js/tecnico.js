import '../main.js';
import { traerRefacciones } from './services/refaccion.js';
//Obtenemos los datos del tecnico
const datos = sessionStorage.getItem('tecnico');

let datosT = null;
if (datos) {
    datosT = JSON.parse(datos);
} else {
    // window.location.href = '../../login.html';
}

console.log(datosT);

const refaccionesData = await mostrarRefacciones();
console.log(refaccionesData);
async function mostrarRefacciones() {
    const refacciones = await traerRefacciones();
    return refacciones;
}



if (datosT) {
    const inicial = datosT.nombre.charAt(0).toUpperCase();

    // Actualizar iconos de perfil
    const icons = document.querySelectorAll('.icon-tecnico');
    icons.forEach(i => i.textContent = inicial);

    // Vista 1: Resumen
    document.getElementById('nombre-tecnico').textContent = datosT.nombre;

    // Vista Perfil
    document.getElementById('perfil-nombre').textContent = datosT.nombre;
    document.getElementById('perfil-correo').textContent = datosT.correo;
    document.getElementById('perfil-id').textContent = `TECH-${datosT.id_tecnico.toString().padStart(4, '0')}`;

    // Procesar órdenes
    const ordenes = datosT.ordenes || [];
    const pesoEstado = {
        "LISTO": 1,
        "EN_PROCESO": 2,
        "RECIBIDO": 3,
        "ENTREGADO": 4
    };

    // Ordenar de más próximo a terminar (LISTO) a más nuevo (RECIBIDO), ENTREGADO al final
    ordenes.sort((a, b) => pesoEstado[a.estado] - pesoEstado[b.estado]);

    let vehiculosActivos = 0;
    let enProgreso = 0;
    let completados = 0;

    // Contadores para filtros
    let recibidoCount = 0;
    let enprocesoCount = 0;
    let listoCount = 0;
    let entregadoCount = 0;

    let htmlVehiculos = '';

    ordenes.forEach(orden => {
        const estado = orden.estado;
        const vehiculo = orden.cliente.vehiculo;

        // Stats
        if (estado === 'ENTREGADO') {
            completados++;
            entregadoCount++;
        } else {
            vehiculosActivos++;
            if (estado === 'EN_PROCESO') {
                enProgreso++;
                enprocesoCount++;
            } else if (estado === 'RECIBIDO') {
                recibidoCount++;
            } else if (estado === 'LISTO') {
                listoCount++;
            }
        }

        // Tarjeta Vehículos (sólo activos)
        if (estado !== 'ENTREGADO') {
            let badgeHtml = '';
            if (estado === 'EN_PROCESO') {
                badgeHtml = `<div class="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex gap-1 items-center">
                                <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> En Proceso
                            </div>`;
            } else if (estado === 'RECIBIDO') {
                badgeHtml = `<div class="bg-(--color-accent)/40 text-(--color-text)/70 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                Recibido
                            </div>`;
            } else if (estado === 'LISTO') {
                badgeHtml = `<div class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex gap-1 items-center">
                                Listo
                            </div>`;
            }

            htmlVehiculos += `
                <div class="card-vehiculo shrink-0 w-80 bg-(--color-cardClara) rounded-[24px] p-6 shadow-sm border border-(--color-accent)/30">
                    <div class="flex justify-between items-center mb-4">
                        ${badgeHtml}
                        <span class="text-(--color-text)/50 text-xs font-bold uppercase">ORD-${orden.id_orden}</span>
                    </div>
                    <h4 class="font-bold text-xl mb-1 text-text">${vehiculo.marca} ${vehiculo.modelo}</h4>
                    <p class="text-text/60 text-xs font-bold uppercase tracking-widest mb-4">Placa: ${vehiculo.placas}</p>
                    <div class="bg-(--color-secClaro) rounded-xl p-3 mb-4">
                        <p class="text-sm font-semibold text-(--color-secAzul)">Problema: ${orden.problema}</p>
                    </div>
                    <button class="w-full border-2 border-(--color-secAzul) text-(--color-secAzul) font-bold py-2 rounded-xl hover:bg-(--color-secAzul) hover:text-(--color-textl) transition-colors" onclick="mostrarDetallesOrden(${orden.id_orden})">Mostrar detalles</button>
                </div>
            `;
        }
    });

    // Inyectar datos en HTML
    document.getElementById('cantidad-vehiculos').textContent = vehiculosActivos;
    document.getElementById('count-progreso').textContent = enProgreso;
    document.getElementById('count-completados').textContent = completados;
    document.getElementById('perfil-completadas').textContent = completados;

    const vehiculosCont = document.getElementById('vehiculos-container');
    if (vehiculosActivos > 0) {
        vehiculosCont.innerHTML = htmlVehiculos;
    } else {
        vehiculosCont.innerHTML = '<p class="text-text/70 mt-4">No tienes vehículos activos asignados actualmente.</p>';
    }

    const btnTodas = document.getElementById('btn-filtro-todas');
    const btnRecibido = document.getElementById('btn-filtro-recibido');
    const btnEnproceso = document.getElementById('btn-filtro-enproceso');
    const btnListo = document.getElementById('btn-filtro-listo');
    const btnEntregado = document.getElementById('btn-filtro-entregado');

    btnTodas.textContent = `Todas (${ordenes.length})`;
    btnRecibido.textContent = `Recibido (${recibidoCount})`;
    btnEnproceso.textContent = `En Proceso (${enprocesoCount})`;
    btnListo.textContent = `Listo (${listoCount})`;
    btnEntregado.textContent = `Entregado (${entregadoCount})`;

    const renderOrdenes = (filtro) => {
        let filtradas = ordenes;
        if (filtro !== 'TODAS') {
            filtradas = ordenes.filter(o => o.estado === filtro);
        }

        let htmlOrdenes = '';
        filtradas.forEach(orden => {
            const estado = orden.estado;
            const vehiculo = orden.cliente.vehiculo;

            let progText = '0%';
            let btnText = 'Mostrar';
            let btnClass = 'bg-(--color-secAzul) text-(--color-textl) hover:opacity-90';
            let badgeColor = 'bg-(--color-accent)/40 text-(--color-text)/70';
            let iconHtml = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
            let iconBg = 'bg-amber-100 text-amber-600';

            if (estado === 'RECIBIDO') {
                progText = 'Progreso: 10%';
            } else if (estado === 'EN_PROCESO') {
                progText = 'Progreso: 50%';
            } else if (estado === 'LISTO') {
                progText = 'Progreso: 100%';
                btnText = 'Revisar';
                iconBg = 'bg-green-100 text-green-600';
            } else if (estado === 'ENTREGADO') {
                progText = 'Finalizado';
                badgeColor = 'bg-(--color-accent)/30 text-(--color-cardAzul)';
                btnText = 'Ver Reporte';
                btnClass = 'border border-(--color-secAzul) text-(--color-secAzul) hover:bg-(--color-accent)/20';
                iconHtml = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`;
                iconBg = 'bg-(--color-accent)/30 text-(--color-cardAzul)';
            }

            htmlOrdenes += `
                <div class="flex flex-col md:flex-row md:items-center justify-between p-4 border border-(--color-accent)/20 rounded-2xl hover:bg-(--color-secClaro) transition-colors cursor-pointer">
                    <div class="flex gap-4 items-start md:items-center mb-4 md:mb-0">
                        <div class="w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center">
                            ${iconHtml}
                        </div>
                        <div>
                            <h4 class="font-bold text-lg text-(--color-text)">ORD-${orden.id_orden} • ${orden.problema}</h4>
                            <p class="text-sm text-(--color-text)/60 font-medium">${vehiculo.marca} ${vehiculo.modelo} - ${vehiculo.placas}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 w-full md:w-auto">
                        <span class="text-xs font-bold ${badgeColor} px-3 py-1 rounded-full uppercase">${progText}</span>
                        <button class="flex-1 md:flex-none text-center px-4 py-2 rounded-xl font-bold transition-colors ${btnClass}" onclick="mostrarDetallesOrden(${orden.id_orden})">${btnText}</button>
                    </div>
                </div>
            `;
        });

        const ordenesCont = document.getElementById('ordenes-container');
        if (filtradas.length > 0) {
            ordenesCont.innerHTML = htmlOrdenes;
        } else {
            ordenesCont.innerHTML = '<p class="text-text/70">No hay órdenes para mostrar en esta categoría.</p>';
        }

        // Estilos de botones
        const resetBtn = (btn) => {
            if (btn) btn.className = "px-4 py-2 bg-(--color-accent)/20 text-(--color-secAzul) rounded-full text-sm font-bold whitespace-nowrap";
        };
        const activeBtn = (btn) => {
            if (btn) btn.className = "px-4 py-2 bg-(--color-primary) text-(--color-textl) rounded-full text-sm font-bold shadow-sm whitespace-nowrap";
        };

        resetBtn(btnTodas);
        resetBtn(btnRecibido);
        resetBtn(btnEnproceso);
        resetBtn(btnListo);
        resetBtn(btnEntregado);

        if (filtro === 'TODAS') activeBtn(btnTodas);
        if (filtro === 'RECIBIDO') activeBtn(btnRecibido);
        if (filtro === 'EN_PROCESO') activeBtn(btnEnproceso);
        if (filtro === 'LISTO') activeBtn(btnListo);
        if (filtro === 'ENTREGADO') activeBtn(btnEntregado);
    };

    if (btnTodas) btnTodas.addEventListener('click', () => renderOrdenes('TODAS'));
    if (btnRecibido) btnRecibido.addEventListener('click', () => renderOrdenes('RECIBIDO'));
    if (btnEnproceso) btnEnproceso.addEventListener('click', () => renderOrdenes('EN_PROCESO'));
    if (btnListo) btnListo.addEventListener('click', () => renderOrdenes('LISTO'));
    if (btnEntregado) btnEntregado.addEventListener('click', () => renderOrdenes('ENTREGADO'));

    // Render inicial
    renderOrdenes('TODAS');

    // Funcionalidad Modal Detalles
    window.mostrarDetallesOrden = (idOrden) => {
        const orden = ordenes.find(o => o.id_orden === idOrden);
        if (!orden) return;

        document.getElementById('modal-titulo').textContent = `Detalles ORD-${orden.id_orden}`;

        const contenido = document.getElementById('modal-contenido');
        let htmlContent = '';
        let total = 0;

        if (orden.detalles && orden.detalles.length > 0) {
            orden.detalles.forEach(det => {
                const subtotal = det.cantidad * det.precio_unitario;
                total += subtotal;
                htmlContent += `
                    <div class="flex justify-between items-center p-4 bg-(--color-secClaro) rounded-2xl border border-(--color-accent)/20">
                        <div>
                            <h4 class="font-bold text-(--color-text)">${det.refaccion.nombre}</h4>
                            <p class="text-xs text-(--color-text)/60 font-medium">Num: ${det.refaccion.numero} | Cantidad: ${det.cantidad}</p>
                        </div>
                        <div class="text-right">
                            <p class="font-bold text-(--color-text)">$${subtotal.toFixed(2)}</p>
                            <p class="text-[10px] text-(--color-text)/50 uppercase">($${det.precio_unitario.toFixed(2)} c/u)</p>
                        </div>
                    </div>
                `;
            });
        } else {
            htmlContent = '<p class="text-text/70 text-center py-4">No hay refacciones o detalles adicionales registrados para esta orden.</p>';
        }

        contenido.innerHTML = htmlContent;
        document.getElementById('modal-total').textContent = total.toFixed(2);

        document.getElementById('modal-detalles').classList.remove('hidden');
    };

    // Cerrar modal
    document.getElementById('btn-cerrar-modal').addEventListener('click', () => {
        document.getElementById('modal-detalles').classList.add('hidden');
    });
}

const vistas = {
    vehiculos: document.getElementById('view-vehicles'),
    ordenes: document.getElementById('view-orders'),
    refacciones: document.getElementById('view-refacciones'),
    perfil: document.getElementById('view-profile')
};

const navegacion = {
    vehiculos: document.getElementById('nav-vehicles'),
    ordenes: document.getElementById('nav-orders'),
    refacciones: document.getElementById('nav-refaccion'),
    perfil: document.getElementById('nav-profile')
};

// Helper para manejar clases activas/inactivas en los botones de nav
const activarPestana = (elemento, estaActivo) => {
    if (estaActivo) {
        elemento.classList.add('bg-accent/20', 'text-(--color-secAzul)');
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

if (navegacion.vehiculos) {
    navegacion.vehiculos.addEventListener('click', (e) => {
        e.preventDefault();
        cambiarVista('vehiculos');
    });
}

if (navegacion.ordenes) {
    navegacion.ordenes.addEventListener('click', (e) => {
        e.preventDefault();
        cambiarVista('ordenes');
    });
}

if (navegacion.refacciones) {
    navegacion.refacciones.addEventListener('click', (e) => {
        e.preventDefault();
        cambiarVista('refacciones');
    });
}

if (navegacion.perfil) {
    navegacion.perfil.addEventListener('click', (e) => {
        e.preventDefault();
        cambiarVista('perfil');
    });
}

cambiarVista('vehiculos');

// ---- Lógica de Refacciones (JSON de ejemplo temporal) ----
// const refaccionesData = [
//     {
//         "id_refaccion": 1,
//         "nombre": "Aceite Motor 5W-30",
//         "numero": "ACE-001",
//         "stock": 50,
//         "precioActual": 299.99
//     },
//     {
//         "id_refaccion": 4,
//         "nombre": "Bujías NGK Iridium",
//         "numero": "BUJ-004",
//         "stock": 100,
//         "precioActual": 89.75
//     },
//     {
//         "id_refaccion": 6,
//         "nombre": "Filtro de Aceite",
//         "numero": "FIL-006",
//         "stock": 60,
//         "precioActual": 75.25
//     },
//     {
//         "id_refaccion": 7,
//         "nombre": "Correa de Distribución",
//         "numero": "COR-007",
//         "stock": 25,
//         "precioActual": 320.0
//     }
// ];

let ordenActualRefacciones = 'desc'; // 'desc' o 'asc'
let busquedaActualRefacciones = '';

function renderTablaRefacciones() {
    let filtradas = refaccionesData.filter(r =>
        r.nombre.toLowerCase().includes(busquedaActualRefacciones.toLowerCase()) ||
        r.numero.toLowerCase().includes(busquedaActualRefacciones.toLowerCase())
    );

    if (ordenActualRefacciones === 'desc') {
        filtradas.sort((a, b) => b.stock - a.stock);
    } else {
        filtradas.sort((a, b) => a.stock - b.stock);
    }

    const tbody = document.getElementById('refacciones-tbody');
    if (!tbody) return;

    let html = '';
    filtradas.forEach(ref => {
        let stockBadge = ref.stock > 30
            ? `<span class="bg-green-100 text-green-800 px-2 py-1 rounded font-bold">${ref.stock}</span>`
            : `<span class="bg-amber-100 text-amber-800 px-2 py-1 rounded font-bold">${ref.stock}</span>`;

        html += `
            <tr class="border-b border-(--color-accent)/10 hover:bg-(--color-secClaro) transition-colors">
                <td class="py-3 px-4 font-medium">${ref.nombre}</td>
                <td class="py-3 px-4">${ref.numero}</td>
                <td class="py-3 px-4 font-bold">$${ref.precioActual.toFixed(2)}</td>
                <td class="py-3 px-4">${stockBadge}</td>
                <td class="py-3 px-4 text-center">
                    <button class="bg-(--color-accent)/20 text-(--color-secAzul) hover:bg-(--color-secAzul) hover:text-(--color-textl) px-3 py-1 rounded transition-colors text-xs font-bold" onclick="editarRefaccion(${ref.id_refaccion})">Editar</button>
                </td>
            </tr>
        `;
    });

    if (filtradas.length === 0) {
        html = `<tr><td colspan="5" class="py-6 text-center text-(--color-text)/50">No se encontraron refacciones</td></tr>`;
    }

    tbody.innerHTML = html;
}

// ======= MODAL: AGREGAR REFACCIÓN =======
let modoMuchas = false;
let contadorFilas = 0;

const modalAgregar = document.getElementById('modal-agregar-refaccion');
const btnAbrirAgregar = document.getElementById('btn-abrir-agregar-refaccion');
const btnCerrarAgregar = document.getElementById('btn-cerrar-agregar-refaccion');
const btnToggleMuchas = document.getElementById('btn-toggle-muchas');
const btnGuardarRefaccion = document.getElementById('btn-guardar-refaccion');
const formUna = document.getElementById('form-una-refaccion');
const formMuchas = document.getElementById('form-muchas-refacciones');
const listaContainer = document.getElementById('lista-refacciones-container');
const btnAgregarFila = document.getElementById('btn-agregar-fila-ref');

function crearFilaRefaccion() {
    contadorFilas++;
    const id = contadorFilas;
    const div = document.createElement('div');
    div.id = `fila-ref-${id}`;
    div.className = 'bg-(--color-secClaro) rounded-xl p-4 border border-(--color-accent)/20 relative';
    div.innerHTML = `
        <button type="button" class="absolute top-2 right-2 text-(--color-text)/40 hover:text-red-500 transition-colors" onclick="eliminarFilaRef(${id})">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div class="grid grid-cols-2 gap-3">
            <div class="col-span-2 md:col-span-1">
                <label class="text-[10px] font-bold text-(--color-text)/50 uppercase mb-1 block">Nombre</label>
                <input type="text" class="ref-m-nombre w-full bg-(--color-cardClara) border border-(--color-accent)/20 text-(--color-text) text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-(--color-secAzul)" placeholder="Nombre">
            </div>
            <div class="col-span-2 md:col-span-1">
                <label class="text-[10px] font-bold text-(--color-text)/50 uppercase mb-1 block">Número</label>
                <input type="text" class="ref-m-numero w-full bg-(--color-cardClara) border border-(--color-accent)/20 text-(--color-text) text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-(--color-secAzul)" placeholder="FA-1234">
            </div>
            <div>
                <label class="text-[10px] font-bold text-(--color-text)/50 uppercase mb-1 block">Stock</label>
                <input type="number" class="ref-m-stock w-full bg-(--color-cardClara) border border-(--color-accent)/20 text-(--color-text) text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-(--color-secAzul)" placeholder="15" min="0">
            </div>
            <div>
                <label class="text-[10px] font-bold text-(--color-text)/50 uppercase mb-1 block">Precio</label>
                <input type="number" class="ref-m-precio w-full bg-(--color-cardClara) border border-(--color-accent)/20 text-(--color-text) text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-(--color-secAzul)" placeholder="120.00" min="0" step="0.01">
            </div>
        </div>
    `;
    listaContainer.appendChild(div);
}

window.eliminarFilaRef = (id) => {
    const fila = document.getElementById(`fila-ref-${id}`);
    if (fila) fila.remove();
};

if (btnAbrirAgregar) {
    btnAbrirAgregar.addEventListener('click', () => {
        modoMuchas = false;
        formUna.classList.remove('hidden');
        formMuchas.classList.add('hidden');
        btnToggleMuchas.textContent = 'Agregar muchas';
        document.getElementById('modal-agregar-titulo').textContent = 'Agregar Refacción';
        // Limpiar formulario
        document.getElementById('ref-nombre').value = '';
        document.getElementById('ref-numero').value = '';
        document.getElementById('ref-stock').value = '';
        document.getElementById('ref-precio').value = '';
        listaContainer.innerHTML = '';
        contadorFilas = 0;
        modalAgregar.classList.remove('hidden');
    });
}

if (btnCerrarAgregar) {
    btnCerrarAgregar.addEventListener('click', () => {
        modalAgregar.classList.add('hidden');
    });
}

if (btnToggleMuchas) {
    btnToggleMuchas.addEventListener('click', () => {
        modoMuchas = !modoMuchas;
        if (modoMuchas) {
            formUna.classList.add('hidden');
            formMuchas.classList.remove('hidden');
            btnToggleMuchas.textContent = 'Agregar una';
            document.getElementById('modal-agregar-titulo').textContent = 'Agregar Muchas Refacciones';
            if (listaContainer.children.length === 0) {
                crearFilaRefaccion();
                crearFilaRefaccion();
            }
        } else {
            formUna.classList.remove('hidden');
            formMuchas.classList.add('hidden');
            btnToggleMuchas.textContent = 'Agregar muchas';
            document.getElementById('modal-agregar-titulo').textContent = 'Agregar Refacción';
        }
    });
}

if (btnAgregarFila) {
    btnAgregarFila.addEventListener('click', () => crearFilaRefaccion());
}

if (btnGuardarRefaccion) {
    btnGuardarRefaccion.addEventListener('click', () => {
        if (!modoMuchas) {
            // --- PROCESO: UNA REFACCIÓN ---
            const refaccion = {
                nombre: document.getElementById('ref-nombre').value,
                numero: document.getElementById('ref-numero').value,
                stock: parseInt(document.getElementById('ref-stock').value) || 0,
                precioActual: parseFloat(document.getElementById('ref-precio').value) || 0
            };
            console.log('JSON para CREAR UNA refacción:', JSON.stringify(refaccion, null, 2));
            // TODO: Conectar con tu endpoint para UNA refacción
            // Ejemplo: await crearRefaccion(refaccion);
            alert('Refacción creada (ver consola para el JSON)');
            modalAgregar.classList.add('hidden');
        } else {
            // --- PROCESO: MUCHAS REFACCIONES ---
            const filas = listaContainer.querySelectorAll('[id^="fila-ref-"]');
            const listaRefacciones = [];
            filas.forEach(fila => {
                listaRefacciones.push({
                    nombre: fila.querySelector('.ref-m-nombre').value,
                    numero: fila.querySelector('.ref-m-numero').value,
                    stock: parseInt(fila.querySelector('.ref-m-stock').value) || 0,
                    precioActual: parseFloat(fila.querySelector('.ref-m-precio').value) || 0
                });
            });
            console.log('JSON para CREAR MUCHAS refacciones:', JSON.stringify(listaRefacciones, null, 2));
            // TODO: Conectar con tu endpoint para MUCHAS refacciones
            // Ejemplo: await crearMuchasRefacciones(listaRefacciones);
            alert(`${listaRefacciones.length} refacciones creadas (ver consola para el JSON)`);
            modalAgregar.classList.add('hidden');
        }
    });
}

// ======= MODAL: EDITAR REFACCIÓN =======
const modalEditar = document.getElementById('modal-editar-refaccion');
const btnCerrarEditar = document.getElementById('btn-cerrar-editar-refaccion');
const selectCambiosStock = document.getElementById('edit-ref-cambios-stock');
const stockCambioContainer = document.getElementById('edit-stock-cambio-container');
const infoContextual = document.getElementById('edit-info-contextual');
const btnGuardarEditar = document.getElementById('btn-guardar-editar-refaccion');

// Mostrar/ocultar campo de cantidad según el select
if (selectCambiosStock) {
    selectCambiosStock.addEventListener('change', () => {
        const valor = selectCambiosStock.value;
        if (valor === 'NINGUNO') {
            stockCambioContainer.classList.add('hidden');
            infoContextual.innerHTML = '<p class="text-xs text-(--color-text)/60 font-medium"><strong>Modo Ninguno:</strong> Solo se actualizarán el nombre y precio. Las cantidades de stock no cambiarán.</p>';
        } else if (valor === 'AUMENTAR') {
            stockCambioContainer.classList.remove('hidden');
            infoContextual.innerHTML = '<p class="text-xs text-green-700 font-medium"><strong>Modo Aumentar:</strong> Se sumará la cantidad indicada al stock actual. También se actualizarán nombre y precio.</p>';
        } else if (valor === 'DISMINUIR') {
            stockCambioContainer.classList.remove('hidden');
            infoContextual.innerHTML = '<p class="text-xs text-amber-700 font-medium"><strong>Modo Disminuir:</strong> Se restará la cantidad indicada del stock actual. También se actualizarán nombre y precio.</p>';
        }
    });
}

// Abrir modal de editar (llamado desde la tabla)
window.editarRefaccion = (id) => {
    const ref = refaccionesData.find(r => r.id_refaccion === id);
    if (!ref) return;

    document.getElementById('edit-ref-numero').value = ref.numero;
    document.getElementById('edit-ref-nombre').value = ref.nombre;
    document.getElementById('edit-ref-precio').value = ref.precioActual;
    selectCambiosStock.value = 'NINGUNO';
    stockCambioContainer.classList.add('hidden');
    document.getElementById('edit-ref-stock-cambio').value = '';
    infoContextual.innerHTML = '<p class="text-xs text-(--color-text)/60 font-medium"><strong>Modo Ninguno:</strong> Solo se actualizarán el nombre y precio. Las cantidades de stock no cambiarán.</p>';

    modalEditar.classList.remove('hidden');
};

if (btnCerrarEditar) {
    btnCerrarEditar.addEventListener('click', () => {
        modalEditar.classList.add('hidden');
    });
}

if (btnGuardarEditar) {
    btnGuardarEditar.addEventListener('click', () => {
        const json = {
            numero: document.getElementById('edit-ref-numero').value,
            nombreNuevo: document.getElementById('edit-ref-nombre').value,
            stockCambio: parseInt(document.getElementById('edit-ref-stock-cambio').value) || 0,
            precioNuevo: parseFloat(document.getElementById('edit-ref-precio').value) || 0,
            cambiosStock: selectCambiosStock.value
        };
        console.log('JSON para EDITAR refacción:', JSON.stringify(json, null, 2));
        // TODO: Conectar con tu endpoint para editar
        // Ejemplo: await editarRefaccionEndpoint(json);
        alert('Refacción editada (ver consola para el JSON)');
        modalEditar.classList.add('hidden');
    });
}

// Event listeners de refacciones
const inputBuscar = document.getElementById('input-buscar-refaccion');
const btnBuscar = document.getElementById('btn-buscar-refaccion');
const btnOrdenar = document.getElementById('btn-ordenar-refaccion');

if (btnBuscar && inputBuscar) {
    btnBuscar.addEventListener('click', () => {
        busquedaActualRefacciones = inputBuscar.value;
        renderTablaRefacciones();
    });
    inputBuscar.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            busquedaActualRefacciones = inputBuscar.value;
            renderTablaRefacciones();
        }
    });
}

if (btnOrdenar) {
    btnOrdenar.addEventListener('click', () => {
        if (ordenActualRefacciones === 'desc') {
            ordenActualRefacciones = 'asc';
            btnOrdenar.textContent = 'Ordenar: Stock (Menor a Mayor)';
        } else {
            ordenActualRefacciones = 'desc';
            btnOrdenar.textContent = 'Ordenar: Stock (Mayor a Menor)';
        }
        renderTablaRefacciones();
    });
}

// Render inicial de refacciones
renderTablaRefacciones();