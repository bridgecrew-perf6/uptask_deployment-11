const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// Importando el modelo con el que vamos a interactuar para la autenticación
const Usuario = require("../models/Usuarios");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario.verificarPassword(password)) {
          return done(null, null, {
            message: "Las credenciales no son validas",
          });
        }

        if (!usuario.activo) {
          return done(null, null, {
            message: "Necesitas activar la cuenta para poderla usar",
          });
        }

        return done(null, usuario);
      } catch (error) {
        return done(null, false, {
          message: "Las credenciales no son validas",
        });
      }
    }
  )
);

// hay que serealizar y deserializar el usuario
passport.serializeUser((usuario, cb) => {
  cb(null, usuario);
});

passport.deserializeUser((usuario, cb) => {
  cb(null, usuario);
});

module.exports = passport;
