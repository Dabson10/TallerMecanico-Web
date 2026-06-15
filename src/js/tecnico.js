import '../main.js'

const vistas = {
    vehiculos: document.getElementById('view-vehicles'),
    ordenes: document.getElementById('view-orders'),
    perfil: document.getElementById('view-profile')
};

const navegacion = {
    vehiculos: document.getElementById('nav-vehicles'),
    ordenes: document.getElementById('nav-orders'),
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

if (navegacion.perfil) {
    navegacion.perfil.addEventListener('click', (e) => {
        e.preventDefault();
        cambiarVista('perfil');
    });
}

cambiarVista('vehiculos');

// ------------------------------------------------------------------
// Preparación para llamadas a APIs (Lógica Base)
// ------------------------------------------------------------------

export async function obtenerVehiculosAsignados() {
    try {
        // const respuesta = await fetch('/api/tecnico/vehiculos');
        // const datos = await respuesta.json();
        console.log("Obteniendo vehículos asignados al técnico...");
    } catch (error) {
        console.error("Error al obtener vehículos asignados:", error);
    }
}

export async function obtenerOrdenesServicio() {
    try {
        // const respuesta = await fetch('/api/tecnico/ordenes');
        // const datos = await respuesta.json();
        console.log("Obteniendo órdenes de servicio del técnico...");
    } catch (error) {
        console.error("Error al obtener órdenes de servicio:", error);
    }
}

export async function obtenerPerfilTecnico() {
    try {
        // const respuesta = await fetch('/api/tecnico/perfil');
        // const datos = await respuesta.json();
        console.log("Obteniendo datos del perfil del técnico...");
    } catch (error) {
        console.error("Error al obtener perfil del técnico:", error);
    }
}

// Inicializamos la simulación
obtenerVehiculosAsignados();
obtenerOrdenesServicio();
obtenerPerfilTecnico();
