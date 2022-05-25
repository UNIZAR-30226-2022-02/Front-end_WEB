import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from "reactstrap";
import styled from "styled-components";
import Map from "./Constantes_Contries_Cntinents.../map/Map";
import Player from "./Constantes_Contries_Cntinents.../Player";
import PlayerTurnDecider from "./Constantes_Contries_Cntinents.../Player_TurnDecider";
import TroopsGiver from "./Constantes_Contries_Cntinents.../Troops_Giver";
import Deployer from "./Constantes_Contries_Cntinents.../Deployer";

export default class Game extends Component {

    constructor(props) {
        super(props);
        this.state = {
            players: [],
            selectedCountryId: "",
            countryToAttackOrManeuverTo: "",
            initialSetupPhase: true,
            turnsPhase: false,
            attackOrSkipTurnPhase: false,
            numOfAttackerTroops: 0,
            numOfDefenderTroops: 0,
            numOfTroopsToMove: 0,
            attackState: false,
            maneuverState: false,
            validity: false,
            clickedCardNumber: undefined,
            showSaveModal: false,
            gameName: "",
        };

        this.initializeGamePlay = this.initializeGamePlay.bind(this);

        this.initializeGamePlay();
    }

    initializeGamePlay = () => {
        this.allPlayers = [];
        this.initializePlayers();
        this.map = new Map(this.allPlayers);
        this.allPlayers[0].setIsPlayerTurn(true);
        this.deployer = new Deployer(true);
        this.countryIds = []
        var countries = this.map.getCountries()
        for (var i = 0; i < countries.length; i++) {
            this.countryIds.push(countries[i].getId())
        }
        console.log(this.countryIds)
        this.playerTurnDecider = new PlayerTurnDecider(this.allPlayers, true);
        this.troopsGiver = new TroopsGiver(
            this.map.getCountries(),
            this.map.getContinents()
        );
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
                alert(this.playerTurnDecider.getCurrentPlayerInfo().getName() + " won.");
            } else if (!result.won && result.message === "ATTACK_LOST") {
                this.setState({ attackerDiceRolls: result.attackerDiceRolls, defenderDiceRolls: result.defenderDiceRolls });
                alert(this.playerTurnDecider.getCurrentPlayerInfo().getName() + " lost.");
            } else {
                this.setState({ attackerDiceRolls: result.attackerDiceRolls, defenderDiceRolls: result.defenderDiceRolls });
            }
        }
    }

    // Troop Deployment Methods
    deployInitialTroops = () => {
        const { selectedCountryId } = this.state;

        if (this.deployer.deployTroops(this.map, this.playerTurnDecider, selectedCountryId, this.troopsGiver, (newState) => this.setState(newState))) {
            this.forceUpdate();
            this.deployer.setStrategy(false);
        }
    };

    deployTurnTroops = () => {
        const { selectedCountryId } = this.state;
        this.deployer.deployTroops(this.map, this.playerTurnDecider, selectedCountryId, this.troopsGiver, (newState) => this.setState(newState));
    };

    initializePlayers = () => {
        const { players } = this.props.history.location.state;
        console.log(players)
        for (let i = 0; i < players.length; i++) {
            let player = new Player(
                players[i].name,
                players[i].id,
                players[i].reservePersonel,
                players[i].color,
                false,
                players[i].playerTurnNumber
            );
            player.setDiceRoll(players.length);
            this.allPlayers.push(player);
        }
    this.allPlayers = this.allPlayers.sort(
        (a, b) => b.getDiceRoll() - a.getDiceRoll()
    );
    };

    // Only called when turns phase is started
    endTurnForPlayer = () => {
        if (this.playerTurnDecider.endTurnForPlayer(true)) {
            this.troopsGiver.giveTroopsToPlayer(this.playerTurnDecider.getPlayerWithTurn());
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

        console.log('Country origen: ' + this.state.selectedCountryId)
        console.log('Country destino: ' + this.state.countryToAttackOrManeuverTo)

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
                    this.playerTurnDecider.getCurrentPlayerInfo(),
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

        const remainingPlayerTroops = this.playerTurnDecider.getCurrentPlayerInfo().getRemainingTroops();

        if (!initialSetupPhase && remainingPlayerTroops === 0) {
            return <EndButton onClick={() => {
                this.endTurnForPlayer(true)
                this.setState({ selectedCountryId: "" });
                this.map.resetCountryState();
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
        const { initialSetupPhase } = this.state;

        const remainingPlayerTroops = this.playerTurnDecider.getCurrentPlayerInfo().getRemainingTroops();
        if (!initialSetupPhase && remainingPlayerTroops === 0) {
            return <ActionButton onClick={this.attackTerritory}>Attack</ActionButton>
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

    // Validator Methods
    validateInput = (e, inputType) => {
        const val = e.target.value;
        if (isNaN(val)) {
            alert("Invalid Input.");
            return;
        }
        this.setState({ [inputType]: val });
    };

    render() {
        const { selectedCountryId, attackerDiceRolls, defenderDiceRolls } = this.state;
        if (!this.allPlayers) return null;

        return (
            <BoardContainer>¡
                <MapContainer>
                    <InnerContainer>{this.allPlayers.map((player) => player.getView())}</InnerContainer>
                    {this.map.getView()}
                    {this.attackInputFieldsRenderer()}
                    {this.attackButtonRenderer()}
                    {this.maneuverInputFieldsRenderer()}
                    {this.endTurnButtonRenderer()}
                </MapContainer>
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
