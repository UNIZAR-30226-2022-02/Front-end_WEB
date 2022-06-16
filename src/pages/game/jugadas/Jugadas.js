class Jugada
{
    constructor (type = '', userId = '', idPartida = '') {
        this.userId = userId
        this.idPartida = idPartida
        this.type = type
    }
}

class JugadaFinTurno extends Jugada
{
    constructor (userId = '', gameId = '') {
        super('finTurno', userId, gameId)
    }
}

class JugadaPonerTropas extends Jugada
{
    constructor(userId = '', gameId = '', country = '', numTropas = 0) {
        super('ponerTropas', userId, gameId)
        this.country = country
        this.numTropas = numTropas
    }
}

class JugadaMoverTropas extends Jugada
{
    constructor(userId = '', gameId = '', countryOrigin = '', countryDest = '', numTropas = 0) {
        super('moverTropas', userId, gameId)
        this.countryOrigin = countryOrigin
        this.countryDest = countryDest
        this.numTropas = numTropas
    }
}

//Asigno tropas dependiendo del numero de cartas usadas por el jugador
class JugadaUtilizarCartas extends Jugada
{
    constructor(userId = '', gameId = '', cartas = []) {
        super('utilizar_cartas', userId, gameId)
        this.cartas = cartas     
    }
}

class JugadaAtaqueSincrono extends Jugada
{
    constructor (userId = '', gameId = '', countryOrigin = '', countryDest = '', dadosAtaque = []) {
        super('ataqueSincrono', userId, gameId)
        this.countryOrigin = countryOrigin
        this.countryDest = countryDest
        this.dadosAtaque = dadosAtaque
    }
}

class JugadaDefensaSincrona extends Jugada
{
    constructor (userId = '', gameId = '', countryOrigin = '', countryDest = '', dadosDefensa = []) {
        super('defensa_sincrona', userId, gameId)
        this.countryOrigin = countryOrigin
        this.countryDest = countryDest
        this.dadosDefensa = dadosDefensa
    }
}

class JugadaAtaqueAsincrono extends Jugada
{    
    constructor (userId = '', gameId = '', countryOrigin = '', countryDest = '', dadosAtaque= [], dadosDefensa = []) {
        super('ataqueAsincrono', userId, gameId)
        this.countryOrigin = countryOrigin
        this.countryDest = countryDest
        this.dadosAtaque = dadosAtaque
        this.dadosDefensa = dadosDefensa
    }
}

//Si el jugador  ha conquistado  le doy una carta
class JugadaPedirCarta extends Jugada
{
    constructor (userId = '', gameId = '', cartaRecibida = 0) {
        super('pedir_carta', userId, gameId)
        this.cartaRecibida = cartaRecibida
    }
}

class JugadaFinPartida extends Jugada
{
    constructor (userId = '', gameId = '', players = []) {
        super('finPartida', userId, gameId)
        this.players = players
    }
}

export { Jugada, JugadaFinTurno, JugadaPonerTropas, 
        JugadaMoverTropas, JugadaUtilizarCartas, JugadaAtaqueSincrono, 
        JugadaDefensaSincrona, JugadaAtaqueAsincrono, JugadaPedirCarta, 
        JugadaFinPartida }
