import React from "react";

 class Jugada 
{
    userId  
      //Devuelve la pareja de ataque y defensa
      getPaisAtaqueDefensa(selectedCountryId, countryToAttackId) {
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
    getJugadorAtaqueDefensa(attackingCountry, defendingCountry) {
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
}

//En el login preguntas si tienes alguna partida ya
//Estas cargando hasta que te llega una jugada
class JugadaCrearPartida extends Jugada
{
    listaJugadores
    idPrimerJugador
    partidaSincrona
}

 class JugadaFinTurno extends Jugada
{ 

}

 class JugadaPonerTropas extends Jugada
{
    idTerritorio 
    numTropas

    //Cuando dejan de tener tropas se cambia de fase
    doPlayersHaveTroops() {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].nTropasSinColocar() === 0) {
                faseInicial= false;
            } else {
                faseInicial= true;
            }
        }
    }

    //Nos aseguramos que el mapa esta completo
    todosPaisesConTropas() {
        let bool;
        for (let i = 0; i < this.countries.length; i++) {
            if (this.countries[i].getNumberOfTroops() >= 1) {
                bool = true;
            } else {
                bool = false;
                break;
            }
        }
        //Habria que cambiar el estado de la partida a modo de jugar
        return bool;
    }
    deployTroopsToCountry(selectedCountryId, player, numberOfTroops, todosPaisesConTropas, despliegueInicial) {
        for (let i = 0; i < this.countries.length; i++) {
            if (this.countries[i].getId() === selectedCountryId) {
                const isUnoccupied = this.countries[i].getOccupyingPlayerId().length === 0;
                const isOccupiedBySamePlayer = this.countries[i].getOccupyingPlayerId() === player.id;
                const playerHasTroopsToDeploy = player.getRemainingTroops() > 0;
                const todosPaisesConTropas = todosPaisesConTropas();
                if ((playerHasTroopsToDeploy && isUnoccupied) || (todosPaisesConTropas && isOccupiedBySamePlayer) || (!despliegueInicial && player.getRemainingTroops() !== 0)) {
                    this.countries[i].setOccupyingPlayer(player);
                    this.countries[i].setNumberOfTroops(this.countries[i].getNumberOfTroops() + numberOfTroops);
                    player.setRemainingTroops(player.getRemainingTroops() - numberOfTroops);
                    return true;
                } 
                return false;
            }
        }
    }
    /*
    deployTroop(selectedCountryId, player, numberOfTroops, despliegueInicial) {
        let troopDeployed = false;
        for (let i = 0; i < this.continents.length; i++) {
            if (this.continents[i].deployTroopsToCountry(selectedCountryId, player, numberOfTroops, this.todosPaisesConTropas.bind(this), despliegueInicial)) {
                troopDeployed = true;
                break;
            };
        }
        return troopDeployed;
    }*/
}

 class JugadaMoverTropas extends Jugada
{
    departingCountryId
    destinationCountryId
    numOfTroops
    moverTropas(departingCountryId, destinationCountryId, numOfTroops, alert) {
        const [departingCountry, destinationCountry] = this.getPaisAtaqueDefensa(departingCountryId, destinationCountryId);
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
}

//Asigno tropas dependiendo del numero de cartas usadas por el jugador
 class JugadaUtilizarCartas extends Jugada
{
    JugadaUtilizarCartas(player) {
        let deployableTroops = Math.floor(this.getNumberOfCountryOccupiedByPlayer(player.id) / 3);
        deployableTroops += this.giveNumberOfTroopsBasedOnOccupiedContinents(this.doesPlayerOccupyContinent(player));

        if (deployableTroops < 3) {
            deployableTroops = 3;
        }
        return player.setRemainingTroops(deployableTroops+(nVecesCartasUsadas/3));
    }    
}

 class JugadaAtaqueSincrono extends Jugada
{
     //valida que se pueda realizar el ataque
     isAttackStateValid(attackingCountry, numOfTroopsToAttackWith, alert) {
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
        return true;
    }

    attackTerritory(attackingCountryId, defendingCountryId, numOfTroopsToAttackWith, numOfTroopsToDefendWith, alert) {
        //Hay que ver si consideramos que se defiende siempre con dos o se puede defender con 1
        //Parte para obtener nombre del pais a traves de un id
        const result = this.getPaisAtaqueDefensa(attackingCountryId, defendingCountryId);
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

        const [attackingPlayer,defendingPlayer]=this.getJugadorAtaqueDefensa(attackingCountry, defendingCountry);

        // tirar los dados para attacker and defender
        let dados_ataque = attackingPlayer.tirarDados(numOfTroopsToAttackWith)
        return {
            dados_ataque,
            attackingCountry,
            defendingCountry,
            attackingPlayer,
            defendingPlayer
        } 
    }
}

