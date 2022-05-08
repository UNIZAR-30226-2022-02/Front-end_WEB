import React from 'react'

const UserContext = React.createContext();

class UserProvider extends React.Component {

    state = {
        userLogged: "HOLA",
        passwordLogged: "",
        token: "",
    }

    login = (username, password, token) => {
        this.setState ({
            userLogged: username,
            passwordLogged: password,
            token: token,
        });
    }

    logout = () => {
        this.setState ({
            userLogged: "",
            passwordLogged: "",
            token: "",
        })
    }

    render() {
        const { children } = this.props;
        const { userLogged } = this.state.userLogged;
        const { passwordLogged } = this.state.passwordLogged;
        const { token } = this.state.token;
        const { login } = this.login;
        const { logout } = this.logout;

        return(
            <UserContext.Provider
                value={{
                    userLogged,
                    passwordLogged,
                    token,
                    login,
                    logout,
                }}
            >
                { children }
            </UserContext.Provider>
        )
    }
}

export default UserContext;

export { UserProvider };
