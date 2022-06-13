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

import { AlertLoading } from "../../util/MyAlerts";
import { getSocket, getUsername } from '../../context/UserProvider'

const ENDPOINT = "http://serverrisk.herokuapp.com"
const colour = ['#0000FF', '#FF0000', '#009900', '#ffff00', '#000000']

export default class Game extends Component {

    constructor(props) {
        super(props);

        // Info partida
        // State para actualizar el render automaticamente idPartida
        this.state = {
            idPartida: '',
            codigo: this.props.location.state.codigo,
        }
        this.partidaSincrona = ''
        this.nVecesCartasUsadas = 0

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

        this.turnState = '' // deploy attack or maneuver
    }

    componentDidMount() {
        document.addEventListener("dblclick", this.onDoubleClickListener);
    }

    componentWillUnmount() {
        document.removeEventListener("dblclick", this.onDoubleClickListener);
    }

    onDoubleClickListener = (e) => {

        // Ver si es su turno

        const id = e.target.id;
        const isCountryValid = this.countryIds.includes(id);

        // Allow initial deployment with double click
        if (this.initialSetupPhase && isCountryValid) {
            this.selectedCountryId = id
            this.map.setSelectedCountry(id);
            this.deployInitialTroops();
            this.forceUpdate();
            return;
        }

        // Allow turn troops deployment
        if (this.turnsPhase && isCountryValid) {
            this.selectedCountryId = id
            this.map.setSelectedCountry(id);
            this.deployTurnTroops();
            this.forceUpdate();
            return;
        }

        // Allow selecting another country, attacing and manevering
        if (this.attackOrSkipTurnPhase && isCountryValid) {
            this.countryToAttackOrManeuverTo = id
            const result = this.map.validateInitialMove(
                this.selectedCountryId,
                this.countryToAttackOrManeuverTo,
                this.turnDecider.getCurrentPlayerInfo(),
            );
            this.attackState = result === "ATTACK"
            this.maneuverState = result === "MANEUVER"
            this.forceUpdate();
        }
    };

    // Attack Territory Caller
    attackTerritory = () => {
        const result = this.map.attackTerritory(this.countryToAttackOrManeuverTo, this.selectedCountryId, this.numOfAttackerTroops, this.numOfDefenderTroops);
        if (typeof result === "object") {
            if (result.won && result.message === "TERRITORY_OCCUPIED") {
                this.attackerDiceRolls = result.attackerDiceRolls
                this.defenderDiceRolls = result.defenderDiceRolls
                alert(this.turnDecider.getCurrentPlayerInfo().getName() + " won.");
            } else if (!result.won && result.message === "ATTACK_LOST") {
                this.attackerDiceRolls = result.attackerDiceRolls
                this.defenderDiceRolls = result.defenderDiceRolls
                alert(this.turnDecider.getCurrentPlayerInfo().getName() + " lost.");
            } else {
                this.attackerDiceRolls = result.attackerDiceRolls
                this.defenderDiceRolls = result.defenderDiceRolls
            }
        }
    }

    // Troop Deployment Methods
    deployInitialTroops = () => {

        if (this.deployer.deployTroops(this.map, this.turnDecider, this.selectedCountryId, 1, this.troopsGiver)) {
            this.forceUpdate();
            this.deployer.setStrategy(false);
        }

        // envio la jugada al resto
        var newJugada = new JugadaPonerTropas(this.myId, this.idPartida, '', this.selectedCountryId, 1);
        this.enviarjugada(newJugada);
    };

    deployTurnTroops = () => {

        if (this.deployer.deployTroops(this.map, this.turnDecider, this.selectedCountryId, 1, this.troopsGiver)) {
            this.initialSetupPhase = false
            this.turnsPhase = true
        } else {
            this.turnsPhase = false
            this.attackOrSkipTurnPhase = true
            this.countryToAttackOrManeuverTo = ''
        }
    };

    // Only called when turns phase is started
    endTurnForPlayer = () => {
        if (this.turnDecider.endTurnForPlayer(true)) {
            this.troopsGiver.giveTroopsToPlayer(this.turnDecider.getPlayerWithTurn());
            this.attackOrSkipTurnPhase = false
            this.turnsPhase = true
            this.attackState = false
            this.maneuverState = false
            this.forceUpdate();
        }
    };

    // Renderers 
    endTurnButtonRenderer = () => {

        const remainingPlayerTroops = this.turnDecider.getCurrentPlayerInfo().getRemainingTroops();

        if (!this.initialSetupPhase && remainingPlayerTroops === 0) {
            return <EndButton onClick={() => {
                this.endTurnForPlayer(true)
                this.selectedCountryId = ''
                this.map.resetCountryState();
                 //envio el fin de turno al resto
                new JugadaFinTurno(this.turnDecider, this.idPartida);
                JugadaFinTurno.enviarjugada(JugadaFinTurno);
            }}>End Turn</EndButton>;
        }
        return null;
    }

    maneuverInputFieldsRenderer = () => {
        if (this.maneuverState) {
            return (
                <>
                    <AttackerTroopsInput
                        value={this.numOfAttackerTroops}
                        onChange={(e) =>
                            this.validateInput(e, "numOfAttackerTroops")
                        }
                    />
                    <ActionButton onClick={() => {
                        this.map.attackTerritory(this.selectedCountryId, this.countryToAttackOrManeuverTo, this.numOfAttackerTroops, this.numOfDefenderTroops);
                    }}
                    >Maneuver</ActionButton>
                </>
            );
        }
        return null;
    }

