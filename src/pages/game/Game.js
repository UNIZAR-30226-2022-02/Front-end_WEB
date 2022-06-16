import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from "reactstrap";
import styled from "styled-components";
import Map from "./util/map/Map";
import Player from "./util/Player";
import TurnDecider from "./util/Turn_Decider";
import TroopsGiver from "./util/Troops_Giver";
import Deployer from "./util/Deployer";
import { Jugada, JugadaCrearPartida, JugadaFinTurno, JugadaPonerTropas, 
    JugadaMoverTropas, JugadaUtilizarCartas, JugadaAtaqueSincrono, 
    JugadaDefensaSincrona, JugadaAtaqueAsincrono, JugadaPedirCarta, 
    JugadaFinPartida, FinTurno } from './jugadas/Jugadas'

import socketIOClient from "socket.io-client"; // Version 1.4.5
import { useHistory } from 'react-router-dom';
import { AlertLoading } from "../../util/MyAlerts";
import { getUsername, hayJugadas, leerJugada } from '../../context/UserProvider'
import {socket} from '../../pages/game/Game_Config'
import PlayerTurnDecider from "./util/Turn_Decider";

const ENDPOINT = "http://serverrisk.herokuapp.com"
const colour = ['#0000FF', '#FF0000', '#009900', '#ffff00', '#000000']

export default class Game extends Component {
    constructor(props) {
        super(props);

        this.idPartida=''
        this.partidaSincrona = ''
        this.nVecesCartasUsadas = 0
       // codigo: this.props.location.state.codigo
        // Players
        this.myId = ''
        this.players = []
        this.numPlayers = 0

        this.playersEliminados = []
        this.nPlayersEliminados = 0

        // Variables temporales
        this.selectedCountryId = ''
        this.countryToAttackOrManeuverTo = ''

        this.initialSetupPhase = true
        this.turnsPhase = false
        this.attackOrSkipTurnPhase = false

        this.numOfAttackerTroops = 0
        this.numOfDefenderTroops = 0
        this.numOfTroopsToMove = 0
    }

    setidPartida(idPartida){
        this.idPartida=idPartida
    }

    componentDidMount() {
        document.addEventListener("dblclick", this.onDoubleClickListener);
        window.setInterval(this.actualizarMapa, 3000)
    }

    componentWillUnmount() {
        document.removeEventListener("dblclick", this.onDoubleClickListener);
    }

    actualizarMapa = (e) => {
        this.forceUpdate()
    }

    onDoubleClickListener = (e) => {
        const id = e.target.id;
        const isCountryValid = juego.countryIds.includes(id);

        if (!isCountryValid) {
            juego.selectedCountryId = ''
            juego.countryToAttackOrManeuverTo = ''
            juego.map.setSelectedCountry(id);
            this.forceUpdate()
            return
        }

        if (juego.myId === juego.turnDecider.getPlayerWithTurn().getId()) {

            // Allow initial deployment with double click
            if (juego.initialSetupPhase && isCountryValid) {
                juego.selectedCountryId = id
                juego.map.setSelectedCountry(id);
                juego.deployInitialTroops();
                this.forceUpdate();
                return;
            }

            // Allow turn troops deployment
            if (juego.turnsPhase && isCountryValid) {
                juego.selectedCountryId = id
                juego.map.setSelectedCountry(id);
                juego.deployTurnTroops();
                this.forceUpdate();
                return;
            }

            // Allow selecting another country, attacing and manevering
            if (juego.attackOrSkipTurnPhase && isCountryValid) {
                if (juego.selectedCountryId === '') {
                    juego.selectedCountryId = id
                } else {
                    juego.countryToAttackOrManeuverTo = id
                    const result = juego.map.validateInitialMove(
                    juego.selectedCountryId,
                    juego.countryToAttackOrManeuverTo,
                    juego.turnDecider.getCurrentPlayerInfo(),
                    );
                    juego.attackState = result === "ATTACK"
                    juego.maneuverState = result === "MANEUVER"
                }
                this.forceUpdate();
            }
        } else {
            juego.selectedCountryId = ''
            juego.countryToAttackOrManeuverTo = ''
            juego.map.setSelectedCountry(id);
            this.forceUpdate()
            return
        }
    };

