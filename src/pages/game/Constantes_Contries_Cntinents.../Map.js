import * as React from 'react'
import styled from 'styled-components';

import Continent from './Continent'
import Map_Paths from './Map_Paths';
import { NEIGHBOURS } from './Constants'

export default class Map {

    constructor (players) {
        this.players = players
        this.continents = [
            new Continent("ASIA"),
            new Continent("AFRICA"),
            new Continent("AUSTRALIA"),
            new Continent("NORTH_AMERICA"),
            new Continent("SOUTH_AMERICA"),
            new Continent("EUROPE")
        ]
        this.countrySelected = ''
        this.countries = []
        for (var i = 0; i < this.continents.length; i++) {
            var countriesOfContinent = this.continents[i].getCountries()
            for (var j = 0; j < countriesOfContinent.length; j++) {
                this.countries.push(countriesOfContinent[j])
            }
        }
    }

    getContinents() {
        return this.continents;
    }

    getCountries() {
        return this.countries;
    }

    setCountrySelected(countryId) {
        for (var i = 0; i < this.countries.length; i++) {
            if (countryId === this.countries[i].getId()) {
                this.countrySelected = countryId;
                this.countries[i].setIsSelected(true);
            } else {
                this.countries[i].setIsSelected(false);
            }
        }
    }

    getCountryFromAndCountryTo(countryIdFrom, countryIdTo) {
        if (!countryIdFrom || !countryIdTo || countryIdFrom === countryIdTo) {
            return false
        }
            var returnCountries = ['', '']
        for (var i = 0; i < this.countries.length; i++) {
            if (this.countries[i].getId() === countryIdFrom) {
                returnCountries[0] = this.countries[i]
            }
            if (this.countries[i].getId() === countryIdTo) {
                returnCountries[1] = this.countries[i]
            }
        }
        return returnCountries
    }


    getSVG() {
        const svg = React.createElement("svg", {
            height: "477",
            width: "719",
            viewBox: "0 0 719 477",
        },
            ...this.continents.map(continent => continent.getSVG()), <Map_Paths />
        );
        return React.createElement(MapContainer, {}, svg);
    }
}

const MapContainer = styled.div`
    text-align: center;
`;
