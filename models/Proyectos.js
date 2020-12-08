const slug = require("slug");
const shortid = require("shortid");
const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Proyectos = db.define(
  "proyectos",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: DataTypes.STRING(100),
    url: DataTypes.STRING(100),
  },
  {
    hooks: {
      beforeCreate(proyecto) {
        let url = slug(
          `${proyecto.nombre} ${shortid.generate()}`
        ).toLowerCase();

        proyecto.url = url;
      },
    },
  }
);

module.exports = Proyectos;
