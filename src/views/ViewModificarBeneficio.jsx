import { useEffect, useState } from "react";
import { GET, PATCHFormData } from "../Services/Fetch";
import { Modal, Button } from "react-bootstrap";
import CheckInput from "../Components/CheckInput";
import jwtDecode from "../Utils/jwtDecode";
import CardBenefit from "../Components/CardBenefit";
import { useLocation, useNavigate } from "react-router-dom";
import { convertirFechaIngles } from "../Utils/ConvertirFechas";

export default function ViewModificarBeneficio() {
  const location = new URLSearchParams(useLocation().search)
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [tipo, setTipo] = useState("");
  const [porcentajeReintegro, setPorcentajeReintegro] = useState(3);
  const [descripcion, setDescripcion] = useState("");
  const [dias, setDias] = useState([false, false, false, false, false, false, false]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [habilitarFechaInicio, setHabilitarFechaInicio] = useState(true);
  const [habilitarFechaFin, setHabilitarFechaFin] = useState(true);
  const [urlImagen, setUrlImagen] = useState(null);
  const [UrlImagenEliminar, setUrlImagenEliminar] = useState(null);
  const [imagenPromocion, setImagenPromocion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [sucursales, setSucursales] = useState();
  const [sucursalesConId, setSucursalesConId] = useState(null);
  const [sucursalesDisponibles, setSucursalesDisponibles] = useState([]);
  const [selectedSucursal, setSelectedSucursal] = useState("");
  const [isConfirmation, setIsConfirmation] = useState(false);
  const [modifiedStates, setModifiedStates] = useState({ tipo: false, porcentajeReintegro: false, descripcion: false, dias: false, fechaInicio: false, sucursales: false, fechaFin: false, imagenPromocion: false, UrlImagenEliminar: false });
  const navigate = useNavigate();
  useEffect(() => {
    async function cargaInicial() {
      let locales = await GET("beneficios/obtenerlocales");
      let beneficio = await GET("beneficios/buscarbeneficioporid", { id: location.get("id") });
      if (locales && beneficio) {
        locales = await locales.json();
        setSucursalesConId(locales);
        beneficio = await beneficio.json();
        beneficio = beneficio.beneficioAgrupado;
        let nombresEmpresas = [];
        beneficio.idsUsuariosEmpresas.map(nombreEmpresa => {
          nombresEmpresas.push(nombreEmpresa.nombreUsuarioEmpresa);
        })
        let tmp = [];
        locales.map(local => {
          let flag = false;
          nombresEmpresas.map(nombreUsuarioEmpresa => {
            if (local.direccionLocal === nombreUsuarioEmpresa) {
              flag = true;
            }
          })
          if (!flag) {
            tmp.push(local.direccionLocal);
          }
        })
        if (nombresEmpresas.length === 0) { nombresEmpresas.push("Todas") };
        setSucursales(nombresEmpresas);
        if (nombresEmpresas != "Todas") {
          tmp.push("Todas");
        }
        setSucursalesDisponibles(tmp);

        setTipo(beneficio.tipo);
        setPorcentajeReintegro(beneficio.porcentajeReintegro);
        setDescripcion(beneficio.descripcion);
        setDias(beneficio.dias);
        setFechaInicio(convertirFechaIngles(beneficio.fechaInicio));
        setFechaFin(convertirFechaIngles(beneficio.fechaFin));
        setHabilitarFechaInicio(beneficio.fechaInicio ? true : false);
        setHabilitarFechaFin(beneficio.fechaFin ? true : false);
        setUrlImagenEliminar(beneficio.urlImagen);
        setUrlImagen(beneficio.urlImagen);
        setLoadingPage(false);
      } else {
        if (navigator.onLine) {
          setMessage("El servidor no responde. Por favor vuelva a intentarlo en unos minutos. Si el problema persiste contáctese con un administrador");
        } else {
          setMessage("Se perdio la conexion a internet");
        }
        setShowModal(true);
      }
    }
    cargaInicial();
  }, []);

  function handleChangeDays(e) {
    const newDias = [...dias];
    newDias[e.target.name] = e.target.checked;
    setDias(newDias);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (habilitarFechaInicio && !fechaInicio) {
      setMessage("La fecha de inicio aun no ha sido establecida");
      setShowModal(true);
      return;
    }

    if (habilitarFechaFin && !fechaFin) {
      setMessage("La fecha de fin aun no ha sido establecida");
      setShowModal(true);
      return;
    }

    if (habilitarFechaFin && new Date(fechaFin) < new Date()) {
      setMessage("La fecha de fin debe ser posterior a la fecha actual");
      setShowModal(true);
      return;
    }

    if ((habilitarFechaFin && habilitarFechaInicio) && (new Date(fechaInicio) >= new Date(fechaFin))) {
      setMessage("La fecha de fin debe ser posterior a la fecha de inicio");
      setShowModal(true);
      return;
    }

    if (!dias.some(value => value === true)) {
      setMessage("Debe seleccionar al menos un dia de la semana");
      setShowModal(true);
      return;
    }

    if (sucursales.length === 0) {
      setMessage("Debe seleccionar al menos una sucursal para aplicar su beneficio");
      setShowModal(true);
      return;
    }

    if (Object.values(modifiedStates).every(value => value === false)) {
      setMessage("No se ha modificado ningún dato. Por favor, realice algún cambio antes de continuar.");
      setShowModal(true);
      return;
    }

    if (!isConfirmation) {
      setIsConfirmation(true);
      setMessage("Está a punto de modificar una publicación visible para sus clientes. Por favor, verifique que todos los datos sean correctos antes de continuar. ¿Desea publicar?");
      setShowModal(true);
      return
    }

    setIsConfirmation(false)

    setIsLoading(true);
    try {
      let tmp = [];
      if ((sucursalesDisponibles[0] === 'Todas' && sucursalesDisponibles.length === 1) || (sucursales[0] === 'Todas' && sucursales.length === 1)) {
        tmp = null
      } else {
        sucursales.map(sucursal => {
          sucursalesConId.map(sucursalConId => {
            if (sucursalConId.direccionLocal === sucursal) {
              tmp.push(sucursalConId.idUsuarioEmpresa);
            }
          })
        });
      }
      let response = await PATCHFormData(
        "beneficios/modificarbeneficio",
        modifiedStates.imagenPromocion && imagenPromocion ? imagenPromocion : null,
        {
          IdBeneficio: location.get("id"),
          Tipo: modifiedStates.tipo ? tipo : null,
          Descripcion: modifiedStates.descripcion ? descripcion : null,
          Dias: modifiedStates.dias ? dias : null,
          PorcentajeReintegro: modifiedStates.porcentajeReintegro && tipo === "Reintegro de puntos" ? porcentajeReintegro : null,
          FechaInicio: habilitarFechaInicio && modifiedStates.fechaInicio ? fechaInicio : null,
          FechaFin: habilitarFechaFin && modifiedStates.fechaFin ? fechaFin : null,
          Sucursales: modifiedStates.sucursales ? (tmp ? tmp : "Todas") : null,
          UrlImagenEliminar: (modifiedStates.UrlImagenEliminar || modifiedStates.imagenPromocion) && UrlImagenEliminar ? UrlImagenEliminar : null
        }
      );
      if (response) {
        switch (response.status) {
          case 200:
            setMessage("La promocion se ha modificado correctamente.");
            setLoadingPage(true)
            setTimeout(() => {
              navigate("/beneficios/verbeneficios");
            }, 4000)
            break;
          case 400:
            setMessage("Verifique que todos los campos sean correctos y vuelva a intentarlo");
            break;
          case 401:
            setMessage("Su sesion expiro. Por favor, vuelva a iniciar sesion");
            break;
          case 500:
            setMessage("No se pudo procesar su petición. Por favor, contacte con un administrador");
            break;
          default:
            response = await response.json();
            setMessage(response.message);
            break;
        }
      } else {
        if (navigator.onLine) {
          setMessage("El servidor no responde. Por favor vuelva a intentarlo en unos minutos. Si el problema persiste contáctese con un administrador");
        } else {
          setMessage("Se perdio la conexion a internet");
        }
      }
      setShowModal(true);
    } catch {
      setMessage("¡ups! Hubo un error al intentar procesar su peticion. Por favor intentelo nuevamente, y si el error persiste, contacte con un administrador.");
      setShowModal(true);
      setIsLoading(false);
    }
    setIsLoading(false);
  }

  function handleUploadImage(e) {
    let archivo = e.target.files[0];
    if (archivo && ["image/jpeg", "image/png", "image/svg+xml"].includes(archivo.type)) {
      if (archivo.size <= 1048576) {
        setImagenPromocion(archivo);
        setUrlImagen(URL.createObjectURL(archivo));
        handleInputChange("imagenPromocion")
      } else {
        setMessage("La imagen excede el tamaño máximo permitido de 1MB");
        setShowModal(true);
        setImagenPromocion(null)
        setUrlImagen(null)
        e.target.value = null;
      }
    } else {
      setMessage("El formato de archivo no es compatible");
      setShowModal(true);
      setUrlImagen(null)
      setImagenPromocion(null)
      e.target.value = "";
    }
  }

  function handleSelectSucursal(e) {
    let selectedValue = e.target.value;
    if (selectedValue == "Todas") {
      let tmp = [...sucursales];
      sucursalesDisponibles.map(sucursalDisponible => {
        if (sucursalDisponible !== "Todas")
          tmp.push(sucursalDisponible);
      })
      setSucursalesDisponibles(tmp);
      setSucursales(["Todas"]);
    } else if (!sucursales.includes("Todas")) {
      setSelectedSucursal("");
      setSucursales([...sucursales, selectedValue]);
      setSucursalesDisponibles(sucursalesDisponibles.filter((sucural) => sucural !== selectedValue));
    }
  }

  function handleRemoveSucursal(e) {
    let sucursalAEliminar = e.target.name;
    setSucursales(sucursales.filter((sucural) => sucural !== sucursalAEliminar));
    let tmp = sucursalesDisponibles;
    tmp.push(sucursalAEliminar)
    setSucursalesDisponibles(tmp);
  }

  function handleInputChange(field) {
    setModifiedStates(prevState => ({
      ...prevState,
      [field]: true
    }));
  };
  return (
    <div className="container">
      {loadingPage ?
        <div style={{ height: "670px" }} className="w-100 align-content-center">
          <div style={{ justifySelf: "center", alignSelf: "center" }} className="d-flex spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
        :
        <div className="card p-4 mb-4" style={{ display: "grid", gridTemplateColumns: "250px 1fr 1fr 1fr", gridTemplateRows: "80px 80px 100px 50px 100px 160px 90px 800px" }}>
          <h2 style={{ gridColumn: "1", gridRow: "1" }}>Beneficios</h2>
          <h3 style={{ gridColumn: "1", gridRow: "2" }}>Tipo(*)</h3>
          <h3 style={{ gridColumn: "1", gridRow: "3" }}>Descripcion(*)</h3>
          <h3 style={{ gridColumn: "1", gridRow: "4" }}>Fecha</h3>
          <h3 style={{ gridColumn: "1", gridRow: "6" }}>Sucursales</h3>
          <h3 style={{ gridColumn: "1", gridRow: "7" }}>Imagen</h3>
          <div style={{ gridColumn: "1", gridRow: "8" }}>
            <h3>Vista Previa</h3>
            <p style={{ color: "gray" }}>📌 Recomendación: Para una mejor visualización, sube imágenes con una relación de aspecto 4:3 (Ejemplo: 1200x900, 800x600, 400x300).</p>
          </div>
          <select style={{ gridColumn: "2", gridRow: "2", display: "flex", height: "40px" }} className="form-control" id="Tipo" name="tipo" value={tipo} onChange={e => {
            setTipo(e.target.value); handleInputChange(e.target.name)
          }}>
            <option value="">Selecciona una opción</option>
            <option value="Reintegro de puntos">Reintegro de puntos</option>
            <option value="Promocion">Promoción</option>
          </select>
          {tipo === "Reintegro de puntos" &&
            <span style={{ gridColumn: "3", gridRow: "2", display: "flex", height: "40px", width: "80px", alignItems: "center" }} className="d-flex flex-row align-content-center">
              <span style={{ marginInline: "8px" }}>%</span>
              <input style={{ width: "70px" }} type="number" min="3" max="100" className="form-control" id="PorcentajeReintegro" name="porcentajeReintegro" value={porcentajeReintegro} onChange={e => { setPorcentajeReintegro(e.target.value); handleInputChange(e.target.name) }} />
            </span>
          }
          <div style={{ gridColumn: "2 / 5", gridRow: "3" }} className="mb-3">
            <textarea style={{ maxHeight: "95px" }} className="form-control" maxLength="1500" id="Descripcion" name="descripcion" value={descripcion} onChange={e => { setDescripcion(e.target.value); handleInputChange(e.target.name) }} />
          </div>
          <div style={{ gridColumn: "2 / 5", gridRow: "4" }}>
            <CheckInput value={dias[0]} dia={"L"} name={"0"} evento={(e) => { handleChangeDays(e); handleInputChange("dias") }} />
            <CheckInput value={dias[1]} dia={"M"} name={"1"} evento={(e) => { handleChangeDays(e); handleInputChange("dias") }} />
            <CheckInput value={dias[2]} dia={"X"} name={"2"} evento={(e) => { handleChangeDays(e); handleInputChange("dias") }} />
            <CheckInput value={dias[3]} dia={"J"} name={"3"} evento={(e) => { handleChangeDays(e); handleInputChange("dias") }} />
            <CheckInput value={dias[4]} dia={"V"} name={"4"} evento={(e) => { handleChangeDays(e); handleInputChange("dias") }} />
            <CheckInput value={dias[5]} dia={"S"} name={"5"} evento={(e) => { handleChangeDays(e); handleInputChange("dias") }} />
            <CheckInput value={dias[6]} dia={"D"} name={"6"} evento={(e) => { handleChangeDays(e); handleInputChange("dias") }} />
          </div>
          <div style={{ gridColumn: "2 / 4", gridRow: "5" }} className="mb-3 d-flex align-content-center">
            <div>
              <label htmlFor="CheckFechaInicio" className="pe-4">Fecha de Inicio</label>
              <input type="checkbox" id="CheckFechaInicio" name="fechaInicio" checked={habilitarFechaInicio} onChange={(e) => { setHabilitarFechaInicio(!habilitarFechaInicio); handleInputChange(e.target.name) }} />
              <input type="date" className="form-control" id="FechaInicio" name="fechaInicio" value={fechaInicio} onChange={e => { setFechaInicio(e.target.value); handleInputChange(e.target.name) }} disabled={!habilitarFechaInicio} />
            </div>
            <div className="d-flex p-3 mt-3">
              -
            </div>
            <div>
              <label htmlFor="CheckFechaFin" className="pe-4">Fecha de Fin</label>
              <input type="checkbox" id="CheckFechaFin" name="fechaFin" checked={habilitarFechaFin} onChange={(e) => { setHabilitarFechaFin(!habilitarFechaFin); handleInputChange(e.target.name) }} />
              <input type="date" className="form-control" name="fechaFin" value={fechaFin} onChange={e => { setFechaFin(e.target.value); handleInputChange(e.target.name) }} disabled={!habilitarFechaFin} />
            </div>
          </div>
          <div style={{ gridColumn: "2 / 5", gridRow: "6", maxHeight: "150px" }} className="mb-3">
            <select className="form-control" id="Sucursales" name="sucursales" value={selectedSucursal} onChange={(e) => { handleSelectSucursal(e); handleInputChange(e.target.name) }}>
              <option value="" disabled>
                Seleccione una sucursal
              </option>
              {sucursalesDisponibles.map((sucursal, index) => (
                <option key={index} value={sucursal}>
                  {sucursal}
                </option>
              ))}
            </select>
            <div className="mt-2 border p-2" style={{ minHeight: "50px" }}>
              {sucursales.map((sucursal, index) => (
                <span key={index} style={{ fontSize: "14px" }} className="badge bg-light text-dark me-2 mb-2">
                  {sucursal} <button name={sucursal} type="button" style={{ background: "transparent", border: "none", color: "#e06971", fontSize: "20px" }} onMouseEnter={(e) => e.target.style.color = "#ff0000"}
                    onMouseLeave={(e) => e.target.style.color = "#dc3545"} className="btn btn-sm btn-danger ms-2" onClick={(e) => { handleRemoveSucursal(e); handleInputChange("sucursales") }}>X</button>
                </span>
              ))}
            </div>
          </div>
          <div style={{ gridColumn: "2 / 4", gridRow: "7" }} className="mb-3">
            <input type="file" className="form-control" accept="image/png, image/jpeg, image/svg+xml" onChange={handleUploadImage} />
          </div>
          <div style={{ gridColumn: "4 / 4", gridRow: "7" }} className="mb-3 mx-4">
            <button className="btn btn-danger" name="UrlImagenEliminar" onClick={(e) => { handleInputChange(e.target.name); setUrlImagen(null); setImagenPromocion(null); }}>Eliminar imagen</button>
          </div>
          <div style={{ gridColumn: "1 / 4", gridRow: "8" }} className="mb-3">
            <CardBenefit descripcion={descripcion} titulo={descripcion}
              tipo={tipo}
              dias={dias}
              porcentajeReintegro={tipo === "Reintegro de puntos" && porcentajeReintegro}
              fechaInicio={habilitarFechaInicio && fechaInicio}
              fechaFin={habilitarFechaFin && fechaFin}
              sucursales={sucursales}
              urlImagen={urlImagen}
            />
          </div>
          <div className="d-flex aling-content-center justify-content-center" style={{ gridColumn: "4/5", gridRow: "8" }}>
            {
              isLoading ?
                <div className="spinner-border mt-4 mr-4" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                :
                <button style={{ gridColumn: "5", gridRow: "8", justifySelf: "self-end", width: "150px", height: "60px" }} className="btn btn-success mt-1" onClick={handleSubmit}>Actualizar Beneficio</button>}
          </div>
        </div>
      }
      {
        isLoading ?
          <Modal show={showModal} onHide={() => { setShowModal(false); setIsConfirmation(false) }}>
            <Modal.Body style={{ alignSelf: "center" }} >
              {
                <div className="spinner-border mt-4 mr-4" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              }
            </Modal.Body>
          </Modal>
          :
          <Modal show={showModal} onHide={() => { setShowModal(false); setIsConfirmation(false) }}>
            <Modal.Header closeButton>
              <Modal.Title>{isConfirmation ? "Confirmación" : "Error"}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ alignSelf: "center" }}>{message}</Modal.Body>
            <Modal.Footer>
              {isConfirmation ?
                <>
                  <Button variant="secondary" onClick={() => { setShowModal(false); setIsConfirmation(false) }}>Cancelar</Button>
                  <Button variant="success" onClick={handleSubmit}>Confirmar</Button>
                </>
                :
                <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
              }
            </Modal.Footer>
          </Modal>
      }
    </div>
  );
}
