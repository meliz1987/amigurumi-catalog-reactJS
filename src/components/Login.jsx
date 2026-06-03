import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { executeBasicSweet } from "../assets/SweetAlert";
import { loginEmailPass } from "../auth/firebase";
import "../styles/login.css";
import Footer from "./Footer";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const { login, user, logout } = useAuthContext();
  const navigate = useNavigate();

  // const loginEmail = (e) => {
  //   e.preventDefault();
  //   loginEmailPass(usuario, password)
  //     .then((user) => {
  //       login(usuario);
  //       executeBasicSweet("¡Bienvenido!", "Inicio de sesión exitoso", "success", "Ok");
  //       navigate("/");
  //     })
  //     .catch((error) => {
  //       if (error.code === "auth/invalid-credential") {
  //         executeBasicSweet("Oops!", "Credenciales incorrectas", "error", "Cerrar");
  //       }
  //     });
  // };

  const loginEmail = (e) => {
    e.preventDefault();
    loginEmailPass(usuario, password)
      .then((userCredential) => {
        const email =
          userCredential.email || userCredential.user?.email || usuario;

        login(email); // esto setea el usuario en el contexto

        executeBasicSweet(
          "¡Bienvenido!",
          "Inicio de sesión exitoso",
          "success",
          "Ok",
        );

        // redirige dependiendo del tipo de usuario
        if (email === "admin@gmail.com") {
          navigate("/admin");
        } else {
          navigate("/perfil");
        }
      })
      .catch((error) => {
        if (error.code === "auth/invalid-credential") {
          executeBasicSweet(
            "Oops!",
            "Credenciales incorrectas",
            "error",
            "Cerrar",
          );
        }
      });
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  if (user) {
    return (
      <div className="container mt-5">
        <div className="alert alert-success text-center">
          Sesión iniciada como <strong>{user.email || user}</strong>
        </div>
        <form onSubmit={handleLogout} className="text-center">
          <button type="submit" className="btn btn-danger">
            Cerrar sesión
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mb-4 shadow-sm login-card">
            <div className="card-header">
              <h4 className="mb-0">Iniciar sesión</h4>
            </div>
            <div className="card-body">
              <form onSubmit={loginEmail}>
                <div className="mb-3">
                  <label className="form-label">E-mail</label>
                  <input
                    type="email"
                    className="form-control"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    required
                    placeholder="ejemplo@gmail.com"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Iniciar sesión
                </button>
              </form>
              <div className="mt-3 text-center">
                ¿No tenés una cuenta?{" "}
                <Link
                  to="/register"
                  className="text-white fw-bold text-decoration-underline"
                >
                  Crear cuenta
                </Link>
              </div>
              <div className="mt-3 text-center">
                ¿Olvidaste tu contraseña?{" "}
                <a
                  href="https://www.instagram.com/pinicrochet/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white fw-bold text-decoration-underline"
                >
                  Escribinos a nuestro Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <Footer />
    </div>
  );
}

export default Login;
