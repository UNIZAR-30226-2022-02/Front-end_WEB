import * as React from 'react';
import styled from 'styled-components';
import { Button, Form, FormGroup, Input } from 'reactstrap';
import Swal from 'sweetalert2'
import { withRouter } from 'react-router';

import { UseAuth } from '../context/Auth';
import axios from '../api/Axios'
import fondo_pantalla from '../images/background_image.png';
import logo_risk from '../images/logo_risk.png'

const REGISTER_URL = '/login'
const https = require('https');


class Login extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
    }

    this.handleLogin = this.handleLogin.bind(this);
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

  handleLogin = (event) => {
    event.preventDefault();

    const username = this.state.username;
    const password = this.state.password;

    if (username === "" || password === "") {
      this.mostrarAlerta("Error al iniciar sesión", "Complete todos los campos", false);
      return;
    }

var options = {
  hostname: 'https://serverrisk.herokuapp.com/',
  port: 37794,
  path: REGISTER_URL,
  method: 'POST'
};

var req = https.post(options, (res) => {
  console.log('statusCode:', res.statusCode);
  res.on('data', (d) => {
    process.stdout.write(d);
    if(d === "OK"){
      //Pantalla menu principal
    }
    else{
      this.mostrarAlerta("Error al iniciar sesión", "Usuario o contraseña incorrectos");
    }
      
  });
});


 
  }
  //jesus
  //jesus
  

  render() {
    return (
      <BackGroundImage>
        <MainContainer>
          <Logo src={logo_risk}/>
          <FormContainer>
            <h2>Iniciar Sesión</h2>
            <Form onSubmit={this.handleLogin}>
              <FormGroup>
                <Input type="text" placeholder="Nombre usuario" onChange={(e) => this.setState({username: e.target.value})}/>
              </FormGroup>
              <FormGroup>
                <Input type="password" placeholder="Contraseña" onChange={(e) => this.setState({password: e.target.value})}/>
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
