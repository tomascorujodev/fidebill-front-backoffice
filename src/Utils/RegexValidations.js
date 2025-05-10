export const RegexValidations = {
    nombre: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
    apellido: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
    documento: /^[0-9]{7,9}$/,
    genero: /^(Masculino|Femenino|Otro)$/i,
    tipoCliente: /^(Consumidor Final|Responsable Inscripto)$/i,
    fechaNacimiento: /^\d{2,4}-\d{2}-\d{2,4}$/,
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    direccion: /^.{0}$|^.{5,100}$/,
    telefono: /^(\d{10})?$/,
};

export const RegexBeneficios = {
    nombre: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
    apellido: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
    documento: /^[0-9]{7,9}$/,
    genero: /^(Masculino|Femenino|Otro)$/i,
    tipoCliente: /^(Consumidor Final|Responsable Inscripto)$/i,
    fechaNacimiento: /^\d{2,4}-\d{2}-\d{2,4}$/,
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    direccion: /^.{0}$|^.{5,100}$/,
    telefono: /^(\d{10})?$/,
};