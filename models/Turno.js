const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Turno = sequelize.define('Turno', {
  fecha: {
    type: DataTypes.STRING,
    allowNull: false
  },
  usuario: {
    type: DataTypes.STRING,
    allowNull: false
  },
  letraTurno: {
    type: DataTypes.ENUM('A', 'B', 'C', 'D', '-'),
    allowNull: false
  },
  publicado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Turno;
