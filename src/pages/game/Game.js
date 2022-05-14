import React from 'react'
import styled from 'styled-components';

import Map from './Constantes_Contries_Cntinents.../Map'

export default function Game() {

    var map = new Map([]).getSVG();

    return(
        <GameContainer>
            <MapContainer>
                {map}
            </MapContainer>
        </GameContainer>


    );
}

const GameContainer = styled.div`
    padding-top: 125px;
    display: flex;
    flex-direction: row;
    background-color: #88b6da;
    height: 130vh;
`

const MapContainer = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    span {
        padding-top: 5px;
        font-size: xxx-large;
    }
`
