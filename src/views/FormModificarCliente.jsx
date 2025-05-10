import { useEffect, useState } from "react";
import { GET, PATCH } from "../Services/Fetch";
import { Modal, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { convertirFechaIngles } from "../Utils/ConvertirFechas";
import { RegexValidations } from "../Utils/RegexValidations";

export default function FormModificarCliente() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    documento: "",
    fechaNacimiento: "",
    genero: "Masculino",
    tipoCliente: "Consumidor Final",
    email: "",
    direccion: "",
    telefono: "",
  });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);
  const { id } = useParams();
  const validaciones = RegexValidations;
  const navigate = useNavigate();
  useEffect(() => {
    async function buscarcliente() {
      try {
        let response = await GET("clientes/buscarclienteporid", { id });
        if (response) {
          switch (response.status) {
            case 200:
              response = await response.json();
              delete response.idCliente;
              response.fechaNacimiento = convertirFechaIngles(
                response.fechaNacimiento
              );
              setFormData(response);
              setMessage("");
              return;
            case 204:
              setMessage(
                "No se puedo encontrar el cliente, verifique si no fue modificado o eliminado"
              );
              break;
            case 401:
              setMessage(
                "Sus credenciales expiraron, por favor, vuelva a iniciar sesion."
              );
              break;
            case 500:
              setMessage(
                "Hubo un problema en el servidor. Por favor, contacte con un administrador"
              );
              break;
            default:
              setMessage(
                "Hubo un problema. Por favor, contacte con un administrador"
              );
              break;
          }
          setShowModal(true);
        }
      } catch {
        setMessage("Hubo un problema al intentar obtener los clientes");
        setShowModal(true);
      }
    }
    buscarcliente();
  }, []);

  function handleChange(e) {
    let { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (validaciones[name].test(value)) {
      setErrors({ ...errors, [name]: false });
    } else {
      setErrors({ ...errors, [name]: true });
    }
  }

  function handleClose() {
    setShowModal(false);
    if (ok) {
      navigate("/cliente");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    let newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (!validaciones[key].test(formData[key])) {
        newErrors[key] = true;
        isValid = false;
      }
    });

    setErrors(newErrors);
    if (isValid) {
      try {
        setFormData({
          ...formData,
          fechaNacimiento: new Date(formData.fechaNacimiento).toISOString(),
        });
        let response = await PATCH("clientes/modificarcliente", {
          ...formData,
          idCliente: id,
        });
        if (response) {
          switch (response.status) {
            case 200:
              setMessage(
                "El cliente " +
                  formData.nombre +
                  " " +
                  formData.apellido +
                  ", Documento: " +
                  formData.documento +
                  " ha sido modificado correctamente"
              );
              setFormData({
                nombre: "",
                apellido: "",
                documento: "",
                fechaNacimiento: "",
                genero: "Masculino",
                tipoCliente: "Consumidor Final",
                email: "",
                direccion: "",
                telefono: "",
              });
              setOk(true);
              setErrors({});
              setShowModal(true);
              break;
            case 401:
              setMessage(
                "Su sesion expiro. Por favor, vuelva a iniciar sesion"
              );
              setShowModal(true);
              break;
            default:
              response = await response.json();
              setMessage(response.message);
              setShowModal(true);
              break;
          }
        } else {
          setMessage(
            "Hubo un problema al agregar cliente. Verifique la conexion"
          );
          setShowModal(true);
        }
      } catch {
        setMessage(
          "Hubo un problema al agregar cliente. Por favor, contacte con un administrador."
        );
        setShowModal(true);
        setIsLoading(false);
      }
    }
    setIsLoading(false);
  }

  return (
    <div className="container">
      <div className="card-rounded">
        <h2>Modificar Cliente</h2>
        <br />
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">
              Nombre(*)
            </label>
            <input
              type="text"
              className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="apellido" className="form-label">
              Apellido(*)
            </label>
            <input
              type="text"
              className={`form-control ${errors.apellido ? "is-invalid" : ""}`}
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="documento" className="form-label">
              Documento(*)
            </label>
            <input
              type="text"
              className={`form-control ${errors.documento ? "is-invalid" : ""}`}
              id="documento"
              name="documento"
              value={formData.documento}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="fechaNacimiento" className="form-label">
              Fecha de Nacimiento(*)
            </label>
            <input
              type="date"
              className={`form-control ${
                errors.fechaNacimiento ? "is-invalid" : ""
              }`}
              id="fechaNacimiento"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="genero" className="form-label">
              Género(*)
            </label>
            <select
              className={`form-select ${errors.genero ? "is-invalid" : ""}`}
              id="genero"
              name="genero"
              value={formData.genero}
              onChange={handleChange}
            >
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="tipoCliente" className="form-label">
              Tipo de cliente(*)
            </label>
            <select
              className={`form-select ${
                errors.tipoCliente ? "is-invalid" : ""
              }`}
              id="tipoCliente"
              name="tipoCliente"
              value={formData.tipoCliente}
              onChange={handleChange}
            >
              <option value="Consumidor Final">Consumidor Final</option>
              <option value="Responsable Inscripto">
                Responsable Inscripto
              </option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email(*)
            </label>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="direccion" className="form-label">
              Dirección
            </label>
            <input
              type="text"
              className={`form-control ${errors.direccion ? "is-invalid" : ""}`}
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="telefono" className="form-label">
              Teléfono
            </label>
            <input
              type="tel"
              className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>
          {isLoading ? (
            <div
              style={{ justifySelf: "center" }}
              className="d-flex spinner-border"
              role="status"
            >
              <span className="visually-hidden">Cargando...</span>
            </div>
          ) : (
            <button
              style={{ 
                marginTop: "0px", 
                marginBottom: "10px"
              }}
              type="submit"
              className="btn btn-warning w-25 mt-3 custom-button"
            >
              Modificar Cliente
            </button>
          )}
        </form>
        <Modal show={showModal}>
          <Modal.Header>
            <Modal.Title>Aviso</Modal.Title>
          </Modal.Header>
          <Modal.Body>{message}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
