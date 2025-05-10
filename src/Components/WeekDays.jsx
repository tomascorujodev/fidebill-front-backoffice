import "../assets/css/WeekDays.css"

export default function WeekDays({ diasActivos = [false, false, false, false, false, false, false], colorActivo = "#4f46e5" }){
  const diasLetras = ["L", "M", "X", "J", "V", "S", "D"]

  const diasCompletos = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

  const darkenColor = (color, percent) => {
    const num = Number.parseInt(color.slice(1), 16)
    const amt = Math.round(2.55 * percent)
    const R = Math.max(0, (num >> 16) - amt)
    const G = Math.max(0, ((num >> 8) & 0x00ff) - amt)
    const B = Math.max(0, (num & 0x0000ff) - amt)
    return `#${((1 << 24) | (R << 16) | (G << 8) | B).toString(16).slice(1)}`
  }

  const colorOscuro = darkenColor(colorActivo, 20)

  return (
    <div className="dias-semana-wrapper">
      <div className="dias-semana-container">
        {diasLetras.map((letra, index) => (
          <div
            key={index}
            className={`dia-circulo ${diasActivos[index] ? "activo" : "inactivo"}`}
            style={{
              background: diasActivos[index]
                ? `linear-gradient(135deg, ${colorActivo}, ${colorOscuro})`
                : "linear-gradient(135deg, #f0f0f0, #e0e0e0)",
              boxShadow: diasActivos[index]
                ? `0 4px 15px rgba(${Number.parseInt(colorActivo.slice(1, 3), 16)}, ${Number.parseInt(colorActivo.slice(3, 5), 16)}, ${Number.parseInt(colorActivo.slice(5, 7), 16)}, 0.4)`
                : "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
            title={diasCompletos[index]}
          >
            <span>{letra}</span>
            {diasActivos[index] && <div className="glow" style={{ background: colorActivo }}></div>}
          </div>
        ))}
      </div>
    </div>
  )
}
