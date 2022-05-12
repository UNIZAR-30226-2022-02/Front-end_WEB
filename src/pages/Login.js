import React, { useContext } from 'react';
import styled from 'styled-components';
import { Button, Form, FormGroup, Input } from 'reactstrap';
import Swal from 'sweetalert2'

import { withRouter } from '../root/With_Router'
import UserContext from '../context/UserProvider'
import axios from 'axios'

import fondo_pantalla from '../images/background_image.png';
import logo_risk from '../images/logo_risk.png'

const LOGIN_URL = '/login'

export default function Login() {

  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = async() => {

    if (username === "" || password === "") {
      alert("Error al iniciar sesión", "Complete todos los campos", false);
      return;
    }

    const data = qs.stringify({
      username: username,
      password: password,
    })

    axios({
      method: 'post',
      url: SERVER_URL + LOGIN_URL,
      data: data,
    }).then(res => {
      console.log(res.data)



    }).catch(error => {
      console.log(error)
      alert("El usuario no ha podido ser logueado")
    });

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

export default withRouter(Login);
