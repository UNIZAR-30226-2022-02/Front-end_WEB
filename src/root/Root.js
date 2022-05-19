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

export default function Root() {

    return (
        <BrowserRouter>
            <Container>
                <Routes>
                        <Route path="/" element={<AuthRoute> <Login/> </AuthRoute>} />
                        <Route path="/register" element={<AuthRoute> <Register/> </AuthRoute>} />
                        <Route path="/home" element={<AuthRoute> <Header/> <Home/> </AuthRoute>} />
                        <Route path="/gameConfig" element={<AuthRoute> <Header/> <GameConfig/> </AuthRoute>} />
                        <Route path="/game" element={<AuthRoute> <Game/> </AuthRoute>} />
                        <Route path="/tienda" element={<AuthRoute> <Header/> <Tienda/> </AuthRoute>} />
                </Routes>
            </Container>
        </BrowserRouter>
    )
}
