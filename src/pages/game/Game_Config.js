import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import axios from 'axios';
import qs from 'qs'

import { AlertInfo, AlertLoading } from '../../util/MyAlerts'
import { SERVER_URL, NEW_GAME_URL, JOIN_GAME_URL } from '../../api/URLS'
import { getUsername } from '../../context/UserProvider'

import socketIOClient from "socket.io-client"; // Version 1.4.5

import fondo_pantalla from '../../images/background_image.png';

const ENDPOINT = "http://serverrisk.herokuapp.com"

export default class GameConfig extends React.Component {

    constructor (props) {
        super(props)

        this.state = {
            numPlayers: 2,
            sincronizacion: null,
            privacidad: null,
            code: '',
        }

        this.handleCrearPartida = this.handleCrearPartida.bind(this)
        this.handleUnirsePartida = this.handleUnirsePartida.bind(this)
    }

    handleCrearPartida = async (e) => {
        e.preventDefault()
        const { numPlayers, sincronizacion, privacidad } = this.state

        if (sincronizacion === null || privacidad === null) {
            AlertInfo('Error crear partida', 'Seleccione el tipo de partida', true)
            return
        }

        e.target.disabled = true
        e.target.innerHTML = 'Crear partida...'

        const res = await axios({
            method: 'post',
            url: SERVER_URL + NEW_GAME_URL,
            data: qs.stringify({
                username: getUsername(),
                publica: privacidad,
                tipo: sincronizacion,
                maxJugadores: numPlayers,
            })
        })

        console.log(res.data)

        if (res.data.respuesta === 'OK') {
            this.props.history.push('/game', { codigo: res.data.codigo })
        } else {
            AlertInfo('Error crear partida', '', true)
        }
    }

    handleUnirsePartida = async (e) => {
        e.preventDefault()
        const { privacidad, code } = this.state

        e.target.disabled = true
        e.target.innerHTML = 'Uniendose a partida...'

        const res = await axios({
            method: 'post',
            url: SERVER_URL + JOIN_GAME_URL,
            data: qs.stringify({
                username: getUsername(),
                tipoPartida: privacidad,
                codigo: code,
            })
        })

        console.log(res.data)

        if (res.data.respuesta === 'OK') {
            this.props.history.push('/game', { codigo: res.data.codigo })
        } else {
            AlertInfo('Error crear partida', '', true)
        }
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
                            <Label><Input type='radio' name='sin' onClick={(e) => this.setState({ sincronizacion: 'Sincrona' })}/>Sincrona</Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label><Input type='radio' name='sin' onClick={(e) => this.setState({ sincronizacion: 'Asincrona' })}/>Asincrona</Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label><Input type='radio' name='public' onClick={(e) => this.setState({ privacidad: 'Publica' })}/>Publica</Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label><Input type='radio' name='public' onClick={(e) => this.setState({ privacidad: 'Privada' })}/>Privada</Label>
                        </FormGroup>
                        <Button className='btn btn-danger btn-lg' onClick={this.handleCrearPartida}>Crear partida</Button>
                        <hr></hr>
                        <FormGroup>
                            <Input type='select' onChange={(e) => this.setState({ numPlayers: e.target.value })}>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4 </option>
                                <option value={5}>5</option>
                            </Input>
                        </FormGroup>
                        <Button className='btn btn-primary' onClick={this.handleUnirsePartida}>Buscar partida publica</Button>
                        <hr></hr>
                        <FormGroup>
                            <Input type='text' placeholder='Codigo' onChange={(e) => this.setState({ code: e.target.value })}/>
                        </FormGroup>
                        <Button className='btn btn-primary' onClick={this.handleUnirsePartida}>Unirme a partida</Button>
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
