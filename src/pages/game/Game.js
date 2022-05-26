import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from "reactstrap";
import styled from "styled-components";
import Map from "./Constantes_Contries_Cntinents.../map/Map";
import Player from "./Constantes_Contries_Cntinents.../Player";
import TurnDecider from "./Constantes_Contries_Cntinents.../Turn_Decider";
import TroopsGiver from "./Constantes_Contries_Cntinents.../Troops_Giver";
import Deployer from "./Constantes_Contries_Cntinents.../Deployer";
import { Jugada, JugadaCrearPartida, JugadaFinTurno, JugadaPonerTropas, 
    JugadaMoverTropas, JugadaUtilizarCartas, JugadaAtaqueSincrono, 
    JugadaDefensaSincrona, JugadaAtaqueAsincrono, JugadaPedirCarta, 
    JugadaFinPartida, FinTurno } from './jugadas/Jugadas'

import socketIOClient from "socket.io-client"; // Version 1.4.5

import { AlertLoading } from "../../util/MyAlerts";

const ENDPOINT = "http://serverrisk.herokuapp.com"

export default class Game extends Component {

    constructor(props) {
        super(props);

        this.state = {
            // Info partida
            idPartida: '',
            partidaSincrona: '',
            nVecesCartasUsadas: 0,

            // Players
            myId: '',
            players: [],
            numPlayers: 0,

            nPlayersEliminados: 0,
            playersEliminados: [],

            // Variables temporales
            selectedCountryId: '',
            countryToAttackOrManeuverTo: '',

            initialSetupPhase: true,
            turnsPhase: false,
            attackOrSkipTurnPhase: false,

            numOfAttackerTroops: 0,
            numOfDefenderTroops: 0,
            numOfTroopsToMove: 0,

            attackState: false,
            maneuverState: false,
            validity: false,
        };

        this.recibirJugada = this.recibirJugada.bind(this)

        this.socket.on("nueva_jugada", this.recibirJugada)
    }

