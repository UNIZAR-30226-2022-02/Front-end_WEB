import * as React from 'react';
import styled from 'styled-components';
import { Button} from 'reactstrap';

import fondo_pantalla from '../images/background_image.png';

export default class Home extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return(
            <BackGroundImage>
                <MainContainer>
                    <HomeContainer>
                        <h2>Menu principal</h2>
                        <StyledButton className="btn btn-danger btn-lg" href="/gameConfig">Nueva partida</StyledButton>
                        <StyledButton className="btn btn-danger btn-lg">Cargar partida</StyledButton>
                    </HomeContainer>
                </MainContainer>
            </BackGroundImage>
        );
    }
};

const BackGroundImage = styled.div`
    background-image: url(${fondo_pantalla});
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    height: 100vh;
    widht: 100vh;
`;

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`;

const HomeContainer = styled.div`
    margin-top: 15%;
    background-color: white;
    width: 20%;
    padding: 25px;
    border-radius: 25px;
`;

const StyledButton = styled(Button)`
    margin-top: 5%;
`;