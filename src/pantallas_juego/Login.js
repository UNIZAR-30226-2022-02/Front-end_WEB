import * as React from 'react';
import styled from 'styled-components';
import { Button, Container, Form, FormGroup, Input } from 'reactstrap';

import fondo_pantalla from '../imagenes/fondo_pantalla.jpeg';

class Inicio extends React.Component{

  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(event) {
    event.preventDefault();
    const email = event.target[0].value;
    const password = event.target[1].value;
    alert(email + "; " + password)
  }

  render() {
    return (
      <BackGroundImage>
        <FormContainer>
          <Form onSubmit={this.handleLogin}>
            <FormGroup>
              <Input type="email" name="name" placeholder="Email" required/>
            </FormGroup>
            <FormGroup>
              <Input type="password" name="password" placeholder="Password" required/>
            </FormGroup>
            <ButtonLogin className="btn btn-info btn-lg">Iniciar sesión</ButtonLogin>
          </Form>
          <ButtonRegister className="btn btn-outline-info" href="/registro">Regístrarse</ButtonRegister>
        </FormContainer>
      </BackGroundImage>
    );
  }
};        

//         <Logo>RISK</Logo>

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

const ButtonLogin = styled(Button)`
  margin-top: 10px;
`;

const ButtonRegister = styled(Button)`
  margin-top: 10px;
`;

export default Inicio;
