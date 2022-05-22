export default class Player {
    constructor(id, username, colour, ) {
        this.id = id
        this.username = username
        this.colour = colour

        this.numTroops = 0
        this.cards = [];

    }

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
