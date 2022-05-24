import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Container } from "semantic-ui-react";

import AuthRoute from '../util/AuthRoute'

import Header from '../pages/Header'
import Login from '../pages/Login'
import Home from '../pages/Home'
import Register from '../pages/Register'
import GameConfig from '../pages/game/Game_Config'
import Game from '../pages/game/Game'
import Tienda from '../pages/Tienda'

export default class Root extends React.Component{

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <BrowserRouter>
                <Header />
                <div>
                        <Route path="/" exact component={Login} />
                        <Route path="/register" exact component={Register} />
                        <Route path="/home" exact component={Home} />
                        <Route path="/gameConfig" exact component={GameConfig} />
                        <Route path="/game" exact component={Game} />
                        <Route path="/tienda" exact component={Tienda} />
                </div>
            </BrowserRouter>
        )
    }
}
