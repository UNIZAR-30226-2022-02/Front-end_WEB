export default class PlayerTurnDecider {
    constructor(players) {
        this.players = players;
        this.indexOfPlayerWithTurn = 0;
    }

    getPlayerWithTurn() {
        this.players[this.indexOfPlayerWithTurn].setIsPlayerTurn(true);
        return this.players[this.indexOfPlayerWithTurn];
    }

    endTurnForPlayer(shouldValidatePlayerTroops) {
        if (shouldValidatePlayerTroops && this.players[this.indexOfPlayerWithTurn].getRemainingTroops() !== 0) {
            return false;
        }
        this.players[this.indexOfPlayerWithTurn].setIsPlayerTurn(false);
        this.indexOfPlayerWithTurn = (this.indexOfPlayerWithTurn + 1) % this.players.length;
        this.players[this.indexOfPlayerWithTurn].setIsPlayerTurn(true);
        return true;
    }

    getNextPlayer() {
        this.endTurnForPlayer();
        return this.getPlayerWithTurn();
    }

    getCurrentPlayerInfo() {
        return this.players[this.indexOfPlayerWithTurn];
    }
}
