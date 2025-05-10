import React, { useEffect, useState } from "react";
import { GET, POST } from "../Services/Fetch";
import Card from "../Components/Card";
import Button from "../Components/Button";
import "../assets/CSS/ViewPuntos.css";
import imprimirComprobante from "../Utils/imprimirComprobante";
import CheckOnline from "../Utils/CheckOnline";

export default function ViewPuntos() {
  const [documento, setDocumento] = useState("");
  const [cliente, setCliente] = useState(null);
  const [opcionPuntos, setOpcionPuntos] = useState(0);
  const [montoCompra, setMontoCompra] = useState(0);
  const [cantidadPuntos, setCantidadPuntos] = useState(0);
  const [reintegroOpciones, setReintegroOpciones] = useState([3]);
  const [porcentajeAplicado, setPorcentajeAplicado] = useState(3);
  const [mensaje, setMensaje] = useState("");
  const [fadeClass, setFadeClass] = useState("fade-out");
  const [effectId, setEffectId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      try {
        let response = await GET("puntos/obtenerbeneficiosactivos");
        if (!response) {
          setMensaje(CheckOnline());
        } else {
          switch (response.status) {
            case 200:
              response = await response.json();
              setReintegroOpciones([3, ...response]);
              break;
            case 401:
              setMensaje("Sus credenciales expiraron, por favor, vuelva a iniciar sesion.");
              break;
            case 500:
              setMensaje("Hubo un problema en el servidor. Por favor, contacte con un administrador");
              break;
            default:
              setMensaje("Hubo un problema. Por favor, contacte con un administrador");
              break;
          }
        }
      } catch (error) {
        setMensaje("Parece que ocurrió un problema. Reintente a la brevedad. Si el problema persiste, por favor, contacte con un administrador");
        setCliente(null);
      } finally{
        setIsLoading(false);
      }
    })()
  }, []);

  useEffect(() => {
    setMontoCompra(0);
    setCantidadPuntos(0);
  }, [opcionPuntos]);

  useEffect(() => {
    if (effectId) {
      clearTimeout(effectId);
    }
    if (mensaje) {
      setFadeClass("fade-out");
      setEffectId(
        setTimeout(() => {
          setFadeClass("fade-out hide");
          setTimeout(() => {
            setMensaje("");
            setFadeClass("fade-out");
          }, 1000);
        }, 10000)
      );
    }
  }, [mensaje]);

  async function buscarCliente() {
    if (documento.length < 4) {
      setMensaje("Ingrese al menos 4 números");
      return;
    }
    setIsLoading(true);
    try {
      let response = await GET("clientes/buscarclientepordocumento", { busqueda: documento });
      if (!response) {
        setMensaje(CheckOnline());
      } else {
        switch (response.status) {
          case 200:
            let client = await response.json();
            setCliente(client);
            break;
          case 204:
            setMensaje("No se encontró ningún cliente, verifique el DNI");
            break;
          case 401:
            setMensaje("Sus credenciales expiraron, por favor, vuelva a iniciar sesion.");
            break;
          case 500:
            setMensaje("Hubo un problema en el servidor. Por favor, contacte con un administrador");
            break;
          default:
            setMensaje("Hubo un problema. Por favor, contacte con un administrador");
            break;
        }
      }
    } catch (error) {
      setMensaje("Hubo un problema al intentar obtener el cliente");
      setCliente(null);
      setIsLoading(false);
    }
    setIsLoading(false);
  }

  async function imprimirCompra() {
    let cuerpo;
    if (opcionPuntos === 1) {
      cuerpo = [`MONTO COMPRA: ${montoCompra}`, `PUNTOS DE LA COMPRA: ${Math.round(montoCompra * (porcentajeAplicado/ 100))}`]
      await imprimirComprobante({ documento: cliente?.documento, nombre: cliente?.nombre, apellido: cliente?.apellido, cuerpo: cuerpo, puntos: cliente?.puntos + Math.round(montoCompra * (porcentajeAplicado/ 100)) })
    } else {
      cuerpo = [`PUNTOS CANJEADOS: ${cantidadPuntos}`]
      await imprimirComprobante({ documento: cliente?.documento, nombre: cliente?.nombre, apellido: cliente?.apellido, cuerpo: cuerpo, puntos: cliente?.puntos - cantidadPuntos })
    }
    setCliente(null); setOpcionPuntos(0); setMontoCompra(0); setCantidadPuntos(0); setShowModal(false); setDocumento("");
  }

  async function cargarPuntos() {
    if (montoCompra >= 30) {
      setIsLoading(true);
      try {
        let response = await POST(`puntos/cargarcompra`, {
          IdCliente: cliente.idCliente,
          MontoCompra: (Math.round(montoCompra * 100) / 100),
          porcentajeAplicado: porcentajeAplicado
        });
        if (!response) {
          setMensaje("Ha ocurrido un error, verifique su conexión a internet");
        } else {
          switch (response.status) {
            case 200:
              setModalText(`Se cargaron correctamente "${(Math.round(montoCompra * (porcentajeAplicado/ 100)) )}" puntos a "${cliente?.nombre} ${cliente?.apellido}"`)
              setShowModal(true);
              break;
            case 204:
              setMensaje("No se encontró ningún cliente, verifique el DNI");
              break;
            case 401:
              setMensaje("Sus credenciales expiraron, por favor, vuelva a iniciar sesion.");
              break;
            case 500:
              setMensaje("Hubo un problema en el servidor. Por favor, contacte con un administrador");
              break;
            default:
              setMensaje("Hubo un problema. Por favor, contacte con un administrador");
              break;
          }
        }
        setIsLoading(false);
      } catch (error) {
        setMensaje("Ocurrio un error al intentar cargar la compra");
        setIsLoading(false);
      }
    } else {
      setMensaje("El monto debe ser mayor.");
    }
  }

  const canjearPuntos = async () => {
    if (cantidadPuntos > 0 && cantidadPuntos <= cliente.puntos) {
      try {
        let response = await POST("puntos/cargarcanje", {
          IdCliente: cliente.idCliente,
          Puntos: cantidadPuntos,
        });
        if (!response) {
          setMensaje("Ha ocurrido un error, verifique su conexión a internet");
        } else {
          switch (response.status) {
            case 200:
              setModalText(`Se canjearon correctamente "${cantidadPuntos}" puntos a "${cliente?.nombre} ${cliente?.apellido}"`)
              setShowModal(true);
              return;
            case 204:
              setMensaje("No se encontró ningún cliente, verifique el DNI");
              return;
            case 401:
              setMensaje("Sus credenciales expiraron, por favor, vuelva a iniciar sesion.");
              return;
            case 500:
              setMensaje("Hubo un problema en el servidor. Por favor, contacte con un administrador");
              return;
            default:
              setMensaje("Hubo un problema. Por favor, contacte con un administrador");
              return;
          }
        }
      } catch (error) {
        setMensaje("Error al realizar el canje.");
      }
    } else {
      setMensaje("Cantidad de puntos no válida.");
    }
  };

  return (
    <div className="container mt-2">
      <div style={{ boxShadow: "rgb(0 0 0 / 40%) 0px 1rem 2rem" }} className="card-rounded">
        <h2>Gestión de Puntos</h2>
        <br />
        <label htmlFor="documento" className="form-label">
          Documento del Cliente
        </label>
        <div className="d-flex mb-4">
          <input
            type="text"
            className="form-control w-75"
            id="documento"
            value={documento}
            onChange={e => setDocumento(e.target.value)}
          />
          <button
            style={{ width: "25%", minHeight: "2rem", maxHeight: "4rem" }}
            className="btn btn-primary ms-2 center"
            onClick={buscarCliente}
            disabled={isLoading}
          >
            Buscar Cliente
          </button>
        </div>
        {cliente && (
          <span>
            <h5 className="card-title mb-4">
              {cliente.nombre} {cliente.apellido}, DNI: {cliente.documento}
            </h5>
            <button
              className={`btn p-3 me-4 ${opcionPuntos === 1 ? "btn-success active" : "btn-outline-success"}`}
              onClick={() => {
                setOpcionPuntos(1);
              }}
            >
              Cargar Puntos
            </button>
            <button
              className={`btn p-3 ${opcionPuntos === 2 ? "btn-warning active" : "btn-outline-warning"}`}
              onClick={() => {
                setOpcionPuntos(2);
              }}
            >
              Canjear Puntos
            </button>
          </span>
        )}

        {mensaje && <div className={`alert alert-info mt-3 ${fadeClass}`}>{mensaje}</div>}
      </div>

      {opcionPuntos !== 0 && (
        <>
          <br />
          <div className="card-rounded">
            {opcionPuntos === 1 && (
              <Card
                title={cliente?.nombre + " " + cliente?.apellido}
                subtitle={"Puntos disponibles: " + cliente?.puntos}
                label={"Ingrese el monto de la compra"}
                setValue={setMontoCompra}
                value={montoCompra}
                reintegroOpciones={reintegroOpciones}
                setPorcentajeAplicado={setPorcentajeAplicado}
              >
                <Button text={"Cargar Compra"} onClick={cargarPuntos} disabled={isLoading} />
              </Card>
            )}
            {opcionPuntos === 2 && (
              <Card
                title={cliente?.nombre + " " + cliente?.apellido}
                subtitle={"Puntos disponibles: " + cliente?.puntos}
                label={"Ingrese los puntos a canjear"}
                setValue={setCantidadPuntos}
                value={cantidadPuntos}
              >
                <Button text={"Canjear Puntos"} className="btn-warning" onClick={canjearPuntos} disabled={isLoading} />
              </Card>
            )}
          </div>
        </>
      )}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050 }}
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog" style={{ maxWidth: "800px", top: "50%", transform: "translate(-0%, -50%)", margin: "auto" }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Carga Existosa</h5>
              </div>
              <div className="modal-body">
                <p>{modalText}</p>
                <p>¿Desea imprimir ticket de cliente?</p>
              </div>
              <div className="modal-footer">
                <Button text="No, gracias" className="btn-danger" onClick={() => {
                  setCliente(null); setOpcionPuntos(0); setMontoCompra(0); setCantidadPuntos(0); setShowModal(false); setDocumento("");
                }} />
                <Button text="Sí, imprimir" className="btn-success" onClick={imprimirCompra} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
