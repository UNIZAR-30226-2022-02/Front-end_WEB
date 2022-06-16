import React from "react";
import styled from "styled-components";

class Player {
    constructor(id, remainingTroops, color, isPlayerTurn, turnNumber, diceRoll = null, noOfCards = 0, numOfCardTrades = 0) {
        this.id = id;
        this.remainingTroops = remainingTroops;
        this.color = color;
        this.isPlayerTurn = isPlayerTurn;
        this.turnNumber = turnNumber;
        this.diceRoll = diceRoll;
        this.cards = [];
        this.numOfCardTrades = numOfCardTrades;
        this.noOfCards = noOfCards;
    }

    getId() {
        return this.id;
    }

    getTurnNumber() {
        return this.turnNumber;
    }

    getNumOfCardTrades() {
        return this.numOfCardTrades;
    }
    setNumOfCardTrades(numOfCardTrades) {
        this.numOfCardTrades = numOfCardTrades;
    }

    setDiceRoll(numOfPlayers) {
        this.diceRoll = Math.floor(Math.random() * 7);
    }
    getDiceRoll() {
        return this.diceRoll;
    }

    getRemainingTroops() {
        return this.remainingTroops;
    }

    setRemainingTroops(remainingTroops) {
        if (remainingTroops >= 0) {
            this.remainingTroops = remainingTroops;
            return true;
        }
        return false;
    }

    getIsPlayerTurn() {
        return this.isPlayerTurn;
    }

    setIsPlayerTurn(playerTurn) {
        this.isPlayerTurn = playerTurn;
    }

    getColor() {
        return this.color;
    }

    getNoOfCards() {
        return this.noOfCards;
    }

    getCards() {
        return this.cards;
    }

    rollDiceBasedOnTroops(numOfTroops) {
        let diceRolls = [];
        if (numOfTroops >= 3) {
            diceRolls = new Array(3);
        } else {
            diceRolls = new Array(parseInt(numOfTroops));
        }
        const numOfRolls = diceRolls.length;
        for (let i = 0; i < numOfRolls; i++) {
            diceRolls[i] = Math.floor((Math.random() * (6 - 1 + 1)) + 1);
            
        }
        return diceRolls.sort((a, b) => b - a);
    }

    getView() {
        const PlayerName = React.createElement(Name, {
            children: this.id,
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

// width: 100%;
//     height: 12%;
//     margin-left: 2%;
//     margin-right: 2%;

//     border-radius: 25px;
//     background-color: white;
//     justify-content: center;
//     align-items: center;
//     text-align: center;
//     @media (${BREAKPOINTS.sm}) {
//         width: 100%;
//         height: 30%;
//     }
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
const Name = styled.h5`
    font-size: 140%;
    text-align: center;
    margin: 0 0 10% 0;
`;
const Reserved = styled.h6`
    font-size: 100%;
    text-align: center;
    color: #606060;
`;
export default Player;
