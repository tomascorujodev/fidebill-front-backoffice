import { useEffect, useState } from "react";
import { GET, POST } from "../Services/Fetch";
import { convertirFechaArgentina } from "../Utils/ConvertirFechas";
import Pagination from "../Components/Pagination";
import StatusLabel from "../Components/StatusLabel";
import Button from "../Components/Button";

export default function ViewCompras() {
  const [compras, setCompras] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(null);
  const [motivo, setMotivo] = useState("");

  useEffect(() => {
    if (busqueda) {
      filtarCompras();
    } else {
      obtenerCompras();
    }
  }, [page, busqueda]);

  async function obtenerCompras() {
    try {
      let response = await GET("puntos/obtenercompras", { page: page });
      if (response) {
        switch (response.status) {
          case 200:
            response = await response.json();
            setCompras(response.compras);
            setMensaje("");
            return;
          case 204:
            setMensaje("No hay compras cargados");
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
    } catch {
      setMensaje("Hubo un problema al intentar obtener las compras");
      setClientes([]);
    }
  }

  async function filtarCompras() {
    try {
      let compras = await GET("puntos/buscarcompras", { Page: page, Busqueda: busqueda });
      if (compras) {
        setMensaje("");
        compras = await compras.json();
        setCompras(compras.compras);
      }
    } catch {
      setMensaje("Hubo un problema al intentar obtener los compras");
    }
  }

  async function cancelarCompra() {
    try {
      let response = await POST("puntos/anulacioncompra", { IdaAnular: showModal, Motivo: motivo });
      if (response.status === 200) {
        setMensaje("Compra cancelada correctamente");
        setMotivo("");
        obtenerCompras();
      } else {
        setMensaje("Hubo un error al cancelar la compra");
      }
      setShowModal(false)
    } catch {
      setMensaje("Hubo un problema al intentar cancelar la compra");
      setShowModal(false)
    }
  }

  return (
    <>
      <div className="container">
      <div style={{boxShadow: "rgb(0 0 0 / 40%) 0px 1rem 2rem"}} className="card-rounded">
        <h2>Historial de Compras</h2>
        <br />
          <input
            className="form-control me-2"
            type="search"
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar compra"
            aria-label="Buscar compra"
          />
        </div>
        <div className="card-rounded">

        {mensaje && <div className="alert alert-info mt-3">{mensaje}</div>}
        <br />
        <table className="table">
          <thead>
            <tr>
              <th className="text-center" scope="col">Nombre</th>
              <th className="text-center" scope="col">Apellido</th>
              <th className="text-center" scope="col">Documento</th>
              <th className="text-center" scope="col">Fecha y hora</th>
              <th className="text-center" scope="col">Estado</th>
              <th className="text-center" scope="col">Monto</th>
              <th className="text-center" scope="col">Puntos agregados</th>
              <th className="text-center" scope="col">Puntos Actuales</th>
              <th className={"text-center"} scope="col" title="La opcion de cancelar una compra solo estara disponible si el cliente tiene puntos suficientes para ello, o si la compra esta activa">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-question-circle" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                  <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/>
                </svg>
              </th>
            </tr>
          </thead>
          <tbody>
            {compras?.map((compra, index) => (
              <tr key={`${compra.fechaCompra}` + index}>
                <td className="text-center">{compra.nombre}</td>
                <td className="text-center">{compra.apellido}</td>
                <td className="text-center">{compra.documento}</td>
                <td className="text-center">{convertirFechaArgentina(compra?.fechaCompra)}</td>
                <td className="text-center">{<StatusLabel status={compra.estadoCompra} />}</td>
                <td className="text-center">{compra.monto}</td>
                <td className="text-center">{compra.puntosAgregados}</td>
                <td className="text-center">{compra.puntos}</td>
                <td className="text-center">
                  <Button
                    text={"Cancelar"}
                    className="btn btn-danger"
                    onClick={() => setShowModal(compra.idCompra)}
                    disabled={compra.estadoCompra === 0 || (compra.puntos < compra.puntosAgregados)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination currentPage={page} onPageChange={setPage} />
      </div>
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
                <h5 className="modal-title">Confirmar cancelación</h5>
                <Button text="" className="btn-close" onClick={() => setShowModal(null)} />
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que deseas cancelar esta compra? Esta acción no se puede deshacer.</p>
                <div className="form-group">
                  <label htmlFor="motivo">Motivo de la cancelación:</label>
                  <textarea id="motivo" className="form-control" value={motivo} onChange={e => setMotivo(e.target.value)} rows="4" placeholder="Escriba el motivo aquí"/>
                </div>
              </div>
              <div className="modal-footer">
                <Button text="Cancelar" className="btn-secondary" onClick={() => setShowModal(null)} />
                <Button text="Confirmar" className="btn-danger" onClick={cancelarCompra} />
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
    </>
  );
}
