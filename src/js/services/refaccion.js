// const URLRef = "http://localhost:8080";
const URLRef = "https://tallermecanico-cn4o.onrender.com/repair";



export async function traerRefacciones() {
    const respuesta = await fetch(`${URLRef}/list`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!respuesta.ok) {
        throw new Error(`Error al buscar refacciones: ${respuesta.status}`)
    }
    return await respuesta.json();
}