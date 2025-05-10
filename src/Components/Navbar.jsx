import { Link, useNavigate } from "react-router-dom";
import jwtDecode from "../Utils/jwtDecode"
import "../assets/css/Navbar.css";


export default function Navbar() {
  const navigate = useNavigate();
  const token = jwtDecode(sessionStorage.getItem("token"));

  function logOut() {
    sessionStorage.clear();
    if(token?.rol === "admin"){
      navigate("/admin")
    }
    window.location.reload();
    return;
  }

  return (
    <nav className="navbar navbar-expand-lg mb-4 rounded-navbar" >

      <br />
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img
            src="/assets/LOGOSDCapCut.png"
            alt="Street Dog Logo"
            width="140"
            height="30"
          />
        </a>
        <button
          className="navbar-toggler "
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ color: "black" }}

        >
          <span className="navbar-toggler-icon" style={{ filter: "invert(1)" }}></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent" style={{ color: "black" }}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/cliente" style={{ color: "black" }}>
                Clientes
              </Link>
            </li>
            {
              token?.rol === "admin" ?
                <>
                  <li className="nav-item dropdown">
                    <Link
                      className="nav-link dropdown-toggle"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{ color: "black" }}
                    >
                      Beneficios
                    </Link>
                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown" >
                      <li>
                        <Link className="dropdown-item" to="beneficios/crearbeneficio">
                          Crear
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="beneficios/verbeneficios">
                          Activos
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/appclientes" style={{ color: "black" }}>
                      Aplicación
                    </Link>
                  </li>
                </>
                :
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/puntos" style={{ color: "black" }}>
                      Puntos
                    </Link>
                  </li>
                </>
            }
            <li className="nav-item dropdown" style={{ color: "black" }}>
              <Link
                className="nav-link dropdown-toggle"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ color: "black" }}
              >
                Historial
              </Link>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown" >
                <li>
                  <Link className="dropdown-item" to="/compras">
                    Compras
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/canjes">
                    Canjes
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/ayuda" style={{ color: "black" }}>
                Soporte
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav mb-2 mb-lg-0">
            <li style={{ marginTop: "9px" }} className="d-flex flex-row flex-wrap align-content-end">
              <svg xmlns="http://www.w3.org/2000/svg" style={{ marginTop: "1px", marginRight: "4px" }} width="23" height="23" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
              </svg>
              <p style={{ marginTop: "2px" }}>
                {
                  sessionStorage.getItem("token")
                    ? jwtDecode(sessionStorage.getItem("token")).Usuario
                    : "Usuario no disponible"
                }
              </p>
            </li>
            <li className="nav-item">
              <button className="btn nav-link" onClick={() => logOut()} style={{ color: "black" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z" />
                  <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z" />
                </svg>

              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

  );
}
