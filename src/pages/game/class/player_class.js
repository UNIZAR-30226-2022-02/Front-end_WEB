import React from "react";
import styled from "styled-components";


class Jugador 
{
    constructor(id, username, cartas, nTropasSinColocar,nCartas, haConquistado) {
        this.id = id
        this.username = username
        this.cartas = cartas
        this.nTropasSinColocar = nTropasSinColocar
        this.nCartas = nCartas;
        this.haConquistado = haConquistado  // REINICIAR A FALSE EN CADA TURNO!
        //falta campo color
    }

    getId() {
        return this.id;
    }
    getusername() {
        return this.username;
    }
    getnTropasSinColocar() {
        return this.nTropasSinColocar;
    }
    setnTropasSinColocar(nTropasSinColocar) {
        if (nTropasSinColocar >= 0) {
            this.nTropasSinColocar = nTropasSinColocar;
            return true;
        }
        return false;
    }
    getncartas(){
        return this.nCartas;
    }
    /*
    getIsPlayerTurn() {
        return this.isPlayerTurn;
    }*/

    getcartas() {
        return this.cartas;
    }
    tirarDados(numOfTroops) {
        let dados = [];
        if (numOfTroops >= 3) {
            numDados = new Array(3);
        } else {
            numDados = new Array(parseInt(numOfTroops));
        }
        const numOfRolls = numDados.length;
        for (let i = 0; i < numOfRolls; i++) {
            numDados[i] = Math.floor(Math.random() * 7);
        }
        return numDados.sort((a, b) => b - a);
    }
    añadirCarta(carta) {
        this.cartas.push(carta);
        this.nCartas++;
    }
    //Solo se podra eliminar la carta final
    eliminarCarta(cartas){
        this.cartas.splice(0, 1);
        this.nCartas--;
    }
    
//para la parte de visualizacion habra que retocar esto
    getSVG() {
        const PlayerName = React.createElement(Name, {
            children: this.name,
        });
        const PlayerTroops = React.createElement(Reserved, {
            children: `Reserve: ${this.remainingTroops}`,
        });
        const ColorText = React.createElement(Reserved, {
            children: "Color:",
        });
        const ColorIndicator = React.createElement(ColorBox, {
            style: { backgroundColor: this.color },
        });
        const ColorContainerElement = React.createElement(
            ColorContainer,
            null,
            ColorText,
            ColorIndicator
        );

        return React.createElement(
            CardBorder,
            {
                style: {
                    backgroundColor: `${this.isPlayerTurn ? "#d9b51c" : "white"
                        }`,
                },
                key: this.id,
            },
            PlayerName,
            PlayerTroops,
            ColorContainerElement
        );
    }
}
const ColorContainer = styled.div`
    display: flex;
    width: fit-content;
`;
const ColorLabel = styled.h6``;
const ColorBox = styled.div`
    height: 10px;
    width: 10px;
    margin-top: 5px;
    margin-left: 23px;
`;
const CardBorder = styled.div`
    width: fit-content;
    height: fit-content;
    padding: 10px;
    border-radius: 15px;
    background-color: white;
    justify-content: center;
    margin-right: 20px;
    margin-left: 20px;
`;
const nombre = styled.h5`
    font-size: 140%;
    text-align: center;
    margin: 0 0 10% 0;
    @media (${BREAKPOINTS.sm}) {
        font-size: 100%;
        margin: 0 0 2px 0;
        text-align: center;
    }
`;
const tropas = styled.h6`
    font-size: 100%;
    text-align: center;
    color: #606060;
    @media (${BREAKPOINTS.sm}) {
        font-size: 80%;
        text-align: center;
    }
`;
export default Jugador;

 