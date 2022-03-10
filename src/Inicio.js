import * as React from 'react';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import logo_risk from './imagenes/logo_risk.png';
import './styles/Inicio.css';

function Inicio() {

  const [nombre, setNombre] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleNombre = (newValue) => {
    setNombre(newValue.target.value);
  };

  const handlePassword = (newValue) => {
    setPassword(newValue.target.value);
  };

  const handleLogin = () => {

  };

  return (
    <div className="Inicio">

      <div className="Logo_Risk">
        <Avatar src={logo_risk}></Avatar>
      </div>

      <Form.Floating className="Nombre">
        <Form.Control
          id="Nombre"
          type="text"

        />
        <label htmlFor="floatingInput">Nombre usuario</label>
      </Form.Floating>

      <Form.Floating className="Password">
        <Form.Control
          id="Password"
          type="password"

        />
        <label htmlFor="floatingInput">Contraseña</label>
      </Form.Floating>

      <button type="button" classname="Button_Log_In" onClick={handleLogin}>Inicar sesión</button>
      <Link to="/registro"><button type="button" class="Button_Register" >Regístrate</button></Link>

    </div>
  );
}

export default Inicio;
