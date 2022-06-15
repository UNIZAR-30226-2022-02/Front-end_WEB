export default class Deployer {
    constructor(isInitialDeployment) {
        this.isInitialDeployment = isInitialDeployment;
    }

    setStrategy(newIsInitialDeployment) {
        this.isInitialDeployment = newIsInitialDeployment;
    }

    deployTroops(map, playerTurnDecider, selectedCountryId, numTropas, troopsGiver) {

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
        }
    }
}
