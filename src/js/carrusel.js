//Función para el carrusel de imagenes.
export function carruselImagenes(btns, cards) {
    //Recorremos los botones
    btns.forEach(btn => {
        //Ahora cuando se haga click movemos ya sea de derecha a izquierda.
        btn.addEventListener('click', () => {
            const data = btn.dataset.btncard;
            let cardData = "";
            console.log(data);
            // Ahora recorreremos el bucle de las tarjetas para saber cual es por el que se cambiara.
            cards.forEach(card => {
                //Si la card no tiene la clase hidden se le agrega y se guarda el valor
                if (!card.classList.contains("hidden")) {
                    card.classList.add('hidden');
                    cardData = card.dataset.card;
                }
            });
            //Seleccionamos la opción
            let numero = parseInt(cardData);
            switch (data) {
                //Avanzar
                case "btnDer":
                    if (numero === 3) {
                        numero = 1;
                    } else {
                        numero++;
                    }
                    break;
                //Regresar.
                case "btnIzq":
                    if (numero == 1) {
                        numero = 3;
                    } else {
                        numero--;
                    }
                    break;
            }
            //Ahora que salimos del bucle toca activar la otra sección ya sea adelante o atras.
            const cardAct = document.querySelector(`[data-card="${numero}"]`);
            cardAct.classList.toggle('hidden');
            console.log(`estas en la posición: ${numero}`)
        });
    });
}