import * as React from 'react';
import styled from 'styled-components';
import { Button, Container, Form, FormGroup, Input } from 'reactstrap';

import imagen_fondo from '../imagenes/fondo_pantalla.jpeg';

class Inicio extends React.Component{

  handleLogin(event) {
    
  }

  render() {
    return (
      <BackGroundImage>
        <MainContainer>
          <Logo />
          <Form onSubmit={this.handleLogin}>
            <FormGroup>
              <Input type="email" name="name" placeholder="Email"/>
            </FormGroup>
            <FormGroup>
              <Input type="password" name="password" placeholder="Password"/>
            </FormGroup>
            <ButtonLogin>Iniciar sesión</ButtonLogin>
          </Form>
          <ButtonRegister href="/registro"></ButtonRegister>
        </MainContainer>
      </BackGroundImage>
    );
  }
};

const BackGroundImage = styled.div`
  background-image: url(${imagen_fondo});
  height: 100%
  width: 100%;
  background-position: center;
  background-size: cover;
`;

const MainContainer = styled(Container)`
  align-items: center;
  text-align: center;
  
`;

const Logo = styled.div`

`;

const ButtonLogin = styled(Button)`

`;

const ButtonRegister = styled(Button)`

`;

export default Inicio;
