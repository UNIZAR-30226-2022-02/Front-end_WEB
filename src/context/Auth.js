import { createContext, useContext, useReducer } from "react";
import jwtDecode from "jwt-decode";
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

const useAuth = () => useContext(AuthContext);

class Auth extends React.Component{
    authReducer(state, action) {
        switch (action.type) {
            case LOGIN:
                return { ...state, user: action.payload }
            case LOGOUT:
                return { ...state, user: null, };
            default:
                return state;
        }
    }

    authProvider(props) {
        const [state, dispatch] = useReducer(authReducer, initialState);

        function login (userData) {
            localStorage.setItem(token, userData.token);
            dispatch({
                type: LOGIN, payload: userData,
            });
        }

        function logout () {
            localStorage.removeItem(token);
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
};

export { Auth, useAuth }
