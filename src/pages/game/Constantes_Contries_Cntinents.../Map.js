import * as React from 'react'
import styled from 'styled-components';

import Continent from './Continent'
import Map_Paths from './Map_Paths';
import { NEIGHBOURS } from './Constants'

// Si hay que cargar un juego, ya existiran valores para el mapa (cargar estado)
export default class Map {

    constructor (players, mapState = null) {
        this.players = players
        this.continents = [
            new Continent("ASIA"),
            new Continent("AFRICA"),
            new Continent("AUSTRALIA"),
            new Continent("NORTH_AMERICA"),
            new Continent("SOUTH_AMERICA"),
            new Continent("EUROPE")
        ]
    }

    areNeighbours(countryFrom, countryTo) {
        const neighboursOfCountryFrom = NEIGHBOURS[countryFrom.getId()].countries;
        const countryIdTo = countryTo.getId();
        return neighboursOfCountryFrom.findIndex(neighbour => neighbour === countryIdTo) !== -1;
    }
 
  

   
    attackTerritory(attackingCountryId, defendingCountryId, numOfTroopsToAttackWith, numOfTroopsToDefendWith, alert) {
        //Hay que ver si consideramos que se defiende siempre con dos o se puede defender con 1
        //Parte para obtener nombre del pais a traves de un id
        const result = this.getAttakingAndDefendingCountry(attackingCountryId, defendingCountryId);
        let attackingCountry, defendingCountry = null;
        if (result) {
            defendingCountry = result[0];
            attackingCountry = result[1];
        } else {
            return false;
        }

        if (!this.isAttackStateValid(attackingCountry, defendingCountry, numOfTroopsToAttackWith, numOfTroopsToDefendWith, alert)) {
            return false;
        }

        const [attackingPlayer, defendingPlayer] = this.getAttackingAndDefendingPlayer(attackingCountry, defendingCountry);

        // tirar los dados para attacker and defender
        let attackerDiceRolls = attackingPlayer.tirarDados(numOfTroopsToAttackWith);
        let defenderDiceRolls = defendingPlayer.tirarDados(numOfTroopsToDefendWith);

        // comparar resultdos de los dados
        let attackerToopsAfterComparison = new Array(numOfTroopsToAttackWith);
        let defenderTroopsAfterComparison = new Array(numOfTroopsToDefendWith);
        for (let i = 0; i < defenderDiceRolls.length; i++) {
            if (attackerDiceRolls[i] > defenderDiceRolls[i]) {
                attackerToopsAfterComparison[i] = 1;
                defenderTroopsAfterComparison[i] = -1;
            } else {
                attackerToopsAfterComparison[i] = -1;
                defenderTroopsAfterComparison[i] = 1;
            }
        }
        let numOfBattlesAttackerLost = 0;
        let numOfBattlesDefenderLost = 0;
        for (let i = 0; i < numOfTroopsToDefendWith; i++) {
            if (attackerToopsAfterComparison[i] < 0) {
                numOfBattlesAttackerLost++;
            }
            if (defenderTroopsAfterComparison[i] < 0) {
                numOfBattlesDefenderLost++;
            }
        }
        attackingCountry.setNumberOfTroops(attackingCountry.getNumberOfTroops() - numOfBattlesAttackerLost);
        defendingCountry.setNumberOfTroops(defendingCountry.getNumberOfTroops() - numOfBattlesDefenderLost);
        attackingCountry.verifyTroops();
        defendingCountry.verifyTroops();
        if (attackingCountry.getNumberOfTroops() === 0) {
            attackingCountry.setOccupyingPlayer(defendingPlayer);
            attackingCountry.setNumberOfTroops(numOfTroopsToDefendWith - numOfBattlesDefenderLost);
            defendingCountry.setNumberOfTroops(defendingCountry.getNumberOfTroops() - numOfTroopsToDefendWith);
            return {
                conquer: false,
                message: "ataque_fallido",
                attackerDiceRolls,
                defenderDiceRolls
            }
        }
        if (defendingCountry.getNumberOfTroops() === 0) {
            defendingCountry.setOccupyingPlayer(attackingPlayer);
            defendingCountry.setNumberOfTroops(numOfTroopsToAttackWith - numOfBattlesAttackerLost);
            attackingCountry.setNumberOfTroops(attackingCountry.getNumberOfTroops() - (numOfTroopsToAttackWith));
            return {
                conquer: true,
                message: "territorio_conquistado",
                attackerDiceRolls,
                defenderDiceRolls
            }
        }
        return true;
    }

    /*Funcion para obtener los vecinos del pais que ataca
    areAttackingAndDefendingCountryNeighbours(attackingCountry, defendingCountry) {
       const neighboursOfAttackingCountry = NEIGHBOURS[attackingCountry.getId()].countries;
        const defendingCountryId = defendingCountry.getId();
        return neighboursOfAttackingCountry.findIndex(neighbour => neighbour === defendingCountryId) !== -1;
    }*/

  

    getSVG() {
        const svg = React.createElement("svg", {
            height: "477",
            width: "719",
            viewBox: "0 0 719 477",
        },
            ...this.continents.map(continent => continent.getSVG()), <Map_Paths />
        );
        return React.createElement(MapContainer, {}, svg);
    }
}

const MapContainer = styled.div`
    text-align: center;
`;
