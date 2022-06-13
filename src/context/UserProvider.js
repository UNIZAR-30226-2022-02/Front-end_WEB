import Cola_Jugada from '../pages/game/jugadas/Cola_Jugadas'
import socketIOClient from "socket.io-client"; // Version 1.4.5

const ENDPOINT = "http://serverrisk.herokuapp.com"

const socket = socketIOClient(ENDPOINT)
socket.emit("registro", {username: getUsername()})

socket.on ("nueva_jugada", recibirJugada)

function recibirJugada(jugada) {
    var lista = JSON.parse(localStorage.getItem('jugada', jugada))
    lista.push(jugada)
    localStorage.setItem('jugadas', JSON.stringify(lista))
}

export function leerJugada() {
    var lista = JSON.parse(localStorage.getItem('jugada', jugada))

    // shift lee y elimina el primer elemento
    ret = this.colaJugadas.shift()
    localStorage.setItem('jugadas', JSON.stringify(lista))
}

export function getUsername () {
    return localStorage.getItem('username')
}

export function login (username) {
    localStorage.setItem('username', username)
    localStorage.setItem('jugadas', JSON.stringify([]))
}

export function logout () {
    localStorage.removeItem('username')
}
