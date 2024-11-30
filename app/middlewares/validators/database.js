const {
    Users,
    Empleado,
    Inscripcion,
    TipoEvaluacion,
    CriterioEvaluacion,
    Curso,
    Resap,
    Resap37,
    Resap33,
    Capacitacion,
    
  } = require("../../database/config");
  
  // ========================= USER VALIDATE ============================
  const idExistUser = async (id = "") => {
    const idExist = await Users.findByPk(id);
    if (!idExist) {
      throw new Error(`El usuario con id: ${id}, no existe`);
    }
  };
  const emailExistUser = async (email = "",{req}) => {
    const { id } = req.params;
    const existDB = await Users.findOne({ where: { email } });
    if(!existDB) return;
    if (existDB.id != id) {
      throw new Error(`El usuario con email: ${email}, ya existe`);
    }
  };
  const ciExistUser = async (ci = "",{req}) => {
    const { id } = req.params;
    const existDB = await Users.findOne({ where: { ci } });
    if(!existDB) return;
    if (existDB.id != id) {
      throw new Error(`El usuario con ci: ${ci}, ya existe`);
    }
  };
  // ===========================================================
  // ========================= EMPLEADO VALIDATE =================
  const idExistEmpleado= async (id = "") => {
    const idExist = await Empleado.findByPk(id);
    if (!idExist) {
      throw new Error(`El empleado con id: ${id}, no existe`);
    }
  };
  const ciExistEmpleado = async (ci = "",{req}) => {
    const { id } = req.params;
    const existDB = await Empleado.findOne({ where: { ci } });
    if(!existDB) return;
    if (existDB.id != id) {
      throw new Error(`El usuario con ci: ${ci}, ya existe`);
    }
  };
  // =================================================================
  // ========================= CURSOS =========================
  const idExistCurso= async (id = "") => {
    const idExist = await Curso.findOne( { where: {id} });
    if (!idExist) {
      throw new Error(`La curso con id: ${id}, no existe`);
    }
  };
  const uuidExistCurso= async (uuid = "") => {
    const idExist = await Curso.findOne( { where: {uuid} });
    if (!idExist) {
      throw new Error(`La curso con uuid: ${uuid}, no existe`);
    }
  };
  const codExistCurso = async (codigo = "",{req}) => {
    const { uuid } = req.params;
    const codExistDB = await Curso.findOne({ where: {codigo} });
    if (!codExistDB) return;
    if (codExistDB.uuid != uuid){
      throw new Error(`El curso con código: ${codigo}, ya existe`);
    }
  };
  const nameExistCurso = async (nombre = "",{req}) => {
    const { uuid } = req.params;
    const nameExist = await Curso.findOne({ where: { nombre } });
    if(!nameExist) return;
    if (nameExist.uuid != uuid) {
      throw new Error(`El curso con nombre: ${nombre}, ya existe`);
    }
  };
  // =================================================================
  // ===================== CAPACITACIONES ============================
  const idExistCapacitacion = async (id = "") => {
    const idExist = await Capacitacion.findByPk(id);
    if (!idExist) {
      throw new Error(`La capacitación con id: ${id}, no existe`);
    }
  };
  const uuidExistCapacitacion= async (uuid = "") => {
    const idExist = await Capacitacion.findOne( { where: {uuid} });
    if (!idExist) {
      throw new Error(`La Capacitación con uuid: ${uuid}, no existe`);
    }
  };
  const codigoExistCapacitacion = async (codigo = "",{req}) => {
    const { uuid } = req.params;
    const codigoExist = await Capacitacion.findOne({ where: { codigo } });
    if(!codigoExist) return;
    if (codigoExist.uuid != uuid) {
      throw new Error(`El codigo de capacitación : ${codigo}, ya existe`);
    }
  };
  const esGestionActual = async (anio = "",{req}) => {
    //const { gestion } = req.params;
    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear()
    if(anio == anioActual) return;
    else{
      throw new Error(`El año : ${anio}, no es de la gestión actual `);
    }
  };
  const cumpleCantCursosExterno = async (id_empleado = "",{req}) => {
    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear()
    const tipo = "EXTERNO";
    const activo = "1";
    let cantidad = await Inscripcion.count( { where: {id_empleado      
      },
      include:[
        { association: 'incripcion_capacitacion',  
          attributes: {exclude: ['createdAt','status','updatedAt']},
          where: {tipo, activo }                 
        }
      ]
     });    
    cantidad = cantidad + 1;
    if(cantidad < 4) return;
    else{
      throw new Error(`A exedido la cantidad Maxima 3 cursos externos por Gestión`);
    }
  };
  const estaFechaActual = async ( fecha= "",{req}) => {
    const fechaActual = new Date();
    const primerDiaDelAnio = new Date(fechaActual.getFullYear(), 0, 1);
    const ultimoDiaDelAnio = new Date(fechaActual.getFullYear(), 11, 31);
    primerDiaDelAnio.setHours(0,0,0,0);
    ultimoDiaDelAnio.setHours(0,0,0,0);
    let fechaFin = new Date(fecha+" 00:00:00:00" )
    if( fechaFin >= primerDiaDelAnio && fechaFin <= ultimoDiaDelAnio ) {
      return;
    }else{
      throw new Error(`La fecha fin del curso : ${fecha}, no es de la gestión actual `);
    }
  };
  // =================================================================
  // ===================== INSCRIPCION ============================
  const idExistInscripcion = async (id = "") => {
    const idExist = await Inscripcion.findByPk(id);
    if (!idExist) {
      throw new Error(`La inscripción con id: ${id}, no existe`);
    }
  };
  const uuidExistInscripcion = async (uuid = "") => {
    const uuidExist = await Inscripcion.findOne({ where: {uuid} });
    if (!uuidExist) {
      throw new Error(`La inscripción con id: ${uuid}, no existe`);
    }
  };
  const existDobleInscripcion = async (id_capacitacion = "", id_empleado, {req}) => {
    const { id } = req.params;
    const existDoble = await Inscripcion.findOne({ where: { id_capacitacion, id_empleado, activo: 1 } });
    if(!existDoble) return;
    if (existDoble.id != id) {
      throw new Error(`El empleado con id: ${id_empleado} y la capacitación con id : ${id_capacitacion}, ya existe`);
    }
  };
  // =================================================================
  // ========================= Tipo Evaluacion =======================
  const idExistTipoEva= async (id = "") => {
    const idExist = await TipoEvaluacion.findByPk(id);
    if (!idExist) {
      throw new Error(`Tipo Evaluacion con id: ${id}, no existe`);
    }
  };
  const nameExistTipoEva = async (nombre = "",{req}) => {
    const { id } = req.params;
    const nameExist = await TipoEvaluacion.findOne({ where: { nombre } });
    if(!nameExist) return;
    if (nameExist.id != id) {
      throw new Error(`El tipo evaluacion con nombre: ${nombre}, ya existe`);
    }
  };
  // =================================================================
  // ========================= Criterio Evaluacion =======================
  const idExistCriterioEva = async (id = "") => {
    const idExist = await CriterioEvaluacion.findByPk(id);
    if (!idExist) {
      throw new Error(`El Criterio Evaluacion con id: ${id}, no existe`);
    }
  };
  const uuidExistCriterioEva = async (uuid = "") => {
    const uuidExist = await CriterioEvaluacion.findOne({ where: {uuid}  });
    if (!uuidExist) {
      throw new Error(`El Criterio Evaluacion con uuid: ${uuid}, no existe`);
    }
  };
  const nameExistCriterioEva = async (nombre = "",{req}) => {
    const { id } = req.params;
    const nameExist = await CriterioEvaluacion.findOne({ where: { nombre } });
    if(!nameExist) return;
    if (nameExist.id != id) {
      throw new Error(`El criterio evaluación con nombre: ${nombre}, ya existe`);
    }
  };  
  // =================================================================
  // ========================= Resap =======================
  const idExistResap = async (id = "") => {
    const idExist = await Resap.findByPk(id);
    if (!idExist) {
      throw new Error(`El Resap con id: ${id}, no existe`);
    }
  };  
  
  // =================================================================
  // ========================= Resap37 =======================
  const idExistResap37 = async (id = "") => {
    const idExist = await Resap37.findByPk(id);
    if (!idExist) {
      throw new Error(`El Resap37 con id: ${id}, no existe`);
    }
  };  
  
  // =================================================================
  // ========================= Resap33 =======================
  const idExistResap33 = async (id = "") => {
    const idExist = await Resap33.findByPk(id);
    if (!idExist) {
      throw new Error(`El Resap33 con id: ${id}, no existe`);
    }
  };  
  
  // =================================================================
  module.exports = {
    //idExistLocation,
    idExistUser,
    emailExistUser,
    ciExistUser,
    idExistEmpleado,
    ciExistEmpleado,
    idExistCurso,
    uuidExistCurso,
    codExistCurso,
    nameExistCurso,
    idExistCapacitacion,
    uuidExistCapacitacion,
    codigoExistCapacitacion,
    idExistInscripcion,
    uuidExistInscripcion,
    existDobleInscripcion,
    idExistTipoEva,
    nameExistTipoEva,
    idExistCriterioEva,
    nameExistCriterioEva,
    uuidExistCriterioEva,
    idExistResap,
    idExistResap37,
    idExistResap33, 
    esGestionActual,
    estaFechaActual,
    cumpleCantCursosExterno
  };
  