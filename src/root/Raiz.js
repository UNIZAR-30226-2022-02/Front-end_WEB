import React, { useContext } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { UserProvider } from '../context/User_Context'

import Header from '../components/Header'
import Login from '../pages/Login'
import Home from '../pages/Home'
import Register from '../pages/Register'
import GameConfig from '../pages/game/GameConfig'
import Game from '../pages/game/Game'

function Raiz() {
    const user = { username: null, password: null, token: null }
    return (
        <UserProvider value={user}>
            <BrowserRouter>
                <Header />
                <Routes>
                        <Route path="/" element={<Login/>} />
                        <Route path="/home" element={<Home/>} />
                        <Route path="/register" element={<Register/>} />
                        <Route path="/gameConfig" element={<GameConfig/>} />
                        <Route path="/game" element={<Game/>} />
                    </Routes>
            </BrowserRouter>
        </UserProvider>
    )
}

export default Raiz;
