import jsPDF from "jspdf";

export default async function imprimirComprobante({documento, nombre, apellido, cuerpo, puntos}){
    let counter = 42;
    const doc = new jsPDF({
    unit: "mm",
    format: [58, 90],
    lineHeight: 1.2,
    });

    doc.setFont("Courier", "normal");
    doc.setFontSize(8);
    doc.addImage("/assets/LOGOSDCapCut.png", 'PNG', 9, 3, 40, 8.5);
    doc.text(`NRO DOCUMENTO: ${documento}`, 2, 18);
    doc.text(`CLIENTE: ${nombre + " " + apellido}`, 2, 26);
    doc.text("--------------------------------", 2, 34);
    cuerpo?.map((text) => {
        doc.text(text, 2, counter);
        counter += 8;
    })
    doc.text("--------------------------------", 2, counter);
    counter += 8;
    doc.text(`PUNTOS ACUMULADOS: ${puntos}`, 2, counter);
    counter += 8;
    doc.text("--------------------------------", 2, counter);
    counter += 8;
    doc.text("MUCHAS GRACIAS", 17, counter);
    
    doc.autoPrint();

    window.open(doc.output('bloburl'), '_blank');
}