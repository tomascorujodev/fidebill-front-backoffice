import { useState } from "react"
import "../assets/css/CardBenefit.css"
import WeekDays from "./WeekDays"
import { convertirFecha, convertirFechaMuestra } from "../Utils/ConvertirFechas";
import { Navigate, useNavigate } from "react-router-dom";

export default function CardBenefit({ id = null, tipo, descripcion, dias, porcentajeReintegro = null, fechaInicio, fechaFin, sucursales, urlImagen, eliminar = () => {} }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate()

  function formatDate(dateString) {
    if (!dateString) return
    if (id) {
      return convertirFecha(dateString)
    } else {
      return convertirFechaMuestra(dateString)
    }
  }
  fechaInicio = formatDate(fechaInicio);
  fechaFin = formatDate(fechaFin);
  return (
    <div className={`promo-card ${expanded ? "expanded" : ""}`}>
      <div className="promo-card-header">
        <img
          style={!urlImagen ? { width: "110px" } : { width: "100%" }}
          src={urlImagen || "/assets/LOGOSD350x110px.png"}
          className="promo-logo"
        />
        {id && <button className="modify-button bg-warning" onClick={() => navigate(`/beneficios/modificarbeneficio?id=${id}`)}>Modificar</button>}
        {id && <button style={{marginTop: "40px"}} className="modify-button bg-danger" onClick={() => eliminar(id)}>Eliminar</button>}
        {
          porcentajeReintegro &&
          <div className="promo-badge">{porcentajeReintegro}% de reintegro</div>
        }
      </div>

      <div className="promo-card-body">
        <h3 className="promo-title">{tipo}</h3>
        <p className="promo-description">{descripcion}</p>

        {expanded && (
          <div className="promo-details">
            <div className="promo-detail-item">
              <span className="detail-label">Días válidos:</span>
              <WeekDays diasActivos={dias} />
            </div>
            
            <div className="promo-detail-item">
              <span className="detail-label">Vigencia:</span>
              <span className="detail-value text-dark">
                {(() => {
                  if (!fechaInicio && !fechaFin) return "Sin vencimiento";
                  if (!fechaInicio)
                    return <>Válido <span style={{ color: 'red' }}>hasta</span> el: <strong>{fechaFin}</strong></>;
                  if (!fechaFin)
                    return <>Válido <span style={{ color: 'green' }}>a partir</span> del: <strong>{fechaInicio}</strong></>;
                  return <><strong>{fechaInicio}</strong> - <strong>{fechaFin}</strong></>;
                })()}
              </span>
            </div>

            <div className="promo-detail-item">
              <span className="detail-label">Sucursales adheridas:</span>
              <ul className="sucursales-list">
                {
                  (sucursales && sucursales.length > 0) ? (
                    sucursales.map((sucursal, index) => (
                      <li key={index}>{sucursal}</li>
                    ))
                  )
                    :
                    <li>Todas</li>
                }
              </ul>
            </div>
          </div>
        )}

        <button style={{ marginTop: "auto" }} className="promo-button" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Ocultar detalles" : "Más detalles"}
        </button>
      </div>
    </div>
  )
}
