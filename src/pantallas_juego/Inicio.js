import * as React from 'react';
import styled from 'styled-components';
import { Button} from 'reactstrap';

import fondo_pantalla from '../imagenes/fondo_pantalla.png';

class Inicio extends React.Component {

    render() {
        return(
            <BackGroundImage>
                <MainContainer>
                    <ButtonJugar className="btn btn-danger btn-lg">PARTIDA PUBLICA</ButtonJugar>
                    <br></br>
                    <ButtonJugar className="btn btn-danger btn-lg">PARTIDA PRIVADA</ButtonJugar>
                    <br></br> <br></br>
                    <Button>TIENDA</Button>
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

const MainContainer = styled.div`
    min-height: 100vh;
    min-widht: 100vh;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
`

const ButtonJugar = styled.button`
    background-color: red;
    color: white;
    border-width: 1px;
    border-style: solid;
    border-color: white;
`

const ButtonTienda = styled.button`

`

export default Inicio;
