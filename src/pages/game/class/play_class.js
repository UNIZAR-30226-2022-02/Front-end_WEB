 class Jugada 
{
    userId  
}

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
    deploy(map, playerTurnDecider, idTerritorio, numTropas, cardsDeck, alert, callback) {
        if (map.deployTroop(idTerritorio, playerTurnDecider.getPlayerWithTurn(), 1, true)) {
            playerTurnDecider.endTurnForPlayer(false);
            if (!map.doPlayersHaveTroops()) {
                const currentPlayer = playerTurnDecider.getPlayerWithTurn();
                numTropas.giveTroopsToPlayer(currentPlayer);
                if (cardsDeck.shuffleCards() === "CARDS_SHUFFLED") {
                    alert.success("Cards Shuffled!");
                } else {
                    alert.error("Card could not be shuffled");
                }
                callback({ initialSetupPhase: false, turnsPhase: true });
                return true;
            }
        }
    }

}

 class JugadaMoverTropas extends Jugada
{
    idTerritorioOrigen 
    idTerritorioDestino 
    numTropas
}

 class JugadaUtilizarCartas extends Jugada
{

}

 class JugadaAtaqueSincrono extends Jugada
{
    ataqueSincrono = () => {
        const { alert } = this.props;
        const { countryToAttackOrManeuverTo, selectedCountryId, numOfAttackerTroops, numOfDefenderTroops } = this.state;
        const result = this.map.ataqueSincrono(countryToAttackOrManeuverTo, selectedCountryId, numOfAttackerTroops, numOfDefenderTroops, alert);
        if (typeof result === "object") {
            if (result.won && result.message === "TERRITORY_OCCUPIED") {
                alert.success(this.playerTurnDecider.getCurrentPlayerInfo().getName() + " won.");
                this.setState({ attackerDiceRolls: result.attackerDiceRolls, defenderDiceRolls: result.defenderDiceRolls });
                
                
                //Ahora parte de dar la carta
                const card = this.cardsDeck.getCard();
                if (card) {
                    const currentPlayerId = this.playerTurnDecider.getCurrentPlayerInfo().getId();
                    for (let i = 0; i < this.allPlayers.length; i++) {
                        if (this.allPlayers[i].getId() === currentPlayerId) {
                            this.allPlayers[i].addCard(card);
                            break;
                        }
                    }
                    alert.success(this.playerTurnDecider.getCurrentPlayerInfo().getName() + " received a card.");
                } else {
                    alert.error("No cards left to give.");
                }
            } else {
                this.setState({ attackerDiceRolls: result.attackerDiceRolls, defenderDiceRolls: result.defenderDiceRolls });
                alert.show(this.playerTurnDecider.getCurrentPlayerInfo().getName() + " lost.");
            }
        }
    }
}

 class JugadaDefensaSincrona extends Jugada
{

}

 class JugadaAtaqueAsincrono extends Jugada
{

}

 class JugadaPedirCarta extends Jugada
{

}

 class JugadaFinPartida extends Jugada
{

}
