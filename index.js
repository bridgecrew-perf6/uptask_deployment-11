// configuraciones
require("dotenv").config();

// importaciones
const path = require("path");
const express = require("express");
const routes = require("./routes");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const passport = require("./config/passport");

const authControllers = require("./controllers/authControllers");

// helpers
const helpers = require("./helpers");

// base de datos
const db = require("./config/db");

require("./models/Proyectos");
require("./models/Tareas");
require("./models/Usuarios");

db.sync()
  .then(() => console.log("Conectado a la base de datos"))
  .catch((err) => console.log(err));

// crear la app
const app = express();

// habilitar body-parser para leer los datos del formulario
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressValidator.body());

// carpeta de estaticas
app.use(express.static(path.join(__dirname, "./public")));

// habilitar pug
app.set("view engine", "pug");

// carpeta de vistas
app.set("views", path.join(__dirname, "./views"));

// activando las cookies
app.use(cookieParser());

// sessiones nos perminete navegar entre distintas paginas sin volvernos a autenticar
app.use(
  session({
    secret: "supersecreto",
    resave: false,
    saveUninitialized: false,
  })
);

// agregar flash messages
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// user el helper en toda la app
app.use((req, res, next) => {
  res.locals.vardump = helpers.vardump;
  res.locals.mensajes = req.flash();
  res.locals.usuario = { ...req.user } || {};

  next();
});

// ruta para el home
app.use("/", routes());

const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 3000;

app.listen(port, host, () =>
  console.log(`Servido ejecutandose en el puerto http://${host}:${port}`)
);
