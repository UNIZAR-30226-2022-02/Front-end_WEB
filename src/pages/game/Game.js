import React from 'react'
import styled from 'styled-components';

import Map from './Constantes_Contries_Cntinents.../Map'

export default function Game() {

    var map = new Map([]).getSVG();

    return(
        <GameContainer>
            {map}
        </GameContainer>


    );
}

const GameContainer = styled.div`

`
