import * as React from 'react'
import styled from 'styled-components';
import { Button, Form, FormGroup, Input } from 'reactstrap';
import axios from '../api/Axios';

import fondo_pantalla from '../imagenes/fondo_pantalla.png';

const REGISTER_URL = '/registerUser'

class Registro extends React.Component {

    constructor(props) {
        super(props);

        this.handleRegister = this.handleRegister.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleRegister = async (event) => {
        // Aclaración: Si hay un setCustomValidity(msg) cuyo msg != "", no sigue ejecutandose la función
        // hasta que se cambie por ""

        event.preventDefault();

        const userName = document.getElementById("userName");
        const email = document.getElementById("email");
        const password = document.getElementById("password");
        const confirmPassword = document.getElementById("confirmPassword");
        var msg = "";

        password.value !== confirmPassword.value ? msg = "Las contraseñas deben coincidir" : msg = "";
        password.setCustomValidity(msg);

        try {
            const response = await axios.post(REGISTER_URL, 
                JSON.stringify({userName, email, password}),
                {
                    headers : { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
        } catch (error) { }
    }

    render() {
        return(
            <BackGroundImage>
                <FormContainer>
                    <Form onSubmit={this.handleRegister}>
                        <FormGroup>
                            <Input type="text" id="userName" placeholder="Nombre usuario" required />
                        </FormGroup>
                        <FormGroup>
                            <Input type="email" id="email" placeholder="Email" required/>
                        </FormGroup>
                        <FormGroup>
                            <Input type="password" id="password" placeholder="Contraseña" required/>
                        </FormGroup>
                        <FormGroup>
                            <Input type="password" id="confirmPassword" placeholder="Confirmar contraseña" required/>
                        </FormGroup>
                        <Button className="btn btn-info btn-lg">Registrarse</Button>
                    </Form>
                    <LoginTxt>¿Ya tienes cuenta?</LoginTxt>
                    <Button className="btn btn-outline-info btn-sm" href="/">Iniciar sesion</Button>
                </FormContainer>
            </BackGroundImage>
        );
    }
};

const BackGroundImage = styled.div`
    background-image: url(${fondo_pantalla});
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
`;

const Logo = styled.h1`
    min-height: 100vh;
    min-widht: 100vh;

    color: red;
    text-align: center;
    front-size: 200%;
`;

const FormContainer = styled.div`
    min-height: 100vh;
    min-widht: 100vh;

    display: flex;
    justify-content: center;
    align-items:center;
    flex-direction: column;
    text-align: center;
`

const LoginTxt = styled.h6`
    margin-top: 30px;
    background-color: white;
    color: red;
`

export default Registro;
