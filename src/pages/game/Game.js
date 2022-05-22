import React from 'react'
import styled from 'styled-components';
import { useLocation, useNavigate } from "react-router-dom";

import Map from './Constantes_Contries_Cntinents.../Map'

export default class Game extends React.Component {

    constructor(props) {

    }
/*
    const location = useLocation()
    var map = new Map([]).getSVG();
    const [players, setPlayers] = React.useState(location.state.initPlayers)
*/
    render() {
        return(
            <GameContainer>
                <CardsContainer>

                </CardsContainer>
                <MapContainer>
                    
                </MapContainer>
                <PlayersContainer>
                </PlayersContainer>
            </GameContainer>
        );
    }
}

const GameContainer = styled.div`
    padding-top: 125px;
    display: flex;
    flex-direction: row;
    background-color #88b6da;
    height: 100vh;
`

const CardsContainer = styled.div`
`

const MapContainer = styled.div`
`

const PlayersContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-bottom: 18px;
`