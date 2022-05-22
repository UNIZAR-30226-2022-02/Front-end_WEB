import React from "react"
import invert from "invert-color";

export default class Country{

    // id: nombre del pais (unico)
    // d: // ! PARA QUE SIRVE ESTOOOOOO
    // coord: donde esta situado pais en la pantalla
    // countryState: partidas asincronas, estado del pais
    // colour e initialColour: a la hora de seleccionar pais, cambiar de color. Necesitamos guardar
    //  color inicial
    // isSelected: ha sido seleccionado por user
    // numTroops: tropas del pais
    // belongToPlayer: jugador al que pertenece pais

    constructor(id, d, coord, colour, countryState = null) {
        this.id = id
        this.d = d
        this.coord = coord
        // Si hay que cargar un juego, ya existiran valores para los paises (cargar estado)
            this.colour = colour
            this.initialColour = colour
            this.isSelected = false
            this.numTroops = 0
            this.belongToPlayer = ""
    }
    getId() {
        return this.id;
    }
    getnumTroops() {
        return this.numTroops;
    }
    setnumTroops(numTroops) {
        this.numTroops = numTroops;
    }

    getOccupyingPlayerId() {
        return this.occupybelongToPlayeringPlayerId;
    }
    setOccupyingPlayer(player) {
        this.occupybelongToPlayeringPlayerId = player.id;
        this.setColor(player.color);
    }
    getColor() {
        return this.color;
    }
    setColor(color) {
        this.color = color;
    }
    verifyTroops() {
        if (this.numberOfTroops < 0) {
            this.numberOfTroops = 0;
        }
    }
    setDefaultColor() {
        this.setColor(this.defaultColor);
    }

    incrementDecerementTroops(numOfTroops) {
        this.numberOfTroops += numOfTroops;
        if (numOfTroops < 0) {
            this.numberOfTroops = 0;
        }
    }
    getSVG() {
        const text = React.createElement("text", {
            x: this.coord[0],
            y: this.coord[1],
            fontFamily: "Verdana",
            fontSize: "15",
            fill: "white",
            style: {
                pointerEvents: "none",
                fill: invert(this.colour, true),
                userSelect: "none"
            },
            children: this.numTroops,
        });

        const d = React.createElement("path", {
            id: this.id,
            d: this.d,
            stroke: invert(this.colour, true),
            strokeMiterlimit: "4.32165",
            style: {
                cursor: "pointer",
                fill: this.isSelected ? "#d9b51c" : this.colour,
            },
        });
        const g = React.createElement("g", null, d, text);

        return g;
    }
    

}