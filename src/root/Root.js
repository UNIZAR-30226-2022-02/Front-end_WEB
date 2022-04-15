import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { AuthProvider } from '../context/Auth'

import Header from '../components/Header'
import Login from '../pages/Login'
import Home from '../pages/Home'
import Register from '../pages/Register'

function Raiz() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Header />
                <Routes>
                    <Route path="/" element={<Login/>} />
                    <Route path="/home" element={<Home/>} />
                    <Route path="/registro" element={<Register/>} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default Raiz