    componentDidMount() {
        document.addEventListener("click", this.onClickListener);
        document.addEventListener("dblclick", this.onDoubleClickListener);
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.onClickListener);
        document.removeEventListener("dblclick", this.onDoubleClickListener);
    }

    // Attack Territory Caller
    attackTerritory = () => {
        const { countryToAttackOrManeuverTo, selectedCountryId, numOfAttackerTroops, numOfDefenderTroops } = this.state;
        const result = this.map.attackTerritory(countryToAttackOrManeuverTo, selectedCountryId, numOfAttackerTroops, numOfDefenderTroops);
        if (typeof result === "object") {
            if (result.won && result.message === "TERRITORY_OCCUPIED") {
                this.setState({ attackerDiceRolls: result.attackerDiceRolls, defenderDiceRolls: result.defenderDiceRolls });
                alert(this.turnDecider.getCurrentPlayerInfo().getName() + " won.");
            } else if (!result.won && result.message === "ATTACK_LOST") {
                this.setState({ attackerDiceRolls: result.attackerDiceRolls, defenderDiceRolls: result.defenderDiceRolls });
                alert(this.turnDecider.getCurrentPlayerInfo().getName() + " lost.");
            } else {
                this.setState({ attackerDiceRolls: result.attackerDiceRolls, defenderDiceRolls: result.defenderDiceRolls });
            }
        }
    }

    // Troop Deployment Methods
    deployInitialTroops = () => {
        const { myId, idPartida, selectedCountryId } = this.state;

        if (this.deployer.deployTroops(this.map, this.turnDecider, selectedCountryId, 1, this.troopsGiver, (newState) => this.setState(newState))) {
            this.forceUpdate();
            this.deployer.setStrategy(false);
        }

        // envio la jugada al resto
        var newJugada = new JugadaPonerTropas(myId, idPartida, '', selectedCountryId, 1);
        this.enviarjugada(newJugada);
    };

    deployTurnTroops = () => {
        const { selectedCountryId } = this.state;
        this.deployer.deployTroops(this.map, this.turnDecider, selectedCountryId, 1, this.troopsGiver, (newState) => this.setState(newState));
    };

    // Only called when turns phase is started
    endTurnForPlayer = () => {
        if (this.turnDecider.endTurnForPlayer(true)) {
            this.troopsGiver.giveTroopsToPlayer(this.turnDecider.getPlayerWithTurn());
            this.setState({
                attackOrSkipTurnPhase: false,
                turnsPhase: true,
                attackState: false,
                maneuverState: false,
            });
            this.forceUpdate();
        }
    };

    // Click Listeners
    onClickListener = (e) => {
        this.timer = setTimeout(() => {
            if (!this.prevent) {
                const id = e.target.id;
                const isCountryValid = this.countryIds.includes(id);
                if (isCountryValid) {
                    this.setState({ selectedCountryId: id });
                    this.map.setSelectedCountry(id);
                    this.forceUpdate();
                } else {
                    this.setState({ selectedCountryId: "" });
                    this.map.resetCountryState();
                    this.forceUpdate();
                }
            }
            this.prevent = false;
        }, this.delay);
    };

    onDoubleClickListener = (e) => {
        const { initialSetupPhase, turnsPhase, attackOrSkipTurnPhase } = this.state;

        clearTimeout(this.timer);
        this.prevent = true;
        const id = e.target.id;
        const isCountryValid = this.countryIds.includes(id);

        // Allow initial deployment with double click
        if (initialSetupPhase && isCountryValid) {
            this.setState({ selectedCountryId: id });
            this.map.setSelectedCountry(id);
            this.deployInitialTroops();
            this.forceUpdate();
            return;
        }

        // Allow turn troops deployment
        if (turnsPhase && isCountryValid) {
            this.setState({ selectedCountryId: id }, () => {
                this.map.setSelectedCountry(id);
                this.deployTurnTroops();
            });
            this.forceUpdate();
            return;
        }

        // Allow selecting another country, attacing and manevering
        if (attackOrSkipTurnPhase && isCountryValid) {
            this.setState({ countryToAttackOrManeuverTo: id }, () => {
                const result = this.map.validateInitialMove(
                    this.state.selectedCountryId,
                    this.state.countryToAttackOrManeuverTo,
                    this.turnDecider.getCurrentPlayerInfo(),
                );
                this.setState({
                    attackState: result === "ATTACK",
                    maneuverState: result === "MANEUVER",
                    validity: result ? true : false,
                });
            });
            this.forceUpdate();
        }
    };

    // Renderers 
    endTurnButtonRenderer = () => {
        const { initialSetupPhase } = this.state;

        const remainingPlayerTroops = this.turnDecider.getCurrentPlayerInfo().getRemainingTroops();

        if (!initialSetupPhase && remainingPlayerTroops === 0) {
            return <EndButton onClick={() => {
                this.endTurnForPlayer(true)
                this.setState({ selectedCountryId: "" });
                this.map.resetCountryState();
                 //envio el fin de turno al resto
                new JugadaFinTurno(this.turnDecider, this.idPartida);
                JugadaFinTurno.enviarjugada(JugadaFinTurno);
            }}>End Turn</EndButton>;
        }
        return null;
    }

    maneuverInputFieldsRenderer = () => {
        const { maneuverState, numOfAttackerTroops, numOfDefenderTroops, selectedCountryId, countryToAttackOrManeuverTo } = this.state;
        if (maneuverState) {
            return (
                <>
                    <AttackerTroopsInput
                        value={this.state.numOfAttackerTroops}
                        onChange={(e) =>
                            this.validateInput(e, "numOfAttackerTroops")
                        }
                    />
                    <ActionButton onClick={() => {
                        this.map.attackTerritory(selectedCountryId, countryToAttackOrManeuverTo, numOfAttackerTroops, numOfDefenderTroops);
                    }}
                    >Maneuver</ActionButton>
                </>
            );
        }
        return null;
    }

    attackButtonRenderer = () => {
        const { idPartida, initialSetupPhase, selectedCountryId, countryToAttackOrManeuverTo, attackerDiceRolls } = this.state;

        const remainingPlayerTroops = this.turnDecider.getCurrentPlayerInfo().getRemainingTroops();
        if (!initialSetupPhase && remainingPlayerTroops === 0) {
            return <ActionButton onClick={() => {
                this.attackTerritory()
                var jugada = new JugadaAtaqueAsincrono(this.turnDecider.getPlayerWithTurn(), idPartida, selectedCountryId,
                    countryToAttackOrManeuverTo, attackerDiceRolls);
                this.enviarjugada(jugada)
            }}>Attack</ActionButton>
        }
        return null;
    }

    attackInputFieldsRenderer = () => {
        const { numOfAttackerTroops, numOfDefenderTroops, attackState } = this.state;

        if (attackState)
            return (
                <>
                    <AttackerTroopsInput value={numOfAttackerTroops} onChange={(e) => this.validateInput(e, "numOfAttackerTroops")}
                        style={{ zIndex: attackState ? "1000" : "-1" }}
                    />
                    <DefenderTroopsInput value={numOfDefenderTroops} onChange={(e) => this.validateInput(e, "numOfDefenderTroops")}
                        style={{ zIndex: attackState ? "1000" : "-1" }}
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
        this.setState({ [inputType]: val });
    };

    render() {
        const { idPartida, players, attackerDiceRolls, defenderDiceRolls } = this.state;
        return (
            <BoardContainer>
                {idPartida === '' ? ( <h2>Id es ''</h2> ) 
                : (
                <MapContainer>
                    <InnerContainer>
                        {players.map((player) => player.getView())}
                    </InnerContainer>
                    {this.map.getView()}
                    {this.attackInputFieldsRenderer()}
                    {this.attackButtonRenderer()}
                    {this.maneuverInputFieldsRenderer()}
                    {this.endTurnButtonRenderer()}
                </MapContainer> )}
                {attackerDiceRolls && defenderDiceRolls ?
                    <DiceRollsContainer>
                        <AttackerDiceRollsContainer>
                            Dados atacante<br />
                            <span>
                                {attackerDiceRolls && <span>{attackerDiceRolls.join(" | ")}</span>}
                            </span>
                        </AttackerDiceRollsContainer>
                        <DefenderDiceRollsContainer>
                            Dados defensor<br />
                            <span>
                                {defenderDiceRolls && <span>{defenderDiceRolls.join(" | ")}</span>}
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
            var newPlayer = new Player(jugada.listaJugadores[i], 10, '#FF0000', false, i)
            newPlayers.push(newPlayer)
        }
        newPlayers[0].setIsPlayerTurn(true)

        this.setState({ players: newPlayers, partidaSincrona: jugada.partidaSincrona, 
                        myId: jugada.userId })

        this.deployer = new Deployer(true);

        // Mapa
        this.map = new Map(this.state.players);
        this.countryIds = []
        var countries = this.map.getCountries()
        for (var i = 0; i < countries.length; i++) {
            this.countryIds.push(countries[i].getId())
        }

        // Turn decider y Troops Giver
        this.turnDecider = new TurnDecider(this.state.players);
        this.troopsGiver = new TroopsGiver(
            this.map.getCountries(),
            this.map.getContinents()
        );

        // Una vez cargados los datos, iniamos la partida (pantalla de visualizacion)
        this.setState({ idPartida: jugada.idPartida })
    }

    ponerTropas(jugada) {
        var country = jugada.country
        var numTropas = jugada.numTropas

        this.deployer.deployTroops(this.map, this.turnDecider, country, numTropas, this.troopsGiver, (newState) => this.setState(newState));
    }

    moverTropas(jugada) {
        var countryOrigin = jugada.countryOrigin
        var countryDest = jugada.countryDest
        var numTropas = jugada.numTropas

        this.maneuverTroops(countryOrigin, countryDest, numTropas);
    }

    ataqueAsincrono(jugada) {
        countryOrigin = jugada.countryOrigin
        countryDest = jugada.countryDest
        dadosAtaque = jugada.dadosAtaque
        dadosDefensa = jugada.dadosDefensa

        
    }

    finTurno() {
        this.endTurnForPlayer()
    }

    enviarjugada(jugada) {
        this.socket.emit("nueva_jugada", jugada);
        console.log('Jugada enviada: ', jugada)
    }

    // Hay que modificar para tratar una jugada
    recibirJugada(jugada) {
        // Solo proceso las jugadas del resto de jugadores
        // las mias las ejecuto en local
        if(jugada.userId != this.myId) {
            switch(jugada.type) {
                case 'crearPartida':
                    console.log('Jugada recibida: ', jugada)
                    this.crearPartida(jugada)
                break

                case 'ponerTropas':
                    console.log('Jugada recibida: ' + jugada)
                    this.ponerTropas(jugada)
                break

                case 'finTurno':
                    console.log('Jugada recibida: ' + jugada)
                    this.finTurno()
                break

                case 'moverTropas':
                    console.log('Jugada recibida: ' + jugada)
                    this.moverTropas(jugada)
                break

                case 'utilizarCartas':
                    console.log('Jugada recibida: ' + jugada)

                break
                case 'ataqueSincrono':
                    console.log('Jugada recibida: ' + jugada)

                break
                case 'defensaSincrona':
                    console.log('Jugada recibida: ' + jugada)

                break
                case 'ataqueAsincrono':
                    console.log('Jugada recibida: ' + jugada)
                    this.ataqueAsincrono(jugada)

                break
                case 'pedirCarta':
                    console.log('Jugada recibida: ' + jugada)

                break
                case 'finPartida':
                    console.log('Jugada recibida: ' + jugada)

                    break
                default:
                    console.log('Jugada recibida: ' + jugada)

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
