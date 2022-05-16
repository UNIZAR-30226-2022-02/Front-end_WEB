import * as React from 'react'
import styled from 'styled-components';
import { Button, Form, FormGroup, Input } from 'reactstrap';
import { useNavigate } from "react-router-dom";
import validator from 'validator'
import axios from 'axios';
import qs from 'qs'

import { useAuth } from '../context/UserProvider'
import { AlertInfo } from './Alert'
import { SERVER_URL } from '../api/URLS'
import { REGISTER_URL } from '../api/URLS'

import fondo_pantalla from '../images/background_image.png';
import logo_risk from '../images/logo_risk.png'

export default function Register() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    const handleRegister = async (e) => {
        e.target.disabled = true

        if (username === "" || email === "" || password === "") {
            AlertInfo("Error al registrarse", "Complete todos los campos", true);
            e.target.disabled = false
            return;
        }

        if (!validator.isEmail(email)) {
            AlertInfo("Error al registrarse", "Introduzca una dirección de email válida", true);
            e.target.disabled = false
            return;
        }

        if (password !== confirmPassword) {
            AlertInfo("Error al registrarse", "Las constraseñas no coinciden", true);
            e.target.disabled = false
            return;
        }

        const res = await axios({
            method: 'post',
            url: SERVER_URL + REGISTER_URL,
            data: qs.stringify({
                username: username,
                email: email,
                password: password,
            })
        })

        if (res.data === "Usuario registrado.") {
            login(username, "token_invalido")
            navigate('/home')
        } else if (res.data === "Ya existe este usuario.") {
            AlertInfo("Error al registrarse", "El nombre de usuario ya esta en uso", true)
            e.target.disabled = false
        } else {
            AlertInfo("Servidores en mantenimiento", "Disculpe las molestias", true)
            e.target.disabled = false
        }
    }

    return(
        <BackGroundImage>
            <MainContainer>
                <Logo src={logo_risk}/>
                <FormContainer>
                    <h2>Registrarse</h2>
                    <Form onSubmit={handleRegister}>
                        <FormGroup>
                            <Input type="text" placeholder="Nombre usuario" onChange={(e) => setUsername(e.target.value)}/>
                        </FormGroup>
                        <FormGroup>
                            <Input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
                        </FormGroup>
                        <FormGroup>
                            <Input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)}/>
                        </FormGroup>
                        <FormGroup>
                            <Input type="password" placeholder="Confirmar contraseña" onChange={(e) => setConfirmPassword(e.target.value)}/>
                        </FormGroup>
                        <Button className="btn btn-info btn-lg">Registrarse</Button>
                    </Form>
                    <LoginTxt>¿Ya tienes cuenta?</LoginTxt>
                    <Button className="btn btn-secondary btn-sm" href="/">Iniciar sesion</Button>
                </FormContainer>
            </MainContainer>
        </BackGroundImage>
    );
};

const BackGroundImage = styled.div`
    background-image: url(${fondo_pantalla});
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
`;

const MainContainer = styled.div`
    min-height: 100vh;
    min-widht: 100vh;

    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`;

const FormContainer = styled.div`
    margin-top: 3%;
    background-color: white;
    width: 20%;
    padding: 25px;
    border-radius: 25px;
`;

const Logo = styled.img`
    margin-top: 3%;
`;

const LoginTxt = styled.h6`
    margin-top: 20px;
    background-color: white;
    color: red;
`;
