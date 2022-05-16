import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import { Button, Input } from 'reactstrap';
import { Circles } from 'react-loader-spinner'

import { AlertLoading } from '../Alert'

import fondo_pantalla from '../../images/background_image.png';

export default function GameConfig() {
    const navigate = useNavigate();

    const [numPlayers, setNumPlayers] = React.useState(2)
    const [buscandoPartida, setBuscandoPartida] = React.useState(false)
    const [partidaEncontrada, setPartidaEncontrada] = React.useState(false)

    const handleBuscarPartida = async (e) => {
        e.target.disabled = true
        setBuscandoPartida(true)
        e.target.innerHTML = 'Buscando partida...'

        AlertLoading('Partida encontrada. Redirigiendo a sala...', 2000)
        setTimeout(() => {
            navigate('/game')
        }, 2000);
    }

    return (
        <BackGroundImage>
            <MainContainer>
                {partidaEncontrada ? (
                    <HomeContainer>
                        
                    </HomeContainer>
                ) : (
                    <HomeContainer>
                        <h2>Nueva partida</h2>
                        <h6 style={{ marginTop:"5%" }}>Número de jugadores</h6>
                        <Input type="select" onChange={(e) => setNumPlayers(e.target.value)}>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4 </option>
                            <option value={5}>5</option>
                        </Input>
                        <StyledButton className="btn btn-danger btn-lg" onClick={handleBuscarPartida}>Buscar partida</StyledButton>
                        {/*buscandoPartida ? (<Circles ariaLabel="loading-indicator" />) : (null)*/}
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
