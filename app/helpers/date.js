const fromDateUTCToText = (date = {}) => {
  var fecha = new Date(date);

  // Obtener los componentes de la fecha
  var dia = fecha.getUTCDate();
  var mes = fecha.getUTCMonth(); // Se toma el mes sin sumar 1
  var año = fecha.getUTCFullYear();

  // Definir los nombres de los meses en un array
  var nombresMeses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  // Construir la cadena de texto
  var textoFecha = dia + " de " + nombresMeses[mes] + " del " + año;
  return textoFecha;
};

module.exports = fromDateUTCToText;
