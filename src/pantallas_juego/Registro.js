import * as React from 'react'
import styled from 'styled-components';
import { Button, Container, Form, FormGroup, Input } from 'reactstrap';

import API from '../api/Api'
import fondo_pantalla from '../imagenes/fondo_pantalla.png';

class Registro extends React.Component {

    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
    }

    handleRegister(event) {
        event.preventDefault();
        const userName = event.target[0].value;
        const email = event.target[1].value;
        const password = event.target[2].value;
        const confirmPassword = event.target[3].value;

        if (password !== confirmPassword) {
            password.setCustomValidity("Las contraseñas no coinciden");
        }

        try {
            API.get(`register?username=${userName}?email=${email}?passwd=${password}`)
            .then(response => {
                console.log(response.data)
            });

        } catch (err) {
            console.log(err);                                                                                                                                                                                                                                                                                                                                                                                          
        }
    }

    render() {
        return(
            <BackGroundImage>
                <FormContainer>
                    <Form onSubmit={this.handleRegister}>
                        <FormGroup>
                            <Input type="text" id="userName" placeholder="Nombre usuario" required/>
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
