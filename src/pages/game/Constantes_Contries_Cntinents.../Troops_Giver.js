export const ARMIES_PER_CONTINENT = {
    asia: 7,
    europe: 5,
    north_america: 5,
    africa: 3,
    south_america: 2,
    australia: 2,
};

class TroopsGiver {
    constructor(countries, continents) {
        this.countries = countries;
        this.continents = continents;
    }

    giveTroopsToPlayer(player) {
        let deployableTroops = Math.floor(this.getNumberOfCountryOccupiedByPlayer(player.id) / 3);
        deployableTroops += this.giveNumberOfTroopsBasedOnOccupiedContinents(this.doesPlayerOccupyContinent(player));

        if (deployableTroops < 3) {
            deployableTroops = 3;
        }
        return player.setRemainingTroops(deployableTroops);
    }

    giveNumberOfTroopsBasedOnOccupiedContinents(continentsOccupied) {
        if (!continentsOccupied || continentsOccupied.length === 0) {
            return 0;
        } 
        let numOfTroopsToGive = 0;
        for (let i = 0; i < continentsOccupied.length; i++) {
            numOfTroopsToGive += ARMIES_PER_CONTINENT[continentsOccupied[i].toLowerCase()];
        }
        return numOfTroopsToGive;
    }

    doesPlayerOccupyContinent(player) {
        const continentsOccupied = [];
        const playerId = player.getId();
        for (let i = 0; i < this.continents.length; i++) {
            let continentName = this.continents[i].doesPlayerOccupyContinent(playerId);
            if (continentName) {
                continentsOccupied.push(continentName);
            }
        }
        return continentsOccupied;
    } 

    getNumberOfCountryOccupiedByPlayer(playerId) {
        let numOfTerritories = 0;
        for (let i = 0; i < this.countries.length; i++) {
            if (this.countries[i].getOccupyingPlayerId() === playerId) {
                numOfTerritories++;
            }
        }
        return numOfTerritories;
    }
}

export default TroopsGiver;
