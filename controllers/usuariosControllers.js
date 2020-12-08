const Usuarios = require("../models/Usuarios");
const enviarEmail = require("../handlers/email");

exports.crearUsuarioForm = (req, res) => {
  res.render("crearCuenta", {
    nombrePagina: "Crear cuenta de usuario",
  });
};

exports.crearUsuario = async (req, res, next) => {
  // leer los datos
  let { email, password } = req.body;

  try {
    const usuario = await Usuarios.create({ email, password });

    // crear la url de confirmación
    const confirmacionUrl = `${req.headers.host}/confirmacion/${usuario.email}`;

    // enviar el correo
    await enviarEmail.enviar({
      opts: {
        confirmacionUrl,
      },
      usuario: usuario.email,
      asunto: "Confirma tu cuenta de UpTask",
      archivo: "confirmacion-cuenta",
    });

    // redireccionar al usuario
    req.flash(
      "correcto",
      "Se ha creado tu cuenta, revisa tu email para confirmarla."
    );
    res.redirect("/iniciar-sesion");
  } catch (err) {
    // tomo los errores y los agrego al objeto que contiene req.flash()
    req.flash(
      "error",
      err.errors.map((error) => error.message)
    );

    res.render("crearCuenta", {
      nombrePagina: "Error: Crear cuenta",
      mensajes: req.flash(), // mensajes = {error: ['msj1', 'msj2', 'msj3', ...]}
      campos: { email, password },
    });
    // res.status(404).send("No se pudo crear el usuario");
  }
};

exports.formularioIniciarSesion = (req, res) => {
  const { error } = res.locals.mensajes;
  res.render("iniciarSesion", {
    nombrePagina: "Inicia tu sesión",
    error,
  });
};

exports.formRestablecerPassword = (req, res) => {
  res.render("restablecer", {
    nombrePagina: "Restablecer tu contraseña",
  });
};

exports.confirmarCuenta = async (req, res) => {
  const { email } = req.params;

  const usuario = await Usuarios.findOne({ where: { email } });

  if (!usuario) {
    req.flash("error", "El vinculo de confirmación no es correcto");
  }

  if (!usuario.activo) {
    usuario.activo = 1;
    await usuario.save();

    req.flash(
      "correcto",
      "Su cuenta ha sido activada correctamente, disfrute de Uptask"
    );
  } else {
    req.flash("error", "El usuario ya había sido activado");
  }

  res.redirect("/iniciar-sesion");
};
