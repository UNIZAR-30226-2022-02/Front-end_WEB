import * as React from 'react'
import styled from 'styled-components';
import { Container, Navbar, NavLink } from 'react-bootstrap' 

import { getUsername, logout } from '../context/UserProvider'

import logo_risk from '../images/logo_risk.png'

export default class Header extends React.Component {

  handleLogout() {
    logout()
  }

  render() {
    const username = getUsername()
    return username ? (
        <StyledNavbar>
          <Container>
            <StyledNavbarBrand href='/home'><Logo src={logo_risk}/></StyledNavbarBrand>
            <StyledNavbarBrand href='/home'>Inicio</StyledNavbarBrand>
            <StyledNavbarBrand href="/tienda">Tienda</StyledNavbarBrand>
            <StyledNavbarBrand href="/" onClick={this.handleLogout}>Cerrar sesión {'\t'}(logued as {username})</StyledNavbarBrand>
          </Container>
        </StyledNavbar>
    ) : (null)
  }
}

const StyledNavbar = styled(Navbar)`
  background-color: blue;
`

const StyledNavbarBrand = styled(Navbar.Brand)`
`

const Logo = styled.img`
  height: 5vh;
`
