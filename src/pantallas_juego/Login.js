import * as React from 'react';
import { Link } from 'react-router-dom';
import logo_risk from '../imagenes/logo_risk.png';

class Inicio extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      nombre: "",
      password: ""
    };

    this.handleNombre = this.handleNombre.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
  }


  handleNombre(event) {
    this.setState(
      {nombre: event.target.Value}
    )
  };

  handlePassword(event) {
    this.setState (
      {password: event.target.value}
    )
  };

  render() {
    return (
      <div style={{textAlign: "center"}} className="Inicio">

        <div>
          <img style={{marginTop: "20px", width:"50%", height:"35%"}} alt="Remy Sharp" className="Logo_Risk" src={logo_risk}></img>
        </div>

        <div style={{marginLeft: "25%", width: "50%", marginTop: "30px"}} class="form-floating mb-3">
          <input type="text" class="form-control" id="floatingInput" placeholder="Nombre Usuario"
            value={this.state.nombre} onChange={this.handleNombre}></input>
          <label for="floatingInput">Nombre usuario</label>
        </div>

        <div style={{marginLeft: "25%", width: "50%", marginTop: "30px"}} class="form-floating mb-3">
          <input type="password" class="form-control" id="floatingPassword" placeholder="Contraseña"
            value={this.state.password} onChange={this.handlePassword}></input>
          <label for="floatingPassword">Password</label>
        </div>

        <br></br>

        <button type="button" class="btn btn-outline-primary btn-lg">Inicar sesión</button>

        <Link to="/registro">
          <button type="button" class="btn btn-outline-info btn-lg">Regístrate</button>
        </Link>

      </div>
    );
  }
};

export default Inicio;
