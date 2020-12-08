const Proyectos = require("../models/Proyectos");
const Tareas = require("../models/Tareas");

exports.proyectosHome = async (req, res) => {
  try {
    const usuarioId = res.locals.usuario.id;

    const proyectos = await Proyectos.findAll({
      where: {
        usuarioId,
      },
    });

    res.render("index", {
      nombrePagina: "Proyectos",
      proyectos,
    });
  } catch (error) {}
};

exports.formularioProyectoNuevo = async (req, res) => {
  try {
    const usuarioId = res.locals.usuario.id;

    const proyectos = await Proyectos.findAll({
      where: {
        usuarioId,
      },
    });

    const errors = [];

    res.render("proyectos", {
      nombrePagina: "Nuevo proyecto",
      proyectos,
      proyecto: {},
      errors,
    });
  } catch (error) {}
};

exports.nuevoProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id;

  const proyectos = await Proyectos.findAll({
    where: {
      usuarioId,
    },
  });

  let { nombre } = req.body;

  const errores = [];

  if (!nombre) errores.push({ texto: "Agrega un nombre al proyecto" });

  if (errores.length > 0) {
    res.render("proyectos", {
      nombrePagina: "Nuevo proyecto",
      errores,
      proyectos,
    });
  } else {
    try {
      await Proyectos.create({ nombre, usuarioId });
      console.log("Registro guardado exitosamente");

      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  }
};

exports.proyectoPorUrl = async (req, res, next) => {
  const url = req.params.url;

  const usuarioId = res.locals.usuario.id;

  const proyectos = await Proyectos.findAll({
    where: {
      usuarioId,
    },
  });

  const proyecto = await Proyectos.findOne({
    where: {
      url,
    },
  });

  const tareas = await Tareas.findAll({
    where: {
      proyectoId: proyecto.id,
    },
    include: {
      model: Proyectos,
    },
  });

  if (!proyecto) return next();

  res.render("tareas", {
    nombrePagina: proyecto.nombre,
    proyecto,
    proyectos,
    tareas,
  });
};

exports.formularioProyectoEditar = async (req, res) => {
  const id = req.params.id;

  const usuarioId = res.locals.usuario.id;

  const proyectos = await Proyectos.findAll({
    where: {
      usuarioId,
    },
  });

  const proyecto = await Proyectos.findOne({
    where: {
      id,
    },
  });

  res.render("proyectos", {
    nombrePagina: "Editar proyecto",
    proyecto,
    proyectos,
  });
};

exports.editarProyecto = async (req, res) => {
  const id = req.params.id;

  const usuarioId = res.locals.usuario.id;

  const proyectos = await Proyectos.findAll({
    where: {
      usuarioId,
    },
  });

  const proyecto = await Proyectos.findOne({ where: { id } });

  let { nombre } = req.body;

  const errores = [];

  if (!nombre) errores.push({ texto: "Agrega un nombre al proyecto" });

  if (errores.length > 0) {
    res.render("proyectos", {
      nombrePagina: "Editar proyecto",
      errores,
      proyecto,
      proyectos,
    });
  } else {
    try {
      await Proyectos.update({ nombre }, { where: { id } });
      console.log("Actualizado exitosamente");

      res.redirect(`/proyectos/${proyecto.url}`);
    } catch (err) {
      console.log(err);
    }
  }
};

exports.borrarProyecto = async (req, res, next) => {
  const url = req.params.url;

  const eliminado = await Proyectos.destroy({ where: { url } });

  if (!eliminado) return next();

  res.send("Se ha eliminado el proyecto correctamente");
};
