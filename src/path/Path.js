import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Inicio from '../Inicio'
import Registro from '../registro/Registro'
import Pagina_Principal from '../pantallas_juego/Pagina_Principal'
import Pantalla_Carga from '../pantallas_juego/Pantalla_Carga'

function Path(){

    return (
        <BrowserRouter>
            <Route exact path="/" component={Inicio} />
            <Route exact path="/registro" component={Registro} />
            <Route exact path="/pagina_principal" component={Pagina_Principal} />
            <Route exact path="/pantalla_carga" component={Pantalla_Carga} />
        </BrowserRouter>
    )
}

export default Path
