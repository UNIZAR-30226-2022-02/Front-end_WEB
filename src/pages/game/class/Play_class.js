class Jugada
{
    constructor (type = '', userId = '', idPartida = '') {
        this.userId = userId
        this.idPartida = idPartida
        this.type = type
    }
}

//En el login preguntas si tienes alguna partida ya
//Estas cargando hasta que te llega una jugada
class JugadaCrearPartida extends Jugada
{
    constructor(userId = '', gameId = '', players = [], partidaSincrona = false) {
        super('crear_partida', userId, gameId)
        this.players = players
        this.partidaSincrona = partidaSincrona
    }
}

class JugadaFinTurno extends Jugada
{
    constructor (userId = '', gameId = '') {
        super('fin_turno', userId, gameId)
    }
}

class JugadaPonerTropas extends Jugada
{
    constructor(userId = '', gameId = '', country = '', numTropas = 0) {
        super('poner_tropas', userId, gameId)
        this.country = country
        this.numTropas = numTropas
    }
}

class JugadaMoverTropas extends Jugada
{
    constructor(userId = '', gameId = '', countryOrigin = '', countryDest = '', numTropas = 0) {
        super('mover_tropas', userId, gameId)
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
        super('ataque_sincrono', userId, gameId)
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
    constructor (userId = '', gameId = '', countryOrigin = '', countryDest = '', dadosAtaque= []) {
        super('ataque_asincrono', userId, gameId)
        this.countryOrigin = countryOrigin
        this.countryDest = countryDest
        this.dadosAtaque = dadosAtaque
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
        super('fin_partida', userId, gameId)
        this.players = players
    }
}

class FinTurno extends Jugada
{/*
    FinTurno(player){
        turnoActual=turnoActual/length(jugadores);
        player.haConquistado=false;
    }
    //gestionar si acaba el que va antes porque me toca*/
}

export { Jugada, JugadaCrearPartida, JugadaFinTurno, JugadaPonerTropas, 
        JugadaMoverTropas, JugadaUtilizarCartas, JugadaAtaqueSincrono, 
        JugadaDefensaSincrona, JugadaAtaqueAsincrono, JugadaPedirCarta, 
        JugadaFinPartida, FinTurno }
