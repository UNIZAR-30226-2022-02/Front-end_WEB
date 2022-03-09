import mapa from './imagenes/mapa_risk.svg'
import './styles/Mapa.css'

function Mapa() {
    return (
        <div className="Mapa">
            <body>
                <img src={mapa} className="Mapa-img" />
            </body>
        </div>
    );
}

export default Mapa;
