// Strategy Pattern
class DeploymentContext {
    constructor(deploymentStrategy) {
        this.deploymentStrategy = deploymentStrategy;
    }

    setStrategy(deploymentStrategy) {
        this.deploymentStrategy = deploymentStrategy;
    }

    deployTroops(map, playerTurnDecider, selectedCountryId, troopsGiver, cardsDeck, callback) {
        return this.deploymentStrategy.deploy(map, playerTurnDecider, selectedCountryId, troopsGiver, cardsDeck, callback);
    }
}

export default DeploymentContext;
