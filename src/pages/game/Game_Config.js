import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { Circles } from 'react-loader-spinner'

import { AlertInfo } from '../../util/MyAlerts'
import { AlertLoading } from '../../util/MyAlerts'

import fondo_pantalla from '../../images/background_image.png';

export default class GameConfig extends React.Component {

    constructor (props) {
        super(props)

        this.state = {
            numPlayers: 2,
            gameType: '',
            searching: false,
            gameFound: false,
            initPlayers: [],
        }

        this.handleBuscarPartida = this.handleBuscarPartida.bind(this)
    }

    handleBuscarPartida = async (e) => {
        const { gameType, initPlayers } = this.state
        if (gameType === '') {
            AlertInfo('Error iniciar partida', 'Seleccione el tipo de partida', true)
            return
        }

        e.target.disabled = true
        this.setState({ buscandoPartida: true })
        e.target.innerHTML = 'Buscando partida...'

        AlertLoading('Partida encontrada. Redirigiendo a sala...', 2000)
        setTimeout(() => {
            initPlayers.push('Javi0')
            initPlayers.push('Javi')
            this.props.history.push('/game', { state: { initPlayers: initPlayers }})
        }, 2000);
    }

    render() {
        const { gameFound } = this.state
        return (
            <BackGroundImage>
                <MainContainer>
                    {gameFound ? (
                        <HomeContainer>
                            
                        </HomeContainer>
                    ) : (
                        <HomeContainer>
                            <h2>Nueva partida</h2>
                            <h6 style={{ marginTop:'12%' }}>Número de jugadores</h6>
                            <FormGroup>
                                <Input type='select' onChange={(e) => this.setState({ numPlayers: e.target.value })}>
                                    <option value={2}>2</option>
                                    <option value={3}>3</option>
                                    <option value={4}>4 </option>
                                    <option value={5}>5</option>
                                </Input>
                            </FormGroup>
                            <FormGroup check>
                                <Label><Input type='radio' name='gameType' onClick={(e) => this.setState({ gameType: 'sinc' })}/>Sincrona</Label>
                            </FormGroup>
                            <FormGroup check>
                                <Label><Input type='radio' name='gameType' onClick={(e) => this.setState({ gameType: 'asinc' })}/>Asincrona</Label>
                            </FormGroup>
                            <Button className='btn btn-danger btn-lg' onClick={this.handleBuscarPartida}>Buscar partida</Button>
                            {/*buscandoPartida ? (<Circles ariaLabel='loading-indicator' />) : (null)*/}
                        </HomeContainer>
                    )}
                </MainContainer>
            </BackGroundImage>
        )
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
