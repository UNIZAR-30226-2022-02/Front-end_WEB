import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { Circles } from 'react-loader-spinner'
import axios from 'axios';

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
    constructor(userId = '', gameId = '',tipoJugada='crearPartida', players = [], partidaSincrona = false) {
        super(userId, gameId)
        this.players = players
        this.partidaSincrona = partidaSincrona
    }
}

class JugadaFinTurno extends Jugada
{
    constructor (userId = '', gameId = '',tipoJugada='JugadaFinTurno') {
        super(userId, gameId)
    }
}

class JugadaPonerTropas extends Jugada
{
    constructor(userId = '', gameId = '',tipoJugada='ponerTropas', country = '', numTropas = 0) {
        super(userId, gameId)
        this.country = country
        this.numTropas = numTropas
    }
}

class JugadaMoverTropas extends Jugada
{
    constructor(userId = '', gameId = '', countryOrigin = '', countryDest = '', numTropas = 0) {
        super(userId, gameId)
        this.countryOrigin = countryOrigin
        this.countryDest = countryDest
        this.numTropas = numTropas
    }
}

//Asigno tropas dependiendo del numero de cartas usadas por el jugador
class JugadaUtilizarCartas extends Jugada
{
    constructor(userId = '', gameId = '', cartas = []) {
        super(userId, gameId)
        this.cartas = cartas     
    }
}

class JugadaAtaqueSincrono extends Jugada
{
    constructor (userId = '', gameId = '', countryOrigin = '', countryDest = '', dadosAtaque = []) {
        super(userId, gameId)
        this.countryOrigin = countryOrigin
        this.countryDest = countryDest
        this.dadosAtaque = dadosAtaque
    }
}

class JugadaDefensaSincrona extends Jugada
{
    constructor (userId = '', gameId = '', countryOrigin = '', countryDest = '', dadosDefensa = []) {
        super(userId, gameId)
        this.countryOrigin = countryOrigin
        this.countryDest = countryDest
        this.dadosDefensa = dadosDefensa
    }
}

class JugadaAtaqueAsincrono extends Jugada
{    
    constructor (userId = '', gameId = '', countryOrigin = '', countryDest = '', dadosAtaque= []) {
        super(userId, gameId)
        this.countryOrigin = countryOrigin
        this.countryDest = countryDest
        this.dadosAtaque = dadosAtaque
    }
}

//Si el jugador  ha conquistado  le doy una carta
class JugadaPedirCarta extends Jugada
{
    constructor (userId = '', gameId = '', cartaRecibida = 0) {
        super(userId, gameId)
        this.cartaRecibida = cartaRecibida
    }
}

class JugadaFinPartida extends Jugada
{
    constructor (userId = '', gameId = '', players = []) {
        super(userId, gameId)
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