 class JugadaDefensaSincrona extends Jugada
{
    //valida que se pueda realizar la defensa
    isDefenseStateValid(defendingCountry, numOfTroopsToDefendWith, alert) {
        if (numOfTroopsToDefendWith <=2) {
            alert.error("Solo se puede defender con 2 tropas exactamente");
            return false;
        }
        if (numOfTroopsToDefendWith > defendingCountry.getNumberOfTroops()) {
            alert.error("Necesitas mas tropas para defender");
            return false;
        }
        return true;
    }

    attackTerritory(attackingCountry, defendingCountry, numOfTroopsToAttackWith, numOfTroopsToDefendWith,dados_ataque, alert) {
        //Hay que ver si consideramos que se defiende siempre con dos o se puede defender con 1
        //Parte para obtener nombre del pais a traves de un id
        if (!this.isDefenseStateValid(attackingCountry, defendingCountry, numOfTroopsToAttackWith, numOfTroopsToDefendWith, alert)) {
            return false;
        }
        const [attackingPlayer,defendingPlayer]=this.getJugadorAtaqueDefensa(attackingCountry, defendingCountry);
        //Habra que hacer para elgir el numero de dados
        // tirar los dados para attacker and defender
        let dados_defensa = defendingPlayer.tirarDados(numOfTroopsToDefendWith);

        // comparar resultdos de los dados
        let attackerToopsAfterComparison = new Array(numOfTroopsToAttackWith);
        let defenderTroopsAfterComparison = new Array(numOfTroopsToDefendWith);
        for (let i = 0; i < dados_defensa.length; i++) {
            if (dados_ataque[i] > dados_defensa[i]) {
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
                dados_ataque,
                dados_defensa
            }
        }
        if (defendingCountry.getNumberOfTroops() === 0) {
            defendingCountry.setOccupyingPlayer(attackingPlayer);
            defendingCountry.setNumberOfTroops(numOfTroopsToAttackWith - numOfBattlesAttackerLost);
            attackingCountry.setNumberOfTroops(attackingCountry.getNumberOfTroops() - (numOfTroopsToAttackWith));
            return {
                conquer: true,
                message: "territorio_conquistado",
                dados_ataque,
                dados_defensa
            }
        }
        return true;
    }

}

 class JugadaAtaqueAsincrono extends Jugada
{    
  //Devuelve la pareja de ataque y defensa
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
     return true;
    }

    attackTerritory(attackingCountryId, defendingCountryId, numOfTroopsToAttackWith, numOfTroopsToDefendWith, alert) {
        //Hay que ver si consideramos que se defiende siempre con dos o se puede defender con 1
        //Parte para obtener nombre del pais a traves de un id
        const result = this.getPaisAtaqueDefensa(attackingCountryId, defendingCountryId);
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

        const [attackingPlayer,defendingPlayer]=this.getJugadorAtaqueDefensa(attackingCountry, defendingCountry);

        // tirar los dados para attacker and defender
        let dados_ataque = attackingPlayer.tirarDados(numOfTroopsToAttackWith);
        let dados_defensa = defendingPlayer.tirarDados(numOfTroopsToDefendWith);

        // comparar resultdos de los dados
        let attackerToopsAfterComparison = new Array(numOfTroopsToAttackWith);
        let defenderTroopsAfterComparison = new Array(numOfTroopsToDefendWith);
        for (let i = 0; i < dados_defensa.length; i++) {
            if (dados_ataque[i] > dados_defensa[i]) {
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
                dados_ataque,
                dados_defensa
            }
        }
        if (defendingCountry.getNumberOfTroops() === 0) {
            defendingCountry.setOccupyingPlayer(attackingPlayer);
            defendingCountry.setNumberOfTroops(numOfTroopsToAttackWith - numOfBattlesAttackerLost);
            attackingCountry.setNumberOfTroops(attackingCountry.getNumberOfTroops() - (numOfTroopsToAttackWith));
            return {
                conquer: true,
                message: "territorio_conquistado",
                dados_ataque,
                dados_defensa
            }
        }
        return true;
    }
}

//Si el jugador  ha conquistado  le doy una carta
 class JugadaPedirCarta extends Jugada
{
    JugadaPedirCarta(player){
        if(player.haConquistado){
            player.añadirCarta(carta); 
        }
    }
}
 class JugadaFinPartida extends Jugada
{

}

class FinTurno extends Jugada
{
    FinTurno(player){
        turnoActual=turnoActual/length(jugadores);
        player.haConquistado=false;
    }
    //gestionar si acaba el que va antes porque me toca
}
