import Cola_Jugada from '../pages/game/jugadas/Cola_Jugadas'

export function recibirJugada(jugada) {
    console.log("Meto jugada a la cola",this.colaJugadas)
    //var lista = JSON.parse(localStorage.getItem('jugada', jugada))
    var lista
    lista.push(jugada)
   // localStorage.setItem('jugadas', JSON.stringify(lista))
}

export function hayJugadas() {
    var lista = JSON.parse(localStorage.getItem('jugada'))
    console.log(lista.lenght)
    if (lista.lenght === 0) {
        return false
    } else {
        return true
    }
}

export function leerJugada() {
    var lista = JSON.parse(localStorage.getItem('jugada'))
    console.log(lista)
    // shift lee y elimina el primer elemento
    var ret = lista.shift()
    localStorage.setItem('jugadas', JSON.stringify(lista))
    return ret
}

export function getUsername () {
    return localStorage.getItem('username')
}

export function login (username) {
    localStorage.setItem('username', username)
    localStorage.setItem('jugada', JSON.stringify([]))
}

export function logout () {
    localStorage.removeItem('username')
}