    attackButtonRenderer = () => {
        const remainingPlayerTroops = this.turnDecider.getCurrentPlayerInfo().getRemainingTroops();
        if (!this.initialSetupPhase && this.remainingPlayerTroops === 0) {
            return <ActionButton onClick={() => {
                this.attackTerritory()
                var jugada = new JugadaAtaqueAsincrono(this.turnDecider.getPlayerWithTurn(), this.idPartida, this.selectedCountryId,
                    this.countryToAttackOrManeuverTo, this.attackerDiceRolls);
                this.enviarjugada(jugada)
            }}>Attack</ActionButton>
        }
        return null;
    }

    attackInputFieldsRenderer = () => {

        if (this.attackState)
            return (
                <>
                    <AttackerTroopsInput value={this.numOfAttackerTroops} onChange={(e) => this.validateInput(e, "numOfAttackerTroops")}
                        style={{ zIndex: this.attackState ? "1000" : "-1" }}
                    />
                    <DefenderTroopsInput value={this.numOfDefenderTroops} onChange={(e) => this.validateInput(e, "numOfDefenderTroops")}
                        style={{ zIndex: this.attackState ? "1000" : "-1" }}
                    />
                </>
            );
        return null;
    }

    // Validator Methodspartida
    validateInput = (e, inputType) => {
        const val = e.target.value;
        if (isNaN(val)) {
            alert("Invalid Input.");
            return;
        }
        this.inputType = val
    };

    render() {

        const { idPartida, codigo } = this.state
        console.log ("Id partida render: ", idPartida)
        console.log ("Codigo partida render: ", codigo)

        return (
            <BoardContainer>
                { codigo === '' && idPartida === '' ? ( <div><h2>Esperando al resto de jugadores...</h2></div> )
                : idPartida === '' ? ( <div><h2>Esperando al resto de jugadores...</h2> <br></br> <h2>Codigo partida: {codigo}</h2> </div> )
                : (
                <MapContainer>
                    <InnerContainer>
                        {this.players.map((player) => player.getView())}
                    </InnerContainer>
                    {this.map.getView()}
                    {this.attackInputFieldsRenderer()}
                    {this.attackButtonRenderer()}
                    {this.maneuverInputFieldsRenderer()}
                    {this.endTurnButtonRenderer()}
                </MapContainer> )}
                {this.attackerDiceRolls && this.defenderDiceRolls ?
                    <DiceRollsContainer>
                        <AttackerDiceRollsContainer>
                            Dados atacante<br />
                            <span>
                                {this.attackerDiceRolls && <span>{this.attackerDiceRolls.join(" | ")}</span>}
                            </span>
                        </AttackerDiceRollsContainer>
                        <DefenderDiceRollsContainer>
                            Dados defensor<br />
                            <span>
                                {this.defenderDiceRolls && <span>{this.defenderDiceRolls.join(" | ")}</span>}
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

        console.log(jugada)

        var newPlayers = []
        for (var i = 0; i < jugada.listaJugadores.length; i++){
            var newPlayer = new Player(jugada.listaJugadores[i], 10, colour[i], false, i)
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

        const { codigo } = this.state

        this.setState ({ idPartida: jugada.idPartida })

        console.log ("Id partida funcion: ", this.state.idPartida)
        console.log ("Codigo partida funcion: ", codigo)
    }

    ponerTropas(jugada) {
        var country = jugada.country
        var numTropas = jugada.numTropas

        if (this.deployer.deployTroops(this.map, this.turnDecider, country, numTropas, this.troopsGiver)) {
            this.initialSetupPhase = false
            this.turnsPhase = true
        } else {
            this.turnsPhase = false
            this.attackOrSkipTurnPhase = true
            this.countryToAttackOrManeuverTo = ''
        }
    }

    moverTropas(jugada) {
        var countryOrigin = jugada.countryOrigin
        var countryDest = jugada.countryDest
        var numTropas = jugada.numTropas

        this.maneuverTroops(countryOrigin, countryDest, numTropas);
    }

    ataqueAsincrono(jugada) {
        /*
        countryOrigin = jugada.countryOrigin
        countryDest = jugada.countryDest
        dadosAtaque = jugada.dadosAtaque
        dadosDefensa = jugada.dadosDefensa
        */
    }

    finTurno() {
        this.endTurnForPlayer()
    }

    enviarjugada(jugada) {
        this.socket.emit("nueva_jugada", jugada);
        console.log('Jugada enviada: ', jugada)
    }

    // Hay que modificar para tratar una jugada
    procesarJugada(jugada) {
        // Solo proceso las jugadas del resto de jugadores
        // las mias las ejecuto en local
        if(jugada.userId != this.myId) {
            console.log('Jugada recibida: ' + jugada.type)
            switch(jugada.type) {
                case 'crearPartida':
                    this.crearPartida(jugada)
                break

                case 'ponerTropas':
                    this.ponerTropas(jugada)
                break

                case 'finTurno':
                    this.finTurno()
                break

                case 'moverTropas':
                    this.moverTropas(jugada)
                break

                case 'utilizarCartas':

                break
                case 'ataqueSincrono':

                break
                case 'defensaSincrona':

                break
                case 'ataqueAsincrono':
                    this.ataqueAsincrono(jugada)

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
