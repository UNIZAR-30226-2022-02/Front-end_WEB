import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import { Button} from 'reactstrap';

import fondo_pantalla from '../../images/background_image.png';

class GameConfig extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <BackGroundImage>
                <MainContainer>
                    <h2>HOLA</h2>
                    <Button className="btn btn-danger btn-lg" href="/game">COMENZAR PARTIDA</Button>
                </MainContainer>
            </BackGroundImage>
        );
    }
}

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
`;

export default GameConfig;
