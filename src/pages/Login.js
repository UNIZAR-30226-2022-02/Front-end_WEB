import * as React from 'react';
import styled from 'styled-components';
import { Button, Form, FormGroup, Input } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

import { UseAuth } from '../context/Auth';
import axios from '../api/Axios'
import fondo_pantalla from '../images/background_image.png';
import logo_risk from '../images/logo_risk.png'

class Login extends React.Component{

  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(event) {
    event.preventDefault();

    const userName = event.target[0].value;
    const password = event.target[1].value;
    // document.getElementById("errLogin").innerHTML = "";
/*
    const { login } = UseAuth();
    login()
*/
    this.history.push('/home');
  }

  render() {
    /*
    const { logout } = UseAuth();
    // Retirar token para iniciar sesion cada vez inicie app
    logout()*/
    return (
      <BackGroundImage>
        <MainContainer>
          <Logo src={logo_risk}/>
          <FormContainer>
            <Form onSubmit={this.handleLogin}>
              <FormGroup>
              <MsgErr id="errLogin"></MsgErr>
                <Input type="text" placeholder="Nombre usuario" required/>
              </FormGroup>
              <FormGroup>
                <Input type="password" placeholder="Contraseña" required/>
              </FormGroup>
              <Button className="btn btn-info btn-lg">Iniciar sesión</Button>
            </Form>
            <RegisterTxt>¿No tienes cuenta?</RegisterTxt>
            <Button className="btn btn-secondary btn-sm" href="/home">Registrarse</Button>
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

  text-align: center;
`

const Logo = styled.img`
  margin-top: 3%;
`;

const FormContainer = styled.div`
  margin-top: 3%;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items:center;
  flex-direction: column;
`

const RegisterTxt = styled.h6`
  margin-top: 20px;
  background-color: white;
  color: red;
`

const MsgErr = styled.span`
  background-color: black;
  color: red;
`

export default Login;
