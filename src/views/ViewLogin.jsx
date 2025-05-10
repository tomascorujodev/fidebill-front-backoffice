import React, { useState } from "react";
import "../assets/CSS/ViewLogin.css";
import { POST } from "../Services/Fetch";
import { useLocation } from "react-router-dom";

export default function ViewLogin({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const location = useLocation()
  const isAdmin = location.pathname.startsWith("/admin");

  async function handleSubmit(e) {
    e?.preventDefault();
    setIsLoading(true);
    try {
      let response = await POST(isAdmin ? "auth/admin" : "auth/login", { Username: username, Password: password });
      setIsLoading(false);
      if (response) {
        switch (response.status) {
          case 200:
            response = await response.json();
            sessionStorage.setItem("token", response.token);
            setIsLoggedIn(true);
            setMensaje("");
            return;
          case 204:
            setMensaje("No hay clientes cargados");
            return;
          case 401:
            setMensaje("Usuario y contraseña incorrectos");
            return;
            setMensaje("Hubo un problema en el servidor. Por favor, contacte con un administrador");
            return;
          default:
            setMensaje("Hubo un problema. Por favor, contacte con un administrador");
            return;
        }
      } else {
        if (navigator.onLine) {
          setMensaje("El servidor no responde. Por favor, espere unos instantes y vuelva a intentarlo, si el error persiste contactese con un administrador");
        } else {
          setMensaje("No hay conexion a internet, verifique la red y vuelva a intentarlo");
        }
      }
    } catch {
      setMensaje("Hubo un problem iniciar sesion. Por favor, contacte con un administrador.");
      setIsLoading(false);
    }
  }

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex flex-column align-items-center justify-content-center">
      <img
        src="/assets/Backoffice.png"
        alt="Fidebill Logo"
        height="50"
        className="mb-2"
      />
      {
        isAdmin &&
        <img
          src="/assets/Administrador.png"
          alt="Icono Administrador"
          style={{marginBlock: "16px"}}
          width="200"
        />
      }
      <br />
      <div className="card-rounded" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body p-5">
          <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Nombre de Usuario
              </label>
              <input
                type="text"
                className="form-control custom-input"
                id="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Ingrese su nombre de usuario"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <input
                type="password"
                className="form-control custom-input"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Ingrese su contraseña"
                required
              />
            </div>
            {
              isLoading ?
                <div className="d-flex justify-content-center mt-3">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
                :
                <button type="submit" className="btn btn-primary w-100 mt-3 custom-button">
                  Iniciar Sesión
                </button>
            }
          </form>
          <div className="text-center mt-3">
            <a href="#" className="text-decoration-none">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>
      </div>
      {mensaje &&
        <div
          className="modal fade show"
          tabIndex="-1"
          aria-labelledby="modalMessageLabel"
          style={{ display: "block", paddingRight: "17px" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modalMessageLabel">
                  Mensaje
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setMensaje("")}
                ></button>
              </div>
              <div className="modal-body">
                {mensaje}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => setMensaje("")}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      }
      <br />
      <div>
        <img
          src="/assets/PoweredByFidebill.png"
          alt="FideBill Logo"
          width="238"
          height="44"
        />
      </div>
    </div>
  );
};
