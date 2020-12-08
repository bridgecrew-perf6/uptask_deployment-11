const { DataTypes } = require("sequelize"),
  db = require("../config/db"),
  Proyectos = require("./Proyectos"),
  bcrypt = require("bcryptjs");

const Usuarios = db.define(
  "usuarios",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: {
        args: true,
        msg: "Usuario ya registrado",
      },
      validate: {
        isEmail: {
          msg: "Agrega un correo válido",
        },
        notEmpty: {
          msg: "El email no puede ir vacio",
        },
      },
    },
    password: {
      type: DataTypes.STRING(60),
      validate: {
        notEmpty: {
          msg: "El password no puede ir vacio",
        },
      },
    },
    activo: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    token: DataTypes.STRING,
    expiracion: DataTypes.DATE,
  },
  {
    hooks: {
      beforeCreate(usuario) {
        usuario.password = bcrypt.hashSync(
          usuario.password,
          bcrypt.genSaltSync(10)
        );
      },
    },
  }
);

Usuarios.prototype.verificarPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

Usuarios.prototype.hashPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

Usuarios.hasMany(Proyectos);

module.exports = Usuarios;
