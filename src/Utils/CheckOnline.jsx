export default function CheckOnline() {
    if (navigator.onLine) {
        return("Ha ocurrido un problema. Por favor, intente nuevamente mas tarde");
    } else {
        return("Verifique su conexion a internet");
    }
}