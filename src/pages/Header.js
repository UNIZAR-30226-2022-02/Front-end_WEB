import * as React from 'react'
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import { Container, Navbar, NavLink } from 'react-bootstrap' 

import { getUsername, logout } from '../context/UserProvider'

import logo_risk from '../images/logo_risk.png'

export default function Header() {

  const navigate = useNavigate();
  const username = getUsername();

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  console.log("Header: " + username)
  return username ? (
      <StyledNavbar>
        <Container>
          <StyledNavbarBrand href='/home'><Logo src={logo_risk}/></StyledNavbarBrand>
          <StyledNavbarBrand href='/home'>Inicio</StyledNavbarBrand>
          <StyledNavbarBrand href="/tienda">Tienda</StyledNavbarBrand>
          <StyledNavbarBrand href="#" onClick={handleLogout}>Cerrar sesión {'\t'}(logued as {username})</StyledNavbarBrand>
        </Container>
      </StyledNavbar>
  ) : (null)
}

const StyledNavbar = styled(Navbar)`
  background-color: blue;
`

const StyledNavbarBrand = styled(Navbar.Brand)`

`

const Logo = styled.img`
  height: 5vh;
`
