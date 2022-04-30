import * as React from 'react'
import styled from 'styled-components';
import { Navbar } from 'reactstrap';

import logo_risk from '../images/logo_risk.png'

class Header extends React.Component {

    render() {
        const { isSigned } = false;
        if (isSigned) {
            return(
                <MenuBar expand="md" sticky="top" light>
                    <Inicio href = "/">
                        <Logo src={logo_risk}/>
                        Inicio
                    </Inicio>
                </MenuBar>
            )
        }
        return(null);
    }
}

const MenuBar = styled(Navbar)`
    padding: 0px;
`

const Inicio = styled.a`

`

const Logo = styled.img`

`

export default Header
