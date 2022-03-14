import * as React from 'react'
import styled from 'styled-components';
import Mapa_Paths from './Mapa_Paths';

class Mapa extends React.Component {
    render() {
        const MapContainer = styled.div`text-align: center;`;
        const svg = React.createElement(
            "svg", 
            {   height: "477",
                width: "719",
                viewBox: "0 0 719 477", },
            ...this.continents.map(continent => continent.getView()), <Mapa_Paths />
        );
        return React.createElement(MapContainer, {}, svg);
    }
}

export default Mapa;
