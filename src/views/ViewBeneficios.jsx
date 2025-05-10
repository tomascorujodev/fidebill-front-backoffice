import { useEffect, useState } from "react";
import { DELETE, GET } from "../Services/Fetch";
import CardBenefit from "../Components/CardBenefit";
import { useParams, useSearchParams } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";

export default function ViewBeneficios({ setIsLoggedIn }) {
    const [beneficios, setBeneficios] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [eliminar, setEliminar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(0);
    const [message, setMessage] = useState("");
    const { empresa } = useParams();

    useEffect(() => {
        async function obtenerBeneficios() {
            let result = await GET("beneficios/obtenerbeneficios")
            if (!result) {
                if (navigator.onLine) {
                    setMessage("Ha ocurrido un problema. Por favor, espere unos instantes y vuelva a intentarlo")
                } else {
                    setMessage("Ups... no hay conexion a internet. Verifique la red y vuelva a intentarlo.")
                }
                setLoading(false);
                return;
            }
            switch (result.status) {
                case 200:
                    result = await result.json();
                    setBeneficios(result.beneficiosAgrupados);
                    break;
                case 204:
                    setMessage("Aun no tiene beneficios cargados. Publique beneficios para que sus clientes puedan aprovechar todas las promociones que tienen disponibles!🥳🥳🥳")
                    break;
                case 401:
                    localStorage.clear();
                    setMessage("Ups... parece que tus credenciales expiraron. Por favor, inicie sesion nuevamente");
                    setTimeout(() => {
                        window.location.replace(`/${empresa}`)
                    }, 4000)
                    break;
                case 500:
                    setMessage("Ha ocurrido un problema en el servidor. Aguardenos unos minutos y vuelva a intentarlo");
                    break;
                default:
                    setMessage("Ha ocurrido un problema en el servidor. Aguardenos unos minutos y vuelva a intentarlo");
                    break;
            }
            setLoading(false);
        }
        obtenerBeneficios();
    }, [reload])

    async function eliminarBeneficio() {
        setLoading(true)
        let result = await DELETE("beneficios/eliminarbeneficio", { IdBeneficio: eliminar })
        setEliminar(null);
        if (!result) {
            if (navigator.onLine) {
                setMessage("Ha ocurrido un problema. Por favor, espere unos instantes y vuelva a intentarlo. Si el problema persiste comuniquese con un administrador")
            } else {
                setMessage("Ups... no hay conexion a internet. Verifique la red y vuelva a intentarlo.")
            }
            setLoading(false);
            return;
        }
        switch (result.status) {
            case 200:
                result = await result.json();
                setMessage("El beneficio se ha eliminado correctamente");
                setReload(reload+1);
                break;
            case 204:
                setMessage("No se encontró el beneficio a eliminar. Si el problema persiste, por favor, contacte con un administrador.")
                break;
            case 401:
                localStorage.clear();
                setMessage("Ups... parece que tus credenciales expiraron. Por favor, inicie sesion nuevamente");
                setTimeout(() => {
                    window.location.replace(`/${empresa}`)
                }, 4000)
                break;
            case 500:
                setMessage("Ha ocurrido un problema en el servidor. Aguardenos unos minutos y vuelva a intentarlo");
                break;
            default:
                setMessage("Ha ocurrido un problema en el servidor. Aguardenos unos minutos y vuelva a intentarlo");
                break;
        }
        setLoading(false);
    }

    return (
        <div className="container">
            {
                loading ?
                    <div style={{ height: "670px" }} className="w-100 align-content-center">
                        <div style={{ justifySelf: "center", alignSelf: "center" }} className="d-flex spinner-border" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                    :
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))",
                    }}>
                        {
                            beneficios &&
                            beneficios.map(beneficio => (
                                <CardBenefit key={beneficio.idBeneficio} id={beneficio.idBeneficio} descripcion={beneficio.descripcion} titulo={beneficio.direccionLocal}
                                    tipo={beneficio.tipo}
                                    dias={beneficio.dias}
                                    porcentajeReintegro={beneficio.porcentajeReintegro}
                                    fechaInicio={beneficio.fechaInicio}
                                    fechaFin={beneficio.fechaFin}
                                    sucursales={beneficio.idsUsuariosEmpresas.map(sucursal => sucursal.nombreUsuarioEmpresa)}
                                    urlImagen={beneficio.urlImagen}
                                    eliminar={setEliminar}
                                />
                            ))
                        }
                    </div>
            }
            {message &&
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
                                    Aviso
                                </h5>
                            </div>
                            <div className="modal-body">
                                {message}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                    onClick={() => setMessage("")}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <Modal show={eliminar} onHide={() => setEliminar(null)}>
                <Modal.Header>
                    <Modal.Title>Advertencia</Modal.Title>
                </Modal.Header>
                <Modal.Body>Estas a punto de eliminar esta publicación de la vista de sus clientes. ¿Esta seguro que desea continuar?</Modal.Body>
                <Modal.Footer>
                    {!loading ?
                        <>
                            <Button variant="secondary" onClick={() => { setEliminar(null) }}>Cancelar</Button>
                            <Button variant="success" onClick={eliminarBeneficio}>Confirmar</Button>
                        </>
                        :
                        <div
                            style={{ justifySelf: "center" }}
                            className="d-flex spinner-border"
                            role="status"
                        >
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    }

                </Modal.Footer>
            </Modal>
        </div>
    );
}
