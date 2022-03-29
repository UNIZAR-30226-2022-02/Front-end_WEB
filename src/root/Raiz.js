import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import Login from '../pantallas_juego/Login'
import Inicio from '../pantallas_juego/Inicio'
import Registro from '../pantallas_juego/Registro'

function Raiz() {
    return (
        <BrowserRouter>
            <Route exact path="/" component={Login} />
            <Route exact path="/registro" component={Registro} />
            <Route exact path="/pantalla_inicio" component={Inicio} />
        </BrowserRouter>
    )
}

export default Raiz
