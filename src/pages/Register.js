import * as React from 'react'
import styled from 'styled-components';
import { Button, Form, FormGroup, Input } from 'reactstrap';
import axios from '../api/Axios';
import Swal from 'sweetalert2'
import validator from 'validator'
import { withRouter } from 'react-router';

import fondo_pantalla from '../images/background_image.png';
import logo_risk from '../images/logo_risk.png'

const REGISTER_URL = '/registerUser'

class Register extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        }

        this.handleRegister = this.handleRegister.bind(this);
    }

    mostrarAlerta (msgTitle, msgText, exito) {
        if (exito === true) {
            Swal.fire({
                title: msgTitle,
                text: msgText,
                icon: "success",
                button: "Aceptar",
            });
        } else {
            Swal.fire({
                title: msgTitle,
                text: msgText,
                icon: "error",
                button: "Aceptar",
            });
        }
    }

    handleRegister = async (event) => {
        event.preventDefault();

        const username = this.state.username;
        const email = this.state.email;
        const password = this.state.password;
        const confirmPassword = this.state.confirmPassword;

        if (username === "" || email === "" || password === "") {
            this.mostrarAlerta("Error al registrarse", "Complete todos los campos", false);
            return;
        }

        if (!validator.isEmail(email)) {
            this.mostrarAlerta("Error al registrarse", "Introduzca una dirección de email válida", false);
            return;
        }

        if (password !== confirmPassword) {
            this.mostrarAlerta("Error al registrarse", "Las constraseñas no coinciden", false);
            return;
        }

        this.mostrarAlerta("Usuario registrado con éxito", "", true);

            const response = await axios.post(REGISTER_URL, 
                JSON.stringify({username, email, password}),
                {
                    headers : { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            // Como recibir respuesta??
            console.log(JSON.stringify(response?.data));
    }

    render() {
        return(
            <BackGroundImage>
                <MainContainer>
                    <Logo src={logo_risk}/>
                    <FormContainer>
                        <h2>Registrarse</h2>
                        <Form onSubmit={this.handleRegister}>
                            <FormGroup>
                                <Input type="text" placeholder="Nombre usuario" onChange={(e) => this.setState({username: e.target.value})}/>
                            </FormGroup>
                            <FormGroup>
                                <Input type="text" placeholder="Email" onChange={(e) => this.setState({email: e.target.value})}/>
                            </FormGroup>
                            <FormGroup>
                                <Input type="password" placeholder="Contraseña" onChange={(e) => this.setState({password: e.target.value})}/>
                            </FormGroup>
                            <FormGroup>
                                <Input type="password" placeholder="Confirmar contraseña" onChange={(e) => this.setState({confirmPassword: e.target.value})}/>
                            </FormGroup>
                            <Button className="btn btn-info btn-lg">Registrarse</Button>
                        </Form>
                        <LoginTxt>¿Ya tienes cuenta?</LoginTxt>
                        <Button className="btn btn-secondary btn-sm" href="/">Iniciar sesion</Button>
                    </FormContainer>
                </MainContainer>
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

export default Register;
