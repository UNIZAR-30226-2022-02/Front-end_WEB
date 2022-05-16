import React from 'react';
import styled from 'styled-components';
import { Button, Form, FormGroup, Input } from 'reactstrap';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import qs from 'qs'

import { useAuth } from '../context/UserProvider'
import { AlertInfo } from './Alert'
import { SERVER_URL } from '../api/URLS'
import { LOGIN_URL } from '../api/URLS'

import fondo_pantalla from '../images/background_image.png';
import logo_risk from '../images/logo_risk.png'

export default function Login() {

  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = async(e) => {
    e.target.disabled = true

    if (username === "" || password === "") {
      AlertInfo("Error al iniciar sesion", "Complete todos los campos", true);
      e.target.disabled = false
      return;
    }

    const res = await axios({
      method: 'post',
      url: SERVER_URL + LOGIN_URL,
      data: qs.stringify({ 
        username: username,
        password: password,
      })
    })

    if (res.data === "OK") {
      login(username, "token_invalido")
      navigate('/home')
    } else if (res.data === "Usuario o contraseña incorrecta") {
      AlertInfo("Error al iniciar sesion", "Usuario o contraseña incorrectos", true)
      e.target.disabled = false
    } else {
      AlertInfo("Servidores en mantenimiento", "Disculpe las molestias", true)
      e.target.disabled = false
    }
  }

  return (
    <BackGroundImage>
      <MainContainer>
        <Logo src={logo_risk}/>
        <LoginContainer>
          <h2>Iniciar Sesión</h2>
          <FormGroup>
            <Input type="text" placeholder="Nombre usuario" onChange={(e) => setUsername(e.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)}/>
          </FormGroup>
          <Button className="btn btn-info btn-lg" onClick={handleLogin}>Iniciar sesión</Button>
          <RegisterTxt>¿No tienes cuenta?</RegisterTxt>
          <Button className="btn btn-secondary btn-sm" href="/register">Registrarse</Button>
        </LoginContainer>
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

const LoginContainer = styled.div`
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
  color: red;
`;
