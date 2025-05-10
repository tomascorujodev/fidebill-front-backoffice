import React from "react";

export default function ViewSoporte() {
  return (
    <div className="container mt-4">
      <div className="card-rounded">
        <div style={{ marginLeft: "20px", marginRight: "20px", }}> 
          <h2>Soporte</h2>
          <p className="lead text-justify">
            ¿Tenés alguna pregunta o necesitás ayuda con el sistema?
          </p>
          <div className="alert alert-info mt-4">
            Estamos disponibles para resolver cualquier problema o consulta que tengas.
            Envianos un correo a <a href="mailto:soportefidebill@gmail.com">soportefidebill@gmail.com</a> o escribinos al +54 223 312 2315.
          </div>
          <br />
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <img
          src="/assets/PoweredByFidebill.png"
          alt="FideBill Logo"
          width="340"
          height="63"
        />
      </div>
    </div>
  );
}
