import * as React from 'react'

function Registro() {

    const [nombre, setNombre] = React.useState("");
    const [password1, setPassword1] = React.useState("");
    const [password2, setPassword2] = React.useState("");
    const [email, setEmail] = React.useState("");

    const handleNombre = (newValue) => {
        setNombre(newValue.target.value);
    };

    const handlePassword1 = (newValue) => {
        setPassword1(newValue.target.value);
    };

    const handlePassword2 = (newValue) => {
        setPassword2(newValue.target.value);
    };

    const handleEmail = (newValue) => {
        setEmail(newValue.target.value);
    };

    const handleRegistro = () => {
        if (nombre == "" || password1 == "" || password2 == "" || email == "") {
            // Campos vacios
            alert("Completa todos los campos del formulario")
        }
        else if (password1 != password2) {
            // Contraseñas no coinciden
            alert("Las contraseñas no coinciden")

        } else if (! /^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(email)) {
            // Formato de correo incorrecto
            alert("Formato de email no aceptado")

        } else if (true) {
            // Nombre de usuario ya existe

        } else {
            // Registrar nuevo usuario
            alert("Usuario registrado correctamente. Inica sesión para jugar")
        }
    };

return(
    <div style={{textAlign: "center"}} className="Registro">

        <h3 style={{marginTop: "20px"}} className="Titulo">Nuevo Usuario</h3>

        <div style={{marginLeft: "25%", width: "50%", marginTop: "30px"}} class="form-floating mb-3">
            <input type="text" class="form-control" id="floatingInput" placeholder="Nombre Usuario"
                value={nombre} onChange={handleNombre} required></input>
            <label for="floatingInput">Nombre usuario</label>
        </div>

        <div style={{marginLeft: "25%", width: "50%", marginTop: "30px"}} class="form-floating mb-3">
            <input type="password" class="form-control" id="floatingInput" placeholder="Contraseña"
                value={password1} onChange={handlePassword1}></input>
            <label for="floatingInput">Contraseña</label>
        </div>

        <div style={{marginLeft: "25%", width: "50%", marginTop: "30px"}} class="form-floating mb-3">
            <input type="password" class="form-control" id="floatingInput" placeholder="Confirmar contraseña"
                value={password2} onChange={handlePassword2}></input>
            <label for="floatingInput">Confirmar contraseña</label>
        </div>

        <div style={{marginLeft: "25%", width: "50%", marginTop: "30px"}} class="form-floating mb-3">
            <input type="email" class="form-control" id="floatingInput" placeholder="Correo electrónico"
                value={email} onChange={handleEmail}></input>
            <label for="floatingInput">Correo electrónico</label>
        </div>

        <br></br>

        <button onClick={handleRegistro} type="button" class="btn btn-outline-info btn-lg">Registrarme</button>

    </div>
    );
}

export default Registro;