    // Attack Territory Caller
    attackTerritory = () => {

        const result = juego.map.attackTerritory(juego.countryToAttackOrManeuverTo, juego.selectedCountryId, juego.numOfAttackerTroops, 2)

        if (typeof result === "object") {

            // envio la jugada al resto
            var newJugada = new JugadaAtaqueAsincrono(juego.myId, juego.idPartida, juego.selectedCountryId, juego.countryToAttackOrManeuverTo,
                result.attackerDiceRolls, result.defenderDiceRolls);
            juego.enviarjugada(newJugada);

            if (result.won && result.message === "TERRITORY_OCCUPIED") {
                juego.attackerDiceRolls = result.attackerDiceRolls
                juego.defenderDiceRolls = result.defenderDiceRolls
                alert(juego.turnDecider.getCurrentPlayerInfo().getId() + " won.");
            } else if (!result.won && result.message === "ATTACK_LOST") {
                juego.attackerDiceRolls = result.attackerDiceRolls
                juego.defenderDiceRolls = result.defenderDiceRolls
                alert(juego.turnDecider.getCurrentPlayerInfo().getId() + " lost.");
            } else {
                juego.attackerDiceRolls = result.attackerDiceRolls
                juego.defenderDiceRolls = result.defenderDiceRolls
            }
        }
    }

    // Troop Deployment Methods
    deployInitialTroops = () => {

        if (juego.deployer.deployTroops(juego.map, juego.turnDecider, juego.selectedCountryId, 1, juego.troopsGiver)) {
            juego.initialSetupPhase = false
            juego.turnsPhase = true
            juego.deployer.setStrategy(false);
        }
        // envio la jugada al resto
        var newJugada = new JugadaPonerTropas(juego.myId, juego.idPartida, juego.selectedCountryId, 1);
        juego.enviarjugada(newJugada);
    };

    deployTurnTroops = () => {
        juego.deployer.deployTroops(juego.map, juego.turnDecider, juego.selectedCountryId, 1, juego.troopsGiver)
        if (juego.turnDecider.getCurrentPlayerInfo().getRemainingTroops() === 0) {
            juego.turnsPhase = false
            juego.attackOrSkipTurnPhase = true
            juego.countryToAttackOrManeuverTo = ''
        }

        // envio la jugada al resto
        var newJugada = new JugadaPonerTropas(juego.myId, juego.idPartida, juego.selectedCountryId, 1);
        juego.enviarjugada(newJugada);
    }

    // Only called when turns phase is started
    endTurnForPlayer = () => {
        if (juego.turnDecider.endTurnForPlayer(true)) {
            juego.troopsGiver.giveTroopsToPlayer(juego.turnDecider.getPlayerWithTurn());
            juego.attackOrSkipTurnPhase = false
            juego.turnsPhase = true
            juego.attackState = false
            juego.maneuverState = false
            this.forceUpdate();
        }
    };

    // Renderers 
    endTurnButtonRenderer = () => {

        const remainingPlayerTroops = juego.turnDecider.getCurrentPlayerInfo().getRemainingTroops();

        if (!JugadaMoverTropas.initialSetupPhase && remainingPlayerTroops === 0) {
            return <EndButton onClick={() => {

                // Primero envio jugada y luego cambio turno. Si se hace al reves, se trata la jugada fin de turno,
                // ya que habra cambiado de id y luego llegara la jugada
                var nuevaJugada = new JugadaFinTurno(juego.userId, juego.idPartida);
                this.enviarjugada(nuevaJugada);

                // Esperamos a que llegue jugada fin turno (Fin turno remoto)
                new Promise((resolve) => setTimeout(resolve, 1000));

                // Fin turno local
                this.endTurnForPlayer(true)
                juego.selectedCountryId = ''
                juego.map.resetCountryState();

            }}>End Turn</EndButton>;
        }
        return null;
    }

    maneuverTerritory = () => {
        juego.map.attackTerritory(juego.selectedCountryId, juego.countryToAttackOrManeuverTo, juego.numOfAttackerTroops, juego.numOfDefenderTroops)
        // envio la jugada al resto
        var newJugada = new JugadaMoverTropas(juego.myId, juego.idPartida, juego.selectedCountryId, juego.countryToAttackOrManeuverTo,
            juego.numOfAttackerTroops);
        juego.enviarjugada(newJugada);
    }

    maneuverInputFieldsRenderer = () => {
        if (juego.maneuverState) {
            return (
                <>
                    <AttackerTroopsInput
                        value={juego.numOfAttackerTroops}
                        onChange={(e) =>
                            this.validateInput(e)
                        }
                    />
                    <ActionButton onClick={() => {this.maneuverTerritory()}}
                    >Maneuver</ActionButton>
                </>
            );
        }
        return null;
    }

