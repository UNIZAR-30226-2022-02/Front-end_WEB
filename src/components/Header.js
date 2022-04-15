import * as React from 'react'
import styled from 'styled-components';

import logo_risk from '../images/logo_risk.png'

class Header extends React.Component {

    render() {
        return(
            <NavBar expand="md" sticky="top" light>
                <Inicio href = "/">
                    <Logo src={logo_risk}/>
                    Inicio
                </Inicio>
            </NavBar>
        )
    }
}

const NavBar = styled.nav`
    padding: 0px;
`

const Inicio = styled.a`

`

const Logo = styled.img`

`

export default Header
