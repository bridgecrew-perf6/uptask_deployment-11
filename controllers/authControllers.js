const crypto = require("crypto");
const { Op } = require("sequelize");
const passport = require("../config/passport");
const enviarEmail = require("../handlers/email");

const Usuarios = require("../models/Usuarios");

exports.autenticarUsuario = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/iniciar-sesion",
  failureFlash: true,
  badRequestMessage: "Los dos campos son obligatorios",
});

exports.usuarioAutenticado = (req, res, next) => {
  if (!req.isAuthenticated()) res.redirect("/iniciar-sesion");

  next();
};

exports.cerrarSesion = (req, res) => {
  req.session.destroy(() => res.redirect("/iniciar-sesion"));
};

// genera un token si el usuario es valido
exports.enviarToken = async (req, res) => {
  const { email } = req.body;

  // verificar si el usuario existe
  const usuario = await Usuarios.findOne({
    where: {
      email,
    },
  });

  // si no existe el usuario
  if (!usuario) {
    req.flash("error", "No existe esa cuenta de email");

    res.redirect("/restablecer");
  }

  // si existe
  usuario.token = crypto.randomBytes(20).toString("hex");
  usuario.expiracion = Date.now() + 3600000; // expira en una hora

  await usuario.save();

  const urlReset = `${req.headers.host}/restablecer/${usuario.token}`;

  await enviarEmail.enviar({
    usuario: usuario.email,
    opts: { urlReset },
    archivo: "resetear-password",
    asunto: "Resetear contraseña",
  });

  req.flash("correcto", "Se mandó el email correctamente");
  res.redirect("/iniciar-sesion");
};

exports.validarToken = async (req, res) => {
  const { token } = req.params;

  // buscar el usuario con el token enviado
  const usuario = await Usuarios.findOne({ where: { token } });

  // si NO encuentre el usuario
  if (!usuario) {
    req.flash("error", "Token no valido");

    res.redirect("/restablecer");
  }

  // si el token existe
  res.render("resetPassword", {
    nombrepagina: "Restablecer contraseña",
  });
};

exports.actualizarPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const usuario = await Usuarios.findOne({
    where: {
      token,
      expiracion: {
        [Op.gte]: Date.now(),
      },
    },
  });

  // si NO hay usuario con token
  if (!usuario) {
    req.flash("error", "La cuenta no es valida");

    res.redirect("/restablecer");
  }

  usuario.password = usuario.hashPassword(password);
  usuario.token = null;
  usuario.expiracion = null;

  await usuario.save();

  req.flash("correcto", "Se ha actualizado la contraseña correctamente");

  res.redirect("/iniciar-sesion");
};
