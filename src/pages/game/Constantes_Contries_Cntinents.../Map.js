import * as React from 'react'
import styled from 'styled-components';

import Continent from './Continent'
import Map_Paths from './Map_Paths';
import { NEIGHBOURS } from './Constants'

export default class Map {

    constructor (players) {
        this.players = players
        this.continents = [
            new Continent("ASIA"),
            new Continent("AFRICA"),
            new Continent("AUSTRALIA"),
            new Continent("NORTH_AMERICA"),
            new Continent("SOUTH_AMERICA"),
            new Continent("EUROPE")
        ]
        this.countrySelected = ''
        this.countries = []
        for (var i = 0; i < this.continents.length; i++) {
            var countriesOfContinent = this.continents[i].getCountries()
            for (var j = 0; j < countriesOfContinent.length; j++) {
                this.countries.push(countriesOfContinent[j])
            }
        }
    }

    getContinents() {
        return this.continents;
    }

    getCountries() {
        return this.countries;
    }

    setCountrySelected(countryId) {
        for (var i = 0; i < this.countries.length; i++) {
            if (countryId === this.countries[i].getId()) {
                this.countrySelected = countryId;
                this.countries[i].setIsSelected(true);
            } else {
                this.countries[i].setIsSelected(false);
            }
        }
    }

    getCountryFromAndCountryTo(countryIdFrom, countryIdTo) {
        if (!countryIdFrom || !countryIdTo || countryIdFrom === countryIdTo) {
            return false
        }
            var returnCountries = ['', '']
        for (var i = 0; i < this.countries.length; i++) {
            if (this.countries[i].getId() === countryIdFrom) {
                returnCountries[0] = this.countries[i]
            }
            if (this.countries[i].getId() === countryIdTo) {
                returnCountries[1] = this.countries[i]
            }
        }
        return returnCountries
    }

    deployTroops(countryId, player, numTroops, initialPhase) {
        for (var i = 0; i < this.countries.length; i++) {
            if (this.continents[i].deployTroopsToCountry(countryId, player, numTroops, this.allCountriesOneTroop(), initialPhase)) {
                return true
            }
        }
        return false
    }

    allCountriesOneTroop() {
        for (var i = 0; i < this.countries.length; i++) {
            if(this.countries[i].getNumTroops() === 0) {
                return false
            }
        }
        return true
    }

    playersHaveTroops() {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].getNumTroops() > 0) {
                return true
            }
        }
        return false
    }


    //nsjdns

    isValidAttack(countryFrom, countryTo, numTroopsAttack, numTroopsDefend) {
        if (numTroopsAttack > 3) {
            alert('Atacar con un maximo de 3 tropas')
            return false
        } else if (numTroopsDefend > 2 ) {
            alert('Defender con un maximo de 2 tropas')
            return false
        } else if ((countryFrom.getNumTroops() - numTroopsAttack) < 1) {
            alert('Demasiadas tropas. Tiene que quedar al menos en el country origen')
            return false
        } else if (numTroopsDefend > countryTo.getNumTroops() ) {
            alert('Territorio defensa no tiene tantas tropas')
            return false
        } else {
            return true
        }
    }

    getPlayersAttackDefend (countryFrom, countryTo) {
        var returnPlayers = ['', '']
        for (var i = 0; i < this.players.length; i++) {
            if (countryFrom.getBelongToPlayer() === this.players[i].getId()) {
                returnPlayers[0] = this.players[i]
            }
            if (countryTo.getBelongToPlayer() === this.players[i].getId()) {
                returnPlayers[1] = this.players[i]
            }
        }
        return returnPlayers
    }

    attack(countryIdFrom, countryIdTo, numTroopsAttack, numTroopsDefend) {
        const [countryFrom, countryTo] = this.getCountryFromAndCountryTo(countryIdFrom, countryIdTo)
        if (!countryFrom || !countryTo) {
            return false
        }
        if (countryIdFrom.getBelongToPlayer() === countryIdTo.getBelongToPlayer()) {
            return this.moveTroops(countryIdFrom, countryIdTo, numTroopsAttack)
        } else if (!this.isValidAttack(countryIdTo, countryIdTo, numTroopsAttack, numTroopsDefend)) {
            return false
        }

        const [attackingPlayer, defendingPlayer] = this.getPlayersAttackDefend(countryFrom, countryTo)
        var attackerDice = attackingPlayer.rollDice(numTroopsAttack)
        var defenderDice = defendingPlayer.rollDice(numTroopsDefend)

        let attackerTroopsLost = 0;
        let defenderTroopsLost = 0;

        for (let i = 0; i < defenderDice.length; i++) {
            if (defenderDice[i] >= attackerDice[i]) {
                attackerTroopsLost++
            } else {
                defenderTroopsLost++
            }
        }

        var finalTroopsCountryFrom = countryFrom.getNumTroops() - attackerTroopsLost
        var finalTroopsCountryTo = countryTo.getNumTroops() - defenderTroopsLost

        if (finalTroopsCountryFrom < 0) {
            countryFrom.setNumTroops(0)
        } else {
            countryFrom.setNumTroops(finalTroopsCountryFrom)
        }

        if (finalTroopsCountryTo < 0) {
            countryFrom.setNumTroops(0)
        } else {
            countryFrom.setNumTroops(finalTroopsCountryTo)
        }

        if (finalTroopsCountryFrom === 0) {
            countryFrom.setBelongToPlayer(defendingPlayer)
            countryFrom.setNumTroops(numTroopsDefend - defenderTroopsLost)
            countryTo.setNumTroops(countryTo.getNumTroops() - numTroopsDefend)
            return 'ATTACK LOST'
        } else if (finalTroopsCountryTo <= 0) {
            countryTo.setBelongToPlayer(attackingPlayer)
            countryTo.setNumTroops(numTroopsAttack - attackerTroopsLost)
            countryFrom.setNumTroops(countryFrom.getNumTroops() - numTroopsAttack)
            return 'ATTACK WON'
        }
    }

    areNeighbours(countryFrom, countryTo) {
        const neighboursOfCountryFrom = NEIGHBOURS[countryFrom.getId()].countries;
        const countryIdTo = countryTo.getId();
        return neighboursOfCountryFrom.findIndex(neighbour => neighbour === countryIdTo) !== -1;
    }

    moveTroops(countryIdFrom, countryIdTo, numTroopsMove) {
        const [countryFrom, countryTo] = this.getAttakingAndDefendingCountry(countryIdFrom, countryIdTo);
        if (numTroopsMove === 0) {
            alert('No se han seleccionado tropas para mover')
            return false
        } else if ((countryFrom.getNumTroops() - numTroopsMove) < 1) {
            alert('Demasiadas tropas. Tiene que quedar al menos en el country origen')
            return false
        } else if (countryFrom.getBelongToPlayer() !== countryTo.getBelongToPlayer()) {
            alert('No son tus paises')
            return false
        }

        countryFrom.setNumTroops(countryFrom.getNumTroops() - parseInt(numTroopsMove))
        countryTo.setNumTroops(countryTo.getNumTroops() + parseInt(numTroopsMove))
        return true
    }

    resetCountriesSelection() {
        for (var i = 0; i < this.countries.length; i++) {
            this.countries[i].setIsSelected(false)
        }
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].getTroopsToDeploy() !== 0) {
                return false
            }
        }
        return true
    }

    setCountryFrom (countryId) {
        for (let i = 0; i < this.countries.length; i++) {
            if (this.countries[i].getId() === countryId) {
                this.countries[i].setColor("#FF0000");
            }
        }
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
