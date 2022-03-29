import * as React from 'react';
import styled from 'styled-components';
import { Button, Container, Form, FormGroup, Input } from 'reactstrap';

import fondo_pantalla from '../imagenes/fondo_pantalla.jpeg';
import logo_risk from '../imagenes/logo_risk.jpeg'

class Inicio extends React.Component{

  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(event) {
    event.preventDefault();
    const email = event.target[0].value;
    const password = event.target[1].value;
  }

  render() {
    return (
      <BackGroundImage>
        <MainContainer>
          <Logo src={logo_risk} />
          <Form onSubmit={this.handleLogin}>
            <FormGroup>
              <Input type="email" name="name" placeholder="Email" />
            </FormGroup>
            <FormGroup>
              <Input type="password" name="password" placeholder="Password" />
            </FormGroup>
            <ButtonLogin className="btn btn-info btn-lg">Iniciar sesión</ButtonLogin>
          </Form>
          <ButtonRegister className="btn btn-outline-info" href="/registro">Regístrarse</ButtonRegister>
        </MainContainer>
      </BackGroundImage>
    );
  }
};

const BackGroundImage = styled.div`
  background-image: url(${fondo_pantalla});
  height: 100%;
  width: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const MainContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const Logo = styled.img``;

const ButtonLogin = styled(Button)`
  margin-top: 10px;
`;

const ButtonRegister = styled(Button)`
  margin-top: 10px;
`;

export default Inicio;
