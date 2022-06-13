export default class Deployer {
    constructor(isInitialDeployment) {
        this.isInitialDeployment = isInitialDeployment;
    }

    setStrategy(newIsInitialDeployment) {
        this.isInitialDeployment = newIsInitialDeployment;
    }

    deployTroops(map, playerTurnDecider, selectedCountryId, numTropas, troopsGiver, callback) {

        if (this.isInitialDeployment === true) {
            if (map.deployTroop(selectedCountryId, playerTurnDecider.getPlayerWithTurn(), numTropas, true)) {
                playerTurnDecider.endTurnForPlayer(false);
                if (!map.doPlayersHaveTroops()) {
                    const currentPlayer = playerTurnDecider.getPlayerWithTurn();
                    troopsGiver.giveTroopsToPlayer(currentPlayer);
                    return true;
                }
            }
        } else {
            map.deployTroop(selectedCountryId, playerTurnDecider.getPlayerWithTurn(), numTropas, true);
            if (playerTurnDecider.getCurrentPlayerInfo().getRemainingTroops() === 0) {
                callback({ cardsTrade: false });
                if (playerTurnDecider.getCurrentPlayerInfo().getCards().length > 5) {
                    callback({ showCards: true });
                    return;
                }
            }
        }
    }
}
