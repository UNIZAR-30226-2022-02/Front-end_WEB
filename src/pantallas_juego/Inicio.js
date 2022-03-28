import * as React from 'react';
import { Link } from 'react-router-dom';

class Pantalla_Inicio extends React.Component {

    render() {
        return (
            <div className="Pantalla_Inicio">

                <Link to="/mapa"> <button style={{marginLeft: "40%"}} type="button" class="btn btn-outline-primary btn-lg">Prueba Mapa</button></Link>

            </div>
        );
    }
}

export default Pantalla_Inicio;
