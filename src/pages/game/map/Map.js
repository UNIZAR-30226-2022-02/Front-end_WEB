import * as React from 'react'
import styled from 'styled-components';

import Map_Paths from './Map_Paths';

class Map extends React.Component {

    getView() {
        const svg = React.createElement("svg", {
            height: "477",
            width: "719",
            viewBox: "0 0 719 477",
        },
            ...this.continents.map(continent => continent.getView()), <MapPaths />
        );
        return React.createElement(MapContainer, {}, svg);
    }
}

export default Map;
