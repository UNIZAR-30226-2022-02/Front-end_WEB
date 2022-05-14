import * as React from 'react'
import styled from 'styled-components';
import { Link, useLocation } from "react-router-dom";
import { Menu, Search, Grid, Segment } from 'semantic-ui-react'

import { useAuth } from '../context/UserProvider'

import logo_risk from '../images/logo_risk.png'

export default function Header() {

    const { userLogged, logout } = useAuth();
    const Head = userLogged ? (
        <Menu pointing secondary size="massive" color="teal">


      <Menu.Menu position="right">
        <Menu.Item
          name="Iniciar Sesión"
          as={Link}
          to="/"
        />
        <Menu.Item
          name="Registrarme"
          as={Link}
          to="/register"
        />
      </Menu.Menu>
    </Menu>
    ) : (null)

    return Head;
}
