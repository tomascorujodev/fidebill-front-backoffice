import { useEffect, useState } from "react"

export default function Carousel({ imagen1 = null, imagen2 = null, imagen3 = null }) {
  const [urlImagenes, setUrlImagenes] = useState({ urlImagen1: "", urlImagen2: "", urlImagen3: "" });

  useEffect(() => {
    setUrlImagenes({
      urlImagen1: imagen1,
      urlImagen2: imagen2,
      urlImagen3: imagen3
    });
  }, [imagen1, imagen2, imagen3]);

  const imagenes = [
    urlImagenes.urlImagen1,
    urlImagenes.urlImagen2,
    urlImagenes.urlImagen3
  ].filter(Boolean);

  return (
    <div style={{ aspectRatio: "2 / 1" }} className="w-full max-w-3xl mx-auto p-0 mt-0 border border-gray-400">
      <div id="carouselExampleFade" className="h-100 w-100 carousel slide carousel-fade">
        <div className="carousel-inner h-100 w-100">
          {imagenes.map((imagen, index) => (
            <div key={index} className={`carousel-item ${index === 0 ? "active" : ""} h-100 w-100`}>
              <div style={{color: "white", backgroundColor: "rgba(0, 0, 0, 0.5)"}} className="position-absolute fs-2">{index + 1}</div>
              <img src={imagen} className="d-block w-100 h-100 object-cover" alt={`Imagen ${index + 1}`} />
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}
