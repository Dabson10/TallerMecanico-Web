import '../main.js'

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

// ------------------------------------------------------------------
// Preparación para llamadas a APIs (Lógica Base)
// ------------------------------------------------------------------

export async function obtenerDatosVehiculo() {
    try {
        // const respuesta = await fetch('/api/cliente/vehiculo');
        // const datos = await respuesta.json();
        console.log("Obteniendo datos del vehículo...");
    } catch (error) {
        console.error("Error al obtener datos del vehículo:", error);
    }
}

export async function obtenerHistorialOrdenes() {
    try {
        // const respuesta = await fetch('/api/cliente/ordenes');
        // const datos = await respuesta.json();
        console.log("Obteniendo historial de órdenes...");
    } catch (error) {
        console.error("Error al obtener historial de órdenes:", error);
    }
}

export async function obtenerDatosPerfil() {
    try {
        // const respuesta = await fetch('/api/cliente/perfil');
        // const datos = await respuesta.json();
        console.log("Obteniendo datos del perfil...");
    } catch (error) {
        console.error("Error al obtener datos del perfil:", error);
    }
}

// Inicializamos la simulación
obtenerDatosVehiculo();
obtenerHistorialOrdenes();
obtenerDatosPerfil();
