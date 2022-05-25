import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { Circles } from 'react-loader-spinner'
import axios from 'axios';
import qs from 'qs'

import { AlertInfo } from '../../util/MyAlerts'
import { AlertLoading } from '../../util/MyAlerts'
import { SERVER_URL, NEW_GAME_URL } from '../../api/URLS'
import { getUsername } from '../../context/UserProvider'

import fondo_pantalla from '../../images/background_image.png';

export default class GameConfig extends React.Component {

    constructor (props) {
        super(props)

        this.state = {
            numPlayers: 2,
            publica: null,
            sinc: null,
            code: '',
        }

        this.handleBuscarPartida = this.handleBuscarPartida.bind(this)
    }

    handleBuscarPartida = async (e) => {

        if (this.state.publica === null || this.state.sinc === null) {
            AlertInfo('Error iniciar partida', 'Seleccione el tipo de partida', true)
            return
        }

        e.target.disabled = true
        this.setState({ buscandoPartida: true })
        e.target.innerHTML = 'Buscando partida...'

        const { publica, numPlayers, sinc } = this.state
        const res = await axios({
            method: 'post',
            url: SERVER_URL + NEW_GAME_URL,
            data: qs.stringify({ 
                publica: publica,
                nombre: getUsername(),
                numJugadores: numPlayers,
                tipo: sinc
            })
        })

        this.props.history.push('/game')
    }

    handleUnirsePartida = async (e) => {
        if (this.state.code === '') {
            AlertInfo('Error unirse partida', 'Introduzca codigo valido', true)
            return
        }

        const { publica, numPlayers, sinc } = this.state

        e.target.disabled = true
        e.target.innerHTML = 'Uniendose a partida...'

        const res = await axios({
            method: 'post',
            url: SERVER_URL + NEW_GAME_URL,
            data: qs.stringify({ 
                publica: publica,
                nombre: getUsername(),
                numJugadores: numPlayers,
                tipo: sinc
            })
        })
    }

    render() {
        return (
            <BackGroundImage>
                <MainContainer>
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
                            <Label><Input type='radio' name='sin' onClick={(e) => this.setState({ sinc: true })}/>Sincrona</Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label><Input type='radio' name='sin' onClick={(e) => this.setState({ sinc: false })}/>Asincrona</Label>
                        </FormGroup>
                        <hr></hr>
                        <FormGroup check>
                            <Label><Input type='radio' name='public' onClick={(e) => this.setState({ publica: true })}/>Publica</Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label><Input type='radio' name='public' onClick={(e) => this.setState({ publica: false })}/>Privada</Label>
                        </FormGroup>
                        <Button className='btn btn-danger btn-lg' onClick={this.handleBuscarPartida}>Buscar partida</Button>
                        <hr></hr>
                        <FormGroup>
                            <Input type='text' placeholder='Tengo un codigo' onChange={(e) => this.setState({ code: e.target.value })}/>
                        </FormGroup>
                        <Button className='btn btn-secondary btn-sm' onClick={this.handleUnirsePartida}>Unirme a partida</Button>

                    </HomeContainer>
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
    height: 100vh;
    widht: 100vh;

    justify-content: center;
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
`
