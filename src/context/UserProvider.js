import socketIOClient from "socket.io-client"; // Version 1.4.5

const ENDPOINT = "http://serverrisk.herokuapp.com"

export function getUsername () {
    return localStorage.getItem('username')
}

export function getToken () {
    return localStorage.getItem('token')
}

export function login (username, token) {
    localStorage.setItem('username', username)
    localStorage.setItem('token', token)
}

export function logout () {
    localStorage.removeItem('username')
    localStorage.removeItem('token')
}

export function getSocket () {
    return localStorage.getItem('socket')
}

export function newSocket () {
    // Registro en el servidor
    var socket = socketIOClient(ENDPOINT)
    socket.emit("registro", {username: getUsername()})

    localStorage.setItem('socket', socket)
}
