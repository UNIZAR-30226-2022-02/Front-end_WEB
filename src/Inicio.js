import * as React from 'react';
import { Link } from 'react-router-dom';
import logo_risk from './imagenes/logo_risk.png';

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
    <div style={{textAlign: "center"}} className="Inicio">

      <div>
        <img style={{marginTop: "20px", width:"50%", height:"35%"}} alt="Remy Sharp" className="Logo_Risk" src={logo_risk}></img>
      </div>

      <div style={{marginLeft: "25%", width: "50%", marginTop: "30px"}} class="form-floating mb-3">
        <input type="text" class="form-control" id="floatingInput" placeholder="Nombre Usario"
          value={nombre} onChange={handleNombre}></input>
        <label for="floatingInput">Nombre usuario</label>
      </div>

      <div style={{marginLeft: "25%", width: "50%", marginTop: "30px"}} class="form-floating mb-3">
        <input type="password" class="form-control" id="floatingPassword" placeholder="Contraseña"
          value={password} onChange={handlePassword}></input>
        <label for="floatingPassword">Password</label>
      </div>

      <br></br>

      <Link to="/pantalla_inicio"> <button onClick={handleLogin} type="button" class="btn btn-outline-primary btn-lg">Inicar sesión</button></Link>
      <Link to="/registro"><button type="button" class="btn btn-outline-info btn-lg">Regístrate</button></Link>

    </div>
  );
}

export default Inicio;
