import socketIOClient from "socket.io-client"; // Version 1.4.5
import { getUsername } from '../../../context/UserProvider'

export default class Cola_Jugadas {

    constructor () {
        this.colaJugadas = []
    }

    recibirJugada (jugada) {
        console.log(this.colaJugadas)
        this.colaJugadas.push(jugada)
    }

    leerJugada () {
        // shift lee y elimina el primer elemento
        return this.colaJugadas.shift()
    }

    hayJugadas() {
        return this.colaJugadas.length !== 0
    }
}
