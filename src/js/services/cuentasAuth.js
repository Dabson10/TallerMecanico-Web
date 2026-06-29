// const clienteURL = 'http://localhost:8080/client'
// const tecnicoURL = 'http://localhost:8080/tech'
const clienteURL = 'https://tallermecanico-cn4o.onrender.com/client'
const tecnicoURL = 'https://tallermecanico-cn4o.onrender.com/tech'
//Buscamos un cliente mediante su correo electronico
export async function traerCliente(correo) {
    const respuesta = await fetch(`${clienteURL}/${correo}/get`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    if (!respuesta.ok) { throw new Error(`Error al buscar un cliente. status: ${respuesta.status}`) }

    return await respuesta.json();
}

export async function traerTecnico(correo) {
    const respuesta = await fetch(`${tecnicoURL}/log?correo=${correo}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!respuesta.ok) { throw new Error(`Error al buscar un tecnico. status: ${respuesta.status}`) }
    return await respuesta.json();
}