    attackButtonRenderer = () => {
        const remainingPlayerTroops = juego.turnDecider.getCurrentPlayerInfo().getRemainingTroops();
        if (!juego.initialSetupPhase && remainingPlayerTroops === 0) {
            return <ActionButton onClick={() => {
                this.attackTerritory()
            }}>Attack</ActionButton>
        }
        return null;
    }

    attackInputFieldsRenderer = () => {

        if (juego.attackState)
            return (
                <>
                    <AttackerTroopsInput value={juego.numOfAttackerTroops} onChange={(e) => this.validateInput(e)}
                        style={{ zIndex: juego.attackState ? "1000" : "-1" }}
                    />
                </>
            );
        return null;
    }

    // Validator Methodspartida
    validateInput = (e) => {
        const val = e.target.value;

        if (isNaN(val)) {
            alert("Invalid Input.");
            return;
        }

        juego.numOfAttackerTroops = val
    };

    render() {

        return (
            <BoardContainer>
                <MapContainer>
                    <InnerContainer> {juego.players.map((player) => player.getView())} </InnerContainer>
                    {juego.map.getView()}
                    {juego.attackInputFieldsRenderer()}
                    {juego.attackButtonRenderer()}
                    {juego.maneuverInputFieldsRenderer()}
                    {juego.endTurnButtonRenderer()}
                </MapContainer> 
                {juego.attackerDiceRolls && juego.defenderDiceRolls ?
                    <DiceRollsContainer>
                        <AttackerDiceRollsContainer>
                            Dados atacante<br />
                            <span>
                                {juego.attackerDiceRolls && <span>{juego.attackerDiceRolls.join(" | ")}</span>}
                            </span>
                        </AttackerDiceRollsContainer>
                        <DefenderDiceRollsContainer>
                            Dados defensor<br />
                            <span>
                                {juego.defenderDiceRolls && <span>{juego.defenderDiceRolls.join(" | ")}</span>}
                            </span>
                        </DefenderDiceRollsContainer>
                </DiceRollsContainer> : null}
            </BoardContainer>
        );
    }

    /* ******* */
    /* JUGADAS */
    /* ******* */
    crearPartida(jugada) {
        AlertLoading('Partida encontrada. Empezando partida...', 1000)

        var newPlayers = []
        for (var i = 0; i < jugada.listaJugadores.length; i++){
            var newPlayer = new Player(jugada.listaJugadores[i], 30, colour[i], false, i)
            newPlayers.push(newPlayer)
        }
        newPlayers[0].setIsPlayerTurn(true)

        this.players = newPlayers
        this.partidaSincrona = jugada.partidaSincrona
        this.myId = getUsername()

        this.deployer = new Deployer(true);

        // Mapa
        this.map = new Map(this.players);
        this.countryIds = []
        var countries = this.map.getCountries()
        for (var i = 0; i < countries.length; i++) {
            this.countryIds.push(countries[i].getId())
        }

        // Turn decider y Troops Giver
        this.turnDecider = new TurnDecider(this.players);
        this.troopsGiver = new TroopsGiver(
            this.map.getCountries(),
            this.map.getContinents()
        );
    }

    ponerTropas = (jugada) => {

        if (juego.initialSetupPhase) {
            if (juego.deployer.deployTroops(juego.map, juego.turnDecider, jugada.country, jugada.numTropas, juego.troopsGiver)) {
                juego.initialSetupPhase = false
                juego.turnsPhase = true
                juego.deployer.setStrategy(false);
            }
        } else if (juego.turnsPhase) {
            juego.deployer.deployTroops(juego.map, juego.turnDecider, jugada.country, jugada.numTropas, juego.troopsGiver)
            if (juego.turnDecider.getCurrentPlayerInfo().getRemainingTroops() === 0) {
                juego.turnsPhase = false
                juego.attackOrSkipTurnPhase = true
                juego.countryToAttackOrManeuverTo = ''
            }
        }
    }

    moverTropas(jugada) {
        var countryOrigin = jugada.countryOrigin
        var countryDest = jugada.countryDest
        var numTropas = jugada.numTropas
        juego.map.attackTerritory(countryOrigin, countryDest, numTropas)
    }

