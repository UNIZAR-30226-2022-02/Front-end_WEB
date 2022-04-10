import * as React from 'react';
import styled from 'styled-components';
import { Button, Form, FormGroup, Input } from 'reactstrap';

import axios from '../api/Axios'
import fondo_pantalla from '../imagenes/fondo_pantalla.png';
import logo_risk from '../imagenes/logo_risk.png'

class Login extends React.Component{

  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("userName");
    const password = document.getElementById("password");
    document.getElementById("errPwd").innerHTML = ""

    this.props.history.push("/inicio")
  }

  render() {
    return (
      <BackGroundImage>
        <MainContainer>
          <Logo src={logo_risk}/>
          <FormContainer>
            <Form onSubmit={this.handleLogin}>
              <FormGroup>
              <MsgErr id="errLogin"></MsgErr>
                <Input type="text" id="userName" placeholder="Nombre usuario" required/>
              </FormGroup>
              <FormGroup>
                <Input type="password" id="password" placeholder="Contraseña" required/>
              </FormGroup>
              <Button className="btn btn-info btn-lg">Iniciar sesión</Button>
            </Form>
            <RegisterTxt>¿No tienes cuenta?</RegisterTxt>
            <Button className="btn btn-secondary btn-sm" href="/registro">Registrarse</Button>
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
