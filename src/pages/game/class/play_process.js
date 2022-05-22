class Partida {
    jugadores
    territorios
    partidaSincrona
    faseInicial
    nVecesCartasUsadas
    turnoActual
    
    // Jugadores eliminados, gestion partida
    nJugadoresEliminados
    jugadoresEliminados

    procesarJugada(j){
        switch(j){
            case j.GetType() == new JugadaFinTurno().GetType():
                crearPartida((JugadaCrearPartida) j);
                break;
            case j.GetType() == new JugadaFinTurno().GetType():
                finTurno((JugadaFinTurno) j);
                break;
            case j.GetType() == new JugadaPonerTropas().GetType():
                ponerTropas((JugadaPonerTropas) j);
                break;
            case j.GetType() == new JugadaMoverTropas().GetType():
                moverTropas((JugadaMoverTropas) j);
                break;
            case j.GetType() == new JugadaUtilizarCartas().GetType():
                finTurno((JugadaUtilizarCartas) j);
                break;
            case j.GetType() == new JugadaAtaqueSincrono().GetType():
                finTurno((JugadaAtaqueSincrono) j);
                break;
            case j.GetType() == new JugadaDefensaSincrona().GetType():
                finTurno((JugadaDefensaSincrona) j);
                break;
            case j.GetType() == new JugadaAtaqueAsincrono().GetType():
                finTurno((JugadaAtaqueAsincrono) j);
                break;
            case j.GetType() == new JugadaPedirCarta().GetType():
                finTurno((JugadaPedirCarta) j);
                break;
            case j.GetType() == new JugadaFinPartida().GetType():
                finTurno((JugadaFinPartida) j);
                break;
        }
    }
}