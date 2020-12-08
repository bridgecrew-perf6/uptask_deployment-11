const Tareas = require("../models/Tareas");
const Proyectos = require("../models/Proyectos");

exports.agregarTarea = async (req, res, next) => {
  const urlProyecto = req.params.url;

  const { tarea } = req.body;

  const estado = 0;

  const proyecto = await Proyectos.findOne({ where: { url: urlProyecto } });

  const proyectoId = proyecto.id;

  const resultado = await Tareas.create({
    tarea,
    estado,
    proyectoId,
  });

  if (!resultado) return next();

  res.redirect(`/proyectos/${urlProyecto}`);
};

exports.cambiarEstado = async (req, res, next) => {
  const id = req.params.id;

  const url = req.body.data.url;

  const tarea = await Tareas.findOne({ where: { id } });

  const proyecto = await Proyectos.findOne({ where: { url } });

  if (proyecto.id == tarea.proyectoId) {
    const estado = tarea.estado == 0 ? 1 : 0;

    tarea.estado = estado;
    let resultado = await tarea.save();

    if (!resultado) {
      return res.status(404).send("No se pudo cambiar el estado de la tarea");
    }

    return res.status(200).send("Se cambio el estado de la tarea exitosamente");
  } else {
    return next();
  }
};

exports.eliminarTarea = async (req, res, next) => {
  const id = req.params.id;

  const url = req.body.url;

  try {
    const proyecto = await Proyectos.findOne({ where: { url } });

    const tarea = await Tareas.findOne({ where: { id } });

    if (proyecto.id === tarea.proyectoId) {
      console.log("proyecto y tarea coiciden");
      const resultado = await Tareas.destroy({ where: { id } });

      if (!resultado) return res.send("No se pudo eliminar la tarea");

      return res.send("La tarea de eliminó exitosamente");
    } else {
      return next();
    }
  } catch (err) {
    return next();
  }
};
