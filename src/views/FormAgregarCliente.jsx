import { useState } from "react";
import { POST } from "../Services/Fetch";
import { Modal, Button } from "react-bootstrap";

export default function FormAgregarCliente() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    Nombre: "",
    Apellido: "",
    Documento: "",
    FechaNacimiento: "",
    Genero: "Masculino",
    TipoCliente: "Consumidor Final",
    Email: "",
    Direccion: "",
    Telefono: "",
  });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const validaciones = {
    Nombre: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
    Apellido: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
    Documento: /^[0-9]{7,9}$/,
    Genero: /^(Masculino|Femenino|Otro)$/i,
    TipoCliente: /^(Consumidor Final|Responsable Inscripto)$/i,
    FechaNacimiento: /^\d{2,4}-\d{2}-\d{2,4}$/,
    Email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    Direccion: /^.{0}$|^.{5,100}$/,
    Telefono: /^(\d{10})?$/,
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (validaciones[name].test(value)) {
      setErrors({ ...errors, [name]: false });
    } else {
      setErrors({ ...errors, [name]: true });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const newErrors = {};
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
        let response = await POST("clientes/crearcliente", {
          ...formData,
          FechaNacimiento: new Date(formData.FechaNacimiento).toISOString(),
        });
        if (response) {
          switch (response.status) {
            case 200:
              setMessage("El cliente " + formData.Nombre + " " + formData.Apellido + ", Documento: " + formData.Documento + " ha sido cargado correctamente");
              setFormData({
                Nombre: "",
                Apellido: "",
                Documento: "",
                FechaNacimiento: "",
                Genero: "Masculino",
                TipoCliente: "Consumidor Final",
                Email: "",
                Direccion: "",
                Telefono: "",
              });
              setErrors({});
              setShowModal(true);
              break;
            case 401:
              setMessage("Su sesion expiro. Por favor, vuelva a iniciar sesion");
              setShowModal(true);
              break;
            default:
              response = await response.json();
              setMessage(response.message);
              setShowModal(true);
              break;
          }
        } else {
          if (navigator.onLine) {
            setMessage("El servidor no responde. Por favor, vuelva a intentarlo en unos minutos. Si el problema persiste contacte con un administrador");
          } else {
            setMessage("Hubo un problema al agregar cliente. Por favor, verifique la conexión y vuelva a intentarlo.");
          }
          setShowModal(true);
        }
      } catch {
        setMessage("Hubo un problema al agregar cliente. Por favor, contacte con un administrador.");
        setShowModal(true);
        setIsLoading(false);
      }
    }
    setIsLoading(false);
  }

  return (
    <div className="container">
      <div className="card-rounded">
        <h2>Agregar Cliente</h2>
        <br />
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="Nombre" className="form-label">
              Nombre(*)
            </label>
            <input
              type="text"
              className={`form-control ${errors.Nombre ? "is-invalid" : ""}`}
              id="Nombre"
              name="Nombre"
              value={formData.Nombre}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="Apellido" className="form-label">
              Apellido(*)
            </label>
            <input
              type="text"
              className={`form-control ${errors.Apellido ? "is-invalid" : ""}`}
              id="Apellido"
              name="Apellido"
              value={formData.Apellido}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="Documento" className="form-label">
              Documento(*)
            </label>
            <input
              type="text"
              className={`form-control ${errors.Documento ? "is-invalid" : ""}`}
              id="Documento"
              name="Documento"
              value={formData.Documento}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="FechaNacimiento" className="form-label">
              Fecha de Nacimiento(*)
            </label>
            <input
              type="date"
              className={`form-control ${errors.FechaNacimiento ? "is-invalid" : ""
                }`}
              id="FechaNacimiento"
              name="FechaNacimiento"
              value={formData.FechaNacimiento}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="Genero" className="form-label">
              Género(*)
            </label>
            <select
              className={`form-select ${errors.Genero ? "is-invalid" : ""}`}
              id="Genero"
              name="Genero"
              value={formData.Genero}
              onChange={handleChange}
            >
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="TipoCliente" className="form-label">
              Tipo de cliente(*)
            </label>
            <select
              className={`form-select ${errors.TipoCliente ? "is-invalid" : ""
                }`}
              id="TipoCliente"
              name="TipoCliente"
              value={formData.TipoCliente}
              onChange={handleChange}
            >
              <option value="Consumidor Final">Consumidor Final</option>
              <option value="Responsable Inscripto">
                Responsable Inscripto
              </option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="Email" className="form-label">
              Email(*)
            </label>
            <input
              type="Email"
              className={`form-control ${errors.Email ? "is-invalid" : ""}`}
              id="Email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="Direccion" className="form-label">
              Dirección
            </label>
            <input
              type="text"
              className={`form-control ${errors.Direccion ? "is-invalid" : ""}`}
              id="Direccion"
              name="Direccion"
              value={formData.Direccion}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="Telefono" className="form-label">
              Teléfono
            </label>
            <input
              type="tel"
              className={`form-control ${errors.Telefono ? "is-invalid" : ""}`}
              id="Telefono"
              name="Telefono"
              value={formData.Telefono}
              onChange={handleChange}
            />
          </div>
          {isLoading ?
            <div
              style={{ justifySelf: "center" }}
              className="d-flex spinner-border"
              role="status"
            >
              <span className="visually-hidden">Cargando...</span>
            </div>
            :
            <>
              <button
                style={{
                  marginTop: "0px",
                  marginBottom: "10px",
                }}
                type="submit"
                className="btn btn-success w-25 mt-3 custom-button"
              >
                Agregar Cliente
              </button>
            </>
          }
        </form>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmación</Modal.Title>
          </Modal.Header>
          <Modal.Body>{message}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
        <br />
      </div>
      <br />
    </div>
  );
}
