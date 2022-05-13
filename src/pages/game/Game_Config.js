import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import { Button, Form, FormGroup, Input } from 'reactstrap';

import fondo_pantalla from '../../images/background_image.png';

export default function GameConfig() {

    const [numPlayers, setNumPlayers] = React.useState(2)
    const buscandoPartida = false
    const partidaEncontrada = false

    const handleBuscarPartida = async (e) => {
        buscandoPartida = true
        e.target.innerHTML = "Buscando partida..."
    }

    return(
        <BackGroundImage>
            <MainContainer>
                {partidaEncontrada ? (
                    <HomeContainer>
                        
                    </HomeContainer>
                ) : (
                    <HomeContainer>
                        <h2>Nueva partida</h2>
                        <h6 style={{ marginTop:"5%" }}>Número de jugadores</h6>
                        <Input type="select">
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4 </option>
                            <option value={5}>5</option>
                        </Input>
                        <StyledButton className="btn btn-danger btn-lg" onClick={handleBuscarPartida}>Buscar partida</StyledButton>
                        {buscandoPartida ? (null) : (null)}
                    </HomeContainer>
                )}
            </MainContainer>
        </BackGroundImage>
    )
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
    flex-direction: column;
    align-items: center;
    text-align: center;
`;

const HomeContainer = styled.div`
    margin-top: 15%;
    background-color: white;
    width: 20%;
    padding: 25px;
    border-radius: 25px;
`;

const StyledButton = styled(Button)`
    margin-top: 5%
`
