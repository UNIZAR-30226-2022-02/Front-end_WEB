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
    constructor (userId = '', idPartida = '') {
        super('finTurno', userId, idPartida)
    }
}

class JugadaPonerTropas extends Jugada
{
    constructor(userId = '', idPartida = '', idTerritorio = '', numTropas = 0) {
        super('ponerTropas', userId, idPartida)
        this.idTerritorio = idTerritorio
        this.numTropas = numTropas
    }
}

class JugadaMoverTropas extends Jugada
{
    constructor(userId = '', idPartida = '', idTerritorioOrigen = '', idTerritorioDestino = '', numTropas = 0) {
        super('moverTropas', userId, idPartida)
        this.idTerritorioOrigen = idTerritorioOrigen
        this.idTerritorioDestino = idTerritorioDestino
        this.numTropas = numTropas
    }
}

//Asigno tropas dependiendo del numero de cartas usadas por el jugador
class JugadaUtilizarCartas extends Jugada
{
    constructor(userId = '', idPartida = '', cartas = []) {
        super('utilizar_cartas', userId, idPartida)
        this.cartas = cartas     
    }
}

class JugadaAtaqueSincrono extends Jugada
{
    constructor (userId = '', idPartida = '', territorioAtacante = '', territorioAtacado = '', resultadoDadosAtaque = []) {
        super('ataqueSincrono', userId, idPartida)
        this.territorioAtacante = territorioAtacante
        this.territorioAtacado = territorioAtacado
        this.resultadoDadosAtaque = resultadoDadosAtaque
    }
}

class JugadaDefensaSincrona extends Jugada
{
    constructor (userId = '', idPartida = '', territorioAtacante = '', territorioAtacado = '', resultadoDadosDefensa = []) {
        super('defensa_sincrona', userId, idPartida)
        this.territorioAtacante = territorioAtacante
        this.territorioAtacado = territorioAtacado
        this.resultadoDadosDefensa = resultadoDadosDefensa
    }
}

class JugadaAtaqueAsincrono extends Jugada
{    
    constructor (userId = '', idPartida = '', territorioAtacante = '', territorioAtacado = '', resultadoDadosAtaque= [], resultadoDadosDefensa = []) {
        super('ataqueAsincrono', userId, idPartida)
        this.territorioAtacante = territorioAtacante
        this.territorioAtacado = territorioAtacado
        this.resultadoDadosAtaque = resultadoDadosAtaque
        this.resultadoDadosDefensa = resultadoDadosDefensa
    }
}

//Si el jugador  ha conquistado  le doy una carta
class JugadaPedirCarta extends Jugada
{
    constructor (userId = '', idPartida = '', cartaRecibida = 0) {
        super('pedir_carta', userId, idPartida)
        this.cartaRecibida = cartaRecibida
    }
}

class JugadaFinPartida extends Jugada
{
    constructor (userId = '', idPartida = '', players = []) {
        super('finPartida', userId, idPartida)
        this.players = players
    }
}

export { Jugada, JugadaFinTurno, JugadaPonerTropas, 
        JugadaMoverTropas, JugadaUtilizarCartas, JugadaAtaqueSincrono, 
        JugadaDefensaSincrona, JugadaAtaqueAsincrono, JugadaPedirCarta, 
        JugadaFinPartida }
