const URL = 'https://tallermecanico-cn4o.onrender.com/client'
//Buscamos un cliente mediante su correo electronico
export async function traerCliente(correo) {
    const respuesta = await fetch(`${URL}/${correo}/get`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    if (!respuesta.ok) { throw new Error(`Error al buscar un cliente. status: ${respuesta.status}`) }

    return await respuesta.json();
}