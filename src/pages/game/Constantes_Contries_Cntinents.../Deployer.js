export default class Deployer {
    constructor(isInitialDeployment) {
        this.isInitialDeployment = isInitialDeployment;
    }

    setStrategy(newIsInitialDeployment) {
        this.isInitialDeployment = newIsInitialDeployment;
    }

    deployTroops(map, playerTurnDecider, selectedCountryId, troopsGiver, callback) {

        if (this.isInitialDeployment === true) {
            if (map.deployTroop(selectedCountryId, playerTurnDecider.getPlayerWithTurn(), 1, true)) {
                playerTurnDecider.endTurnForPlayer(false);
                if (!map.doPlayersHaveTroops()) {
                    const currentPlayer = playerTurnDecider.getPlayerWithTurn();
                    troopsGiver.giveTroopsToPlayer(currentPlayer);
                    callback({ initialSetupPhase: false, turnsPhase: true });
                    return true;
                }
            }
        } else {
            map.deployTroop(selectedCountryId, playerTurnDecider.getPlayerWithTurn(), 1, true);
            if (playerTurnDecider.getCurrentPlayerInfo().getRemainingTroops() === 0) {
                callback({ cardsTrade: false });
                if (playerTurnDecider.getCurrentPlayerInfo().getCards().length > 5) {
                    callback({ showCards: true });
                    return;
                }
                callback({ turnsPhase: false, attackOrSkipTurnPhase: true, countryToAttackOrManeuverTo: "" });
            }
        }
    }
}
