import React from 'react'
import styled from 'styled-components';

import Player from './Constantes_Contries_Cntinents.../Player'
import Map from './Constantes_Contries_Cntinents.../Map'
import Continent from './Constantes_Contries_Cntinents.../Continent';
import Country from './Constantes_Contries_Cntinents.../Country';

export default class Game extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            players: [],

            countryIdFrom: '',
            numTroopsCountryFrom: 0,
            countryIdTo: '',
            numTroopsCountryTo: 0,

            initialPhase: true,
            turnPhase: '',  // Deploy, Attack, Fortify
        }

        this.initGame = this.initGame.bind(this)
        this.initPlayers = this.initPlayers.bind(this)

        this.initGame()
    }

    componentDidMount() {
        document.addEventListener("click", this.onClickListener);
        document.addEventListener("dblclick", this.onDoubleClickListener);
    }

    onClickListener = (e) => {
        //this.map.resetCountriesSelection();
        const id = e.target.id;
        const isCountryValid = this.countryIds.includes(id);
        if (isCountryValid) {
            this.setState({ countryIdFrom: id });
            this.map.setCountrySelected(id);
            this.forceUpdate();
        } else {
            this.setState({ countryIdFrom: "" });
            this.map.resetCountriesSelection();
            this.forceUpdate();
        }
    };

    onDoubleClickListener = (e) => {
        const { alert } = this.props;
        const { showCards, initialPhase, turnsPhase, attackOrSkipTurnPhase, cardsTrade } = this.state;

        this.prevent = true;
        const id = e.target.id;
        const isCountryValid = this.countryIds.includes(id);

        if (initialPhase && isCountryValid) {
            this.setState({ countryIdFrom: id });
            this.map.setCountrySelected(id);
            this.deployInitialTroops();
            this.forceUpdate();
            return;
        }

        // Allow turn troops deployment
        if (turnsPhase && isCountryValid && !showCards) {
            this.setState({ selectedCountryId: id }, () => {
                this.map.setSelectedCountry(id);
                this.deployTurnTroops();
            });
            this.forceUpdate();
            return;
        }

        if (cardsTrade) {
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
                    alert
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

    initGame(gameState = null) {
        if (gameState) {

        } else {
            this.allPlayers = []
            this.initPlayers()

            this.map = new Map(this.allPlayers, null)

            this.countryIds = []
            var countries = this.map.getCountries()
            for (var i = 0; i < countries.length; i++) {
                this.countryIds.push(countries[i].getId())
            }
            console.log(this.countryIds)
        }
    }

    initPlayers(playersState = null) {
        const { players } = this.props.history.location.state
        for(let i = 0; i < players.length; i++) {
            let newPlayer = new Player(
                players[i].id = i,
                players[i].name,
                players[i].colour,
            )
            this.allPlayers.push(newPlayer)
        }
        console.log(this.players)
        this.allPlayers[0].setPlayerTurn(true)
    }

    deployInitialTroops() {
        const { countryIdFrom } = this.state;

    }
/*
    const location = useLocation()
    var map = new Map([]).getSVG();
    const [players, setPlayers] = React.useState(location.state.initPlayers)
*/
    render() {
        const { countryIdFrom } = this.state
        return(
            <GameContainer>
                <CardsContainer>
                    
                </CardsContainer>
                <MapContainer>
                    {this.map.getSVG()}
                    {countryIdFrom ? <span>{countryIdFrom} </span> : null}
                </MapContainer>
                <PlayersContainer>
                    {this.allPlayers.map((player) => player.getSVG())}                
                </PlayersContainer>
            </GameContainer>
        );
    }
}

const GameContainer = styled.div`
    display: flex;
    height: 100vh;
    widht: 100vh;
    background-color #88b6da;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
`

const MapContainer = styled.div`
    span {
        padding-top: 5px;
        font-size: xxx-large;
    }
`

const CardsContainer = styled.div`
display: flex;
flex-direction: column;
text-align: center;
span {
    padding-top: 5px;
    font-size: xxx-large;
}
`

const PlayersContainer = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;
    padding-left: 15vh;
`
