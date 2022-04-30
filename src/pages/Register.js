import * as React from 'react'
import styled from 'styled-components';
import { Button, Form, FormGroup, Input } from 'reactstrap';
import axios from '../api/Axios';
import Swal from 'sweetalert2'
import validator from 'validator'

import fondo_pantalla from '../images/background_image.png';
import logo_risk from '../images/logo_risk.png'

const REGISTER_URL = '/registerUser'

class Register extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            msgTitle: "",
            msgText: "",
            success: false,
        }

        this.handleRegister = this.handleRegister.bind(this);
    }

    mostrarAlerta () {
        const exito = this.state.success;
        if (exito === true) {
            Swal.fire({
                title: this.state.msgTitle,
                text: this.state.msgText,
                icon: "success",
                button: "Aceptar",
            });
        } else {
            Swal.fire({
                title: this.state.msgTitle,
                text: this.state.msgText,
                icon: "error",
                button: "Aceptar",
            });
        }
    }

    handleRegister = async (event) => {
        event.preventDefault();

        const userName = event.target[0].value;
        const email = event.target[1].value;
        const password = event.target[2].value;
        const confirmPassword = event.target[3].value;

        if (userName === "" || email === "" || password === "") {
            this.setState({
                msgTitle: "Error al registrarse",
                msgText: "Complete todos los campos",
                success: false,
            })
            this.mostrarAlerta();
            return;
        }

        if (!validator.isEmail(email)) {
            this.setState({
                msgTitle: "Error al registrarse",
                msgText: "Introduzca una dirección de email válida",
                success: false,
            })
            this.mostrarAlerta();
            return;
        }

        if (password !== confirmPassword) {
            this.setState({
                msgTitle: "Error al registrarse",
                msgText: "Las constraseñas no coinciden",
                success: false,
            })
            this.mostrarAlerta();
            return;
        }

        try {
            this.setState({
                msgTitle: "Usuario registrado con éxito",
                msgText: "",
                success: true,
            })
            this.mostrarAlerta();

            const response = await axios.post(REGISTER_URL, 
                JSON.stringify({userName, email, password}),
                {
                    headers : { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            // Como recibir respuesta??
            console.log(JSON.stringify(response?.data));
        } catch (error) { 

        }
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
                                <Input type="text" placeholder="Nombre usuario" />
                            </FormGroup>
                            <FormGroup>
                                <Input type="text" placeholder="Email" />
                            </FormGroup>
                            <FormGroup>
                                <Input type="password" placeholder="Contraseña" />
                            </FormGroup>
                            <FormGroup>
                                <Input type="password" placeholder="Confirmar contraseña" />
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
