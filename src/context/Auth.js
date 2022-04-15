import { createContext, useContext, useReducer } from "react";
import React from 'react';

const initialState = { user: null };
const token = "jwtToken";
const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";

// Estado inicial
const AuthContext = createContext({
    user: null,
    login: userData => {},
    logout: () => {},
})

const UseAuth = () => useContext(AuthContext);

function AuthReducer(state, action) {
    switch (action.type) {
        case LOGIN:
            return { ...state, user: action.payload }
        case LOGOUT:
            return { ...state, user: null, };
        default:
            return state;
        
    }
}

function AuthProvider(props) {
    const [state, dispatch] = useReducer(AuthReducer, initialState);

    function login (userData) {
        localStorage.setItem(token, userData.token);

        dispatch({
            type: LOGIN, payload: userData,
        });
    }

    function logout () {
        if(localStorage.getItem(token)) {
            localStorage.removeItem(token);
        }

        dispatch({
            type: LOGOUT,
        });
    }

    return (
        <AuthContext.Provider
            value = {{ user: state.user, login, logout }}
            {...props}
        />
    );
}

export { AuthContext, AuthProvider, UseAuth }
