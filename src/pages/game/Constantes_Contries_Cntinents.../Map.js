import * as React from 'react'
import styled from 'styled-components';

import Continent from './Continent'
import Map_Paths from './Map_Paths';

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
    //Devuelve la pareja de ataque y defensa
    getAttakingAndDefendingCountry(selectedCountryId, countryToAttackId) {
        let attackingCountry = null;
        let defendingCountry = null;
        for (let i = 0; i < this.countries.length; i++) {
            if (this.countries[i].getId() === selectedCountryId) {
                attackingCountry = this.countries[i];
            }
            if (this.countries[i].getId() === countryToAttackId) {
                defendingCountry = this.countries[i];
            }
        }
        return [attackingCountry, defendingCountry];
    }
    // Set attacking and defending player
    getAttackingAndDefendingPlayer(attackingCountry, defendingCountry) {
        
        let attackingPlayer, defendingPlayer = null;
        for (let i = 0; i < this.players.length; i++) {
            if (attackingCountry.getOccupyingPlayerId() === this.players[i].getId()) {
                attackingPlayer = this.players[i];
            }
            if (defendingCountry.getOccupyingPlayerId() === this.players[i].getId()) {
                defendingPlayer = this.players[i];
            }
        }
        return [attackingPlayer, defendingPlayer];
    }
    //Nos aseguramos que el mapa esta completo
    allCountriesHaveOneTroop() {
        let isGood;
        for (let i = 0; i < this.countries.length; i++) {
            if (this.countries[i].getNumberOfTroops() >= 1) {
                isGood = true;
            } else {
                isGood = false;
                break;
            }
        }
        //Habria que cambiar el estado de la partida a modo de jugar
        return isGood;
    }
    doPlayersHaveTroops() {
        let playerHasTroops = true;
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].nTropasSinColocar() === 0) {
                playerHasTroops = false;
            } else {
                playerHasTroops = true;
            }
        }
        return playerHasTroops;
    }

    //valida que se pueda realizar el ataque
    isAttackStateValid(attackingCountry, defendingCountry, numOfTroopsToAttackWith, numOfTroopsToDefendWith, alert) {
        // 3 tropas de ataque max
        if (numOfTroopsToAttackWith > 3) {
            alert.error("No se puede atacar con mas de 3 tropas");
            return false;
        }
        if (attackingCountry.getNumberOfTroops() < 2) {
            alert.error("Un pais con menos de 2 tropas no puede atacar");
            return false;
        }
        if (numOfTroopsToAttackWith >= attackingCountry.getNumberOfTroops()) {
            alert.error("Estas atacando sin dejar una tropa al menos en el pais");
            return false;
        }
        if (numOfTroopsToDefendWith !=2) {
            alert.error("Solo se puede defender con 2 tropas exactamente");
            return false;
        }
        if (numOfTroopsToDefendWith > defendingCountry.getNumberOfTroops()) {
            alert.error("Necesitas mas tropas para defender");
            return false;
        }
        return true;
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

    moverTropas(departingCountryId, destinationCountryId, numOfTroops, alert) {
        const [departingCountry, destinationCountry] = this.getAttakingAndDefendingCountry(departingCountryId, destinationCountryId);
        if (numOfTroops <= 0) {
            alert.error("Tienes que mover al menos 1 tropa");
            return false;
        }

        if (departingCountry.getOccupyingPlayerId() !== destinationCountry.getOccupyingPlayerId()) {
            alert.error("No puedes mover tropas a un territorio que no te pertenece");
            return false;
        }

        if (departingCountry.getNumberOfTroops() <= numOfTroops) {
            alert.error("No tienes tropas suficientes para mover");
            return false;
        }
        departingCountry.setNumberOfTroops(departingCountry.getNumberOfTroops() - parseInt(numOfTroops));
        destinationCountry.setNumberOfTroops(destinationCountry.getNumberOfTroops() + parseInt(numOfTroops));
        return true;
    }

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
