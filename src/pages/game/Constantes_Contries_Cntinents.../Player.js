import React from 'react'
import styled from 'styled-components'

export default class Player {
    constructor(id, username, colour, troopsToDeploy = 0, cards = [], isPlayerTurn = false) {
        this.id = id
        this.username = username
        this.colour = colour

        this.troopsToDeploy = troopsToDeploy
        this.cards = cards

        this.isPlayerTurn = isPlayerTurn
    }

    getId() {
        return this.id
    }

    setId(newId) {
        this.id = newId
    }

    getUsername() {
        return this.username
    }

    setUsername(newUsername) {
        this.id = newUsername
    }

    getColour() {
        return this.colour
    }

    setColour(newColour) {
        this.colour = newColour
    }

    getUsername() {
        return this.username
    }

    setUsername(newUsername) {
        this.username = newUsername
    }

    getTroopsToDeploy() {
        return this.troopsToDeploy
    }

    setTroopsToDeploy(newTroopsToDeploy) {
        this.troopsToDeploy = newTroopsToDeploy
    }

    getCards() {
        return this.cards
    }

    setNewCard(newCard) {
        this.card.push(newCard)
    }

    removeCards(cards) {

    }

    getPlayerTurn(){
        return this.isPlayerTurn
    }

    setPlayerTurn(newIsPlayerTurn) {
        this.isPlayerTurn = newIsPlayerTurn
    }

    roolDice(numTroops) {
        if (numTroops >= 3) {
            let dice = new Array(3);
        } else {
            let dice = new Array(parseInt(numTroops))
        }
        for (var i = 0; i < dice.length; i++) {
            dice[i] = Math.floor(Math.random() * 7);
        }
        return diceRolls.sort((a, b) => b - a);
    }

    getSVG() {
        const PlayerName = React.createElement(Name, {
            children: this.username,
        })
        const PlayerTroops = React.createElement(Reserved, {
            children: `Troops: ${this.troopsToDeploy}`,
        })
        const ColorText = React.createElement(Reserved, {
            children: 'Color:',
        })
        const ColorIndicator = React.createElement(ColorBox, {
            style: { backgroundColor: this.colour },
        })
        const ColorContainerElement = React.createElement(
            ColorContainer,
            null,
            ColorText,
            ColorIndicator
        )

        return React.createElement(
            CardBorder,
            {
                style: {
                    backgroundColor: `${this.isPlayerTurn ? '#d9b51c' : 'white'
                        }`,
                },
                key: this.id,
            },
            PlayerName,
            PlayerTroops,
            ColorContainerElement
        )
    }
}

const ColorContainer = styled.div`
    display: flex
    width: fit-content
`

const ColorLabel = styled.h6``

const ColorBox = styled.div`
    height: 10px
    width: 10px
    margin-top: 5px
    margin-left: 23px
`

const CardBorder = styled.div`
    width: fit-content
    height: fit-content
    padding: 10px
    border-radius: 15px
    justify-content: center
    margin-right: 20px
    margin-left: 20px
`

const Name = styled.h5`
    font-size: 140%
    text-align: center
    margin: 0 0 10% 0
`

const Reserved = styled.h6`
    font-size: 100%
    text-align: center
    color: #606060
`