    ataqueAsincrono(jugada) {
        var countryOrigin = jugada.countryOrigin
        var countryDest = jugada.countryDest
        var dadosAtaque = jugada.dadosAtaque
        var dadosDefensa = jugada.dadosDefensa

        const result = juego.map.attackTerritory(countryDest, countryOrigin, dadosAtaque.length, dadosDefensa.length,
                dadosAtaque, dadosDefensa)

        if (typeof result === "object") {

            if (result.won && result.message === "TERRITORY_OCCUPIED") {
                juego.attackerDiceRolls = result.attackerDiceRolls
                juego.defenderDiceRolls = result.defenderDiceRolls
                alert(juego.turnDecider.getCurrentPlayerInfo().getId() + " won.");
            } else if (!result.won && result.message === "ATTACK_LOST") {
                juego.attackerDiceRolls = result.attackerDiceRolls
                juego.defenderDiceRolls = result.defenderDiceRolls
                alert(juego.turnDecider.getCurrentPlayerInfo().getId() + " lost.");
            } else {
                juego.attackerDiceRolls = result.attackerDiceRolls
                juego.defenderDiceRolls = result.defenderDiceRolls
            }
        }
    }

    finTurno() {
        juego.endTurnForPlayer(true)
        juego.selectedCountryId = ''
        juego.map.resetCountryState();
    }

    enviarjugada(jugada) {
        socket.emit("nueva_jugada", jugada);
    }
}

var juego = new Game()

// Hay que modificar para tratar una jugada
export function procesarJugada(jugada) {
    // Solo proceso las jugadas del resto de jugadores
    // las mias las ejecuto en local
    if(jugada.userId != juego.myId) {
        switch(jugada.type) {
            case 'crearPartida':
                juego.setidPartida(jugada.idPartida)
                juego.crearPartida(jugada)
                console.log("He tratado la jugada de crear partida:", jugada)

            break
            case 'poner_tropas':
                juego.ponerTropas(jugada)
            break
            case 'fin_turno':
                juego.finTurno()
                console.log("He tratado la jugada de fin de turno")
            break
            case 'mover_tropas':
                juego.moverTropas(jugada)
                console.log("He tratado la jugada de mover tropas")
            break
            case 'ataque_asincrono':
                juego.ataqueAsincrono(jugada)
                console.log("He tratado la jugada de atacar asincrono tropas")
            break
            case 'ataque_sincrono':
                juego.ataqueSincrono(jugada)
                console.log("He tratado la jugada de atacar tropas")
            break
            case 'defensaSincrona':

            break
            case 'pedirCarta':

            break
            case 'finPartida':

                break
            default:
            break
        }
    }
}

const DiceRollsContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 600px;
    left: 100px;
    background-color: white;
    border-radius: 10px;
    padding: 10px;
    background-color: white;
`;

const AttackerDiceRollsContainer = styled.div`
    z-index: 1000;
    width: fit-content;
    height: fit-content;
    span {
        background-color: red;
        color: white;
    }
`;

const DefenderDiceRollsContainer = styled.div`
    z-index: 1000;
    width: fit-content;
    height: fit-content;
    span {
        background-color: white;
        color: red;
    }  
`;

const ActionButton = styled.button`
    position: absolute;
    right: 10px;
    top: 238px;
    background-color: white;
    color: #1d65a8;
    font-size: 90%;
    border: none;
    border-radius: 5px;
    width: 88px;
    height: 35px;
    outline: none;
    :hover {
        background-color: #1d65a8;
        color: white;
    }
    :focus {
        outline: 0;
    }
`;

const EndButton = styled.button`
    position: absolute;
    right: 10px;
    top: 279px;
    background-color: white;
    color: #f44336;
    font-size: 90%;
    border: none;
    border-radius: 5px;
    width: 88px;
    height: 35px;
    outline: none;
    :hover {
        background-color: #f44336;
        color: white;
    }
    :focus {
        outline: 0;
    }
`;

const SaveGameButton = styled(Button)`
    position: absolute;
    right: 10px;
    top: 110px;
`;
const AttackerTroopsInput = styled.input`
    position: absolute;
    right: 0px;
    top: 165px;
`;
const DefenderTroopsInput = styled.input`
    position: absolute;
    right: 0px;
    top: 200px;
`;
const MapContainer = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    span {
        padding-top: 5px;
        font-size: xxx-large;
    }
`;

const BoardContainer = styled.div`
    padding-top: 125px;
    display: flex;
    flex-direction: column;
    background-color: #88b6da;
    height: 100vh;
`

const InnerContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-bottom: 18px;
`;
