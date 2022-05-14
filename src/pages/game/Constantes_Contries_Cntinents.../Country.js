import React from "react"
import invert from "invert-color";

export default class Country{

    // id: nombre del pais (unico)
    // path: fronteras del svg (forma del pais)
    // coord: donde esta situado pais en la pantalla
    // countryState: partidas asincronas, estado del pais
    // colour e initialColour: a la hora de seleccionar pais, cambiar de color. Necesitamos guardar
    //  color inicial
    // isSelected: ha sido seleccionado por user
    // numTroops: tropas del pais
    // belongToPlayer: jugador al que pertenece pais

    constructor(id, path, coord, colour, countryState = null) {
        this.id = id
        this.path = path
        this.coord = coord

        // Si hay que cargar un juego, ya existiran valores para los paises (cargar estado)
            this.colour = colour
            this.initialColour = colour
            this.isSelected = false
            this.numTroops = 0
            this.belongToPlayer = ""
    }

    getId() {
        return this.id
    }

    getNumTroops() {
        return this.id
    }

    setNumTroops() {

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

        const path = React.createElement("path", {
            id: this.id,
            d: this.d,
            stroke: invert(this.colour, true),
            strokeMiterlimit: "4.32165",
            style: {
                cursor: "pointer",
                fill: this.isSelected ? "#d9b51c" : this.colour,
            },
        });
        const g = React.createElement("g", null, path, text);

        return g;
    }
}
