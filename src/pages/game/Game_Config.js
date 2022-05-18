import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { Circles } from 'react-loader-spinner'

import { AlertInfo } from '../../util/MyAlerts'
import { AlertLoading } from '../../util/MyAlerts'

import fondo_pantalla from '../../images/background_image.png';

export default function GameConfig() {
    const navigate = useNavigate();

    const [numPlayers, setNumPlayers] = React.useState(2)
    const [gameType, setGameType] = React.useState('')
    const [buscandoPartida, setBuscandoPartida] = React.useState(false)
    const [partidaEncontrada, setPartidaEncontrada] = React.useState(false)
    const [initPlayers, setInitPlayers] = React.useState([])

    const handleBuscarPartida = async (e) => {
        if (gameType === '') {
            AlertInfo('Error iniciar partida', 'Seleccione el tipo de partida', true)
            return
        }

        e.target.disabled = true
        setBuscandoPartida(true)
        e.target.innerHTML = 'Buscando partida...'

        AlertLoading('Partida encontrada. Redirigiendo a sala...', 2000)
        setTimeout(() => {
            setInitPlayers(initPlayers.push('Javi0'))
            setInitPlayers(initPlayers.push('Javi1'))
            navigate('/game', { state: { initPlayers: initPlayers }})
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
                        <h6 style={{ marginTop:'12%' }}>Número de jugadores</h6>
                        <FormGroup>
                            <Input type='select' onChange={(e) => setNumPlayers(e.target.value)}>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4 </option>
                                <option value={5}>5</option>
                            </Input>
                        </FormGroup>
                        <FormGroup check>
                            <Label><Input type='radio' name='gameType' onClick={(e) => setGameType('sinc')}/>Sincrona</Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label><Input type='radio' name='gameType' onClick={(e) => setGameType('asinc')}/>Asincrona</Label>
                        </FormGroup>
                        <Button className='btn btn-danger btn-lg' onClick={handleBuscarPartida}>Buscar partida</Button>
                        {/*buscandoPartida ? (<Circles ariaLabel='loading-indicator' />) : (null)*/}
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
