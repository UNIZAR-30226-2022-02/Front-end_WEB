import * as React from 'react';
import styled from 'styled-components';
import { Button, Form, FormGroup, Input } from 'reactstrap';

import API from '../api/Api'
import fondo_pantalla from '../imagenes/fondo_pantalla.png';
import logo_risk from '../imagenes/logo_risk.png'

class Login extends React.Component{

  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(event) {
    event.preventDefault();
    const email = event.target[0].value;
    const password = event.target[1].value;

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
                <Input type="text" id="userName" placeholder="Email" required/>
              </FormGroup>
              <FormGroup>
                <Input type="password" id="password" placeholder="Password" required/>
              </FormGroup>
              <Button className="btn btn-info btn-lg">Iniciar sesión</Button>
            </Form> <br></br>
            <Button className="btn btn-outline-info" href="/inicio">CAMBIAR HREF</Button>
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

const Logo = styled.img`
  margin-top: 30px;
`;

const MainContainer = styled.div`
  min-height: 100vh;
  min-widht: 100vh;

  text-align: center;
`

const FormContainer = styled.div`
  margin-top: 10%;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items:center;
  flex-direction: column;
`

export default Login;
