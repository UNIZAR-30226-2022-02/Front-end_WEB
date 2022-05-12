// global context such that each component can behave according to it
import { createContext, useContext, useReducer } from "react";
import jwtDecode from "jwt-decode";
import React from 'react';

const LOGIN = "LOGIN"
const LOGOUT = "LOGOUT"

const initialState = { 
    userLogged: null,
    token: null 
};

const AuthContext = createContext({
    userLogged: null,
    token: null,
    login: (username, token) => {},
    logout: () => {},
});

function AuthReducer(state, action) {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                userLogged: action.username,
                token: action.token,
            };
        case LOGOUT:
            return {
                ...state,
                userLogged: null,
                token: action.token,
            };
        default:
            return state;
    }
}

function AuthProvider(props) {
    const [state, dispatch] = useReducer(AuthReducer, initialState);

    function login(username, token) {
        dispatch({
            type: LOGIN,
            username: username,
            token: token,
        });
    }

    function logout() {
        dispatch({
            type: LOGOUT,
        });
    }

    return (
        <AuthContext.Provider
        value={{ 
            userLogged: state.userLogged,
            token: state.token,
            login, 
            logout 
        }}
        {...props}
        />
    );
}

const useAuth = () => useContext(AuthContext);
export { AuthContext, AuthProvider, useAuth };
