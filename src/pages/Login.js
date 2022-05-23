import React from 'react';
import styled from 'styled-components';
import { Button, Form, FormGroup, Input } from 'reactstrap';
import axios from 'axios';
import qs from 'qs'

import { login, logout } from '../context/UserProvider'
import { AlertInfo } from '../util/MyAlerts'
import { SERVER_URL } from '../api/URLS'
import { LOGIN_URL } from '../api/URLS'

import fondo_pantalla from '../images/background_image.png';
import logo_risk from '../images/logo_risk.png'

//import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "https://serverrisk.herokuapp.com";


export default class Login extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }

    this.handleLogin = this.handleLogin.bind(this)
  }

  handleLogin = async(e) => {
    e.preventDefault()
    e.target.disabled = true

    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", data => {
       // setResponse(data);
      });
      //recibir mensajes socket.on y enviar socket.emit
      //socket.to(nombre_rooom).emit(mensaje)

    const { username, password } = this.state

    if (username === '' || password === '') {
      AlertInfo('Error al iniciar sesion', 'Complete todos los campos', true);
      e.target.disabled = false
      return;
    }
    /*
    const res = await axios({
      method: 'post',
      url: SERVER_URL + LOGIN_URL,
      data: qs.stringify({ 
        username: username,
        password: password,
      })
    })
    */
    const res = null
    // ! BORRAR ESTO
    login(username, 'token_valido')
    this.props.history.push('/home')
/*
    if (res.data === 'OK') {
      login(username, 'token_valido')
      this.props.history.push('/home')
    } else if (res.data === 'Usuario o contraseña incorrecta') {
      AlertInfo('Error al iniciar sesion', 'Usuario o contraseña incorrectos', true)
      e.target.disabled = false
    } else {
      AlertInfo('Servidores en mantenimiento', 'Disculpe las molestias', true)
      e.target.disabled = false
    }
*/
  }

  render() {
    return (
      <BackGroundImage>
        <MainContainer>
          <Logo src={logo_risk}/>
          <LoginContainer>
            <h2>Iniciar Sesión</h2>
            <FormGroup>
              <Input type='text' placeholder='Nombre usuario' onChange={(e) => this.setState({ username: e.target.value })}/>
            </FormGroup>
            <FormGroup>
              <Input type='password' placeholder='Contraseña' onChange={(e) => this.setState({ password: e.target.value })}/>
            </FormGroup>
            <Button className='btn btn-info btn-lg' onClick={this.handleLogin}>Iniciar sesión</Button>
            <RegisterTxt>¿No tienes cuenta?</RegisterTxt>
            <Button className='btn btn-secondary btn-sm' href='/register'>Registrarse</Button>
          </LoginContainer>
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
  height: 100vh;
  widht: 100vh;
`;

const MainContainer = styled.div`
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