const router = require("express").Router();
const { body } = require("express-validator");

// Importanto controladores
const proyectosControllers = require("../controllers/proyectosControllers");
const tareasControllers = require("../controllers/tareasControllers");
const usuariosControllers = require("../controllers/usuariosControllers");
const authControllers = require("../controllers/authControllers");

module.exports = function () {
  router.get(
    "/",
    authControllers.usuarioAutenticado,
    proyectosControllers.proyectosHome
  );

  router.get(
    "/proyectos/nuevo",
    authControllers.usuarioAutenticado,
    proyectosControllers.formularioProyectoNuevo
  );
  router.post(
    "/proyectos/nuevo",
    authControllers.usuarioAutenticado,
    body("nombre").not().isEmpty().trim().escape(),
    proyectosControllers.nuevoProyecto
  );

  router.get(
    "/proyectos/:url",
    authControllers.usuarioAutenticado,
    proyectosControllers.proyectoPorUrl
  );

  router.get(
    "/proyectos/editar/:id",
    authControllers.usuarioAutenticado,
    proyectosControllers.formularioProyectoEditar
  );
  router.post(
    "/proyectos/editar/:id",
    authControllers.usuarioAutenticado,
    body("nombre").not().isEmpty().trim().escape(),
    proyectosControllers.editarProyecto
  );

  router.delete(
    "/proyectos/:url",
    authControllers.usuarioAutenticado,
    proyectosControllers.borrarProyecto
  );

  // rutas para las tareas
  router.post(
    "/proyectos/:url",
    authControllers.usuarioAutenticado,
    tareasControllers.agregarTarea
  );
  router.put(
    "/tareas/:id",
    authControllers.usuarioAutenticado,
    tareasControllers.cambiarEstado
  );
  router.delete(
    "/tareas/:id",
    authControllers.usuarioAutenticado,
    tareasControllers.eliminarTarea
  );

  // rutas de usuarios
  router.get("/crear-cuenta", usuariosControllers.crearUsuarioForm);
  router.post("/crear-cuenta", usuariosControllers.crearUsuario);
  router.get("/iniciar-sesion", usuariosControllers.formularioIniciarSesion);
  router.post("/iniciar-sesion", authControllers.autenticarUsuario);
  router.get("/cerrar-sesion", authControllers.cerrarSesion);
  router.get("/confirmacion/:email", usuariosControllers.confirmarCuenta);

  // restablecer contraseña
  router.get("/restablecer", usuariosControllers.formRestablecerPassword);
  router.post("/restablecer", authControllers.enviarToken);
  router.get("/restablecer/:token", authControllers.validarToken);
  router.post("/restablecer/:token", authControllers.actualizarPassword);

  return router;
};
