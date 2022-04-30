import * as React from 'react';
import styled from 'styled-components';
import { Button, Form, FormGroup, Input } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import validator from 'validator'

import { UseAuth } from '../context/Auth';
import axios from '../api/Axios'
import fondo_pantalla from '../images/background_image.png';
import logo_risk from '../images/logo_risk.png'

class Login extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      msgTitle: "",
      msgText: "",
      success: false,
    }

    this.handleLogin = this.handleLogin.bind(this);
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

  handleLogin(event) {
    event.preventDefault();

    const userName = event.target[0].value;
    const password = event.target[1].value;

    if (userName === "" || password === "") {
      this.setState({
          msgTitle: "Error al iniciar sesión",
          msgText: "Complete todos los campos",
          success: false,
      })
      this.mostrarAlerta();
      return;
    }

    this.setState({
      msgTitle: "Usuario logueado con éxito",
      msgText: "",
      success: true,
    })
    this.mostrarAlerta();

    this.props.history.push('/home');
  }

  render() {
    return (
      <BackGroundImage>
        <MainContainer>
          <Logo src={logo_risk}/>
          <FormContainer>
            <h2>Iniciar Sesión</h2>
            <Form onSubmit={this.handleLogin}>
              <FormGroup>
                <Input type="text" placeholder="Nombre usuario" />
              </FormGroup>
              <FormGroup>
                <Input type="password" placeholder="Contraseña" />
              </FormGroup>
              <Button className="btn btn-info btn-lg">Iniciar sesión</Button>
            </Form>
            <RegisterTxt>¿No tienes cuenta?</RegisterTxt>
            <Button className="btn btn-secondary btn-sm" href="/register">Registrarse</Button>
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

const RegisterTxt = styled.h6`
  margin-top: 20px;
  background-color: white;
  color: red;
`

export default Login;
