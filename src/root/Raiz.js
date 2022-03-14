import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Inicio from '../Inicio'
import Registro from '../registro/Registro'
import Pantalla_Inicio from '../pantallas_juego/Pantalla_Inicio'
import Mapa from '../pantallas_juego/mapa/Mapa'

function Raiz(){

    return (
        <BrowserRouter>
            <Route exact path="/" component={Inicio} />
            <Route exact path="/registro" component={Registro} />
            <Route exact path="/pantalla_inicio" component={Pantalla_Inicio} />
            <Route exact path="/mapa" component={Mapa} />
        </BrowserRouter>
    )
}

export default Raiz
