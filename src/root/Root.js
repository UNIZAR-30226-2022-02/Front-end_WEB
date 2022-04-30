import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { AuthProvider } from '../context/Auth'

import Header from '../components/Header'
import Login from '../pages/Login'
import Home from '../pages/Home'
import Register from '../pages/Register'
import GameConfig from '../pages/game/GameConfig'
import Game from '../pages/game/Game'

function Raiz() {
    return (
        <BrowserRouter>
            <AuthProvider>
            <Routes>
                    <Route path="/" element={<Login/>} />
                    <Route path="/home" element={<Home/>} />
                    <Route path="/register" element={<Register/>} />
                    <Route path="/gameConfig" element={<GameConfig/>} />
                    <Route path="/game" element={<Game/>} />
                </Routes>
            </AuthProvider>
            <AuthProvider>

                <Header />

            </AuthProvider>
        </BrowserRouter>
    )
}

export default Raiz;
