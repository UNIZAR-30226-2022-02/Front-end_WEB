import * as React from 'react'
import styled from 'styled-components';
import { Button, Container, Form, FormGroup, Input } from 'reactstrap';

import fondo_pantalla from '../imagenes/fondo_pantalla.jpeg';

class Registro extends React.Component {

    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
    }

    handleRegister(event) {
        event.preventDefault();
        const email = event.target[0].value;
        const password = event.target[1].value;
        alert(email + "; " + password)
    }

    render() {
        return(
            <BackGroundImage>
                <FormContainer>
                    <Form onSubmit={this.handleLogin}>
                        <FormGroup>
                            <Input type="text" name="name" placeholder="Nombre usuario" required/>
                        </FormGroup>
                        <FormGroup>
                            <Input type="email" name="name" placeholder="Email" required/>
                        </FormGroup>
                        <FormGroup>
                            <Input type="password" name="password" placeholder="Contraseña" required/>
                        </FormGroup>
                        <FormGroup>
                            <Input type="password" name="password" placeholder="Confirmar contraseña" required/>
                        </FormGroup>
                        <ButtonRegister className="btn btn-info btn-lg">Registrarse</ButtonRegister>
                    </Form>
                    <LoginTxt>¿Ya tienes cuenta?</LoginTxt>
                    <ButtonRegister className="btn btn-outline-info btn-sm" href="/">Iniciar sesion</ButtonRegister>
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

const ButtonRegister = styled(Button)`
    margin-top: 10px;
`;

export default Registro;
