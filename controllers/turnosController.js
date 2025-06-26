const generarTurnos = require('../utils/generadorTurnos');
const Turno = require('../models/Turno');

const generar = async (req, res) => {
  try {
    const { mes, anio } = req.query;
    if (!mes || !anio) {
      return res.status(400).json({ error: 'Faltan parámetros mes o año' });
    }

    const turnos = await generarTurnos(parseInt(mes), parseInt(anio));
    res.json({ mensaje: 'Turnos generados exitosamente', turnos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al generar turnos' });
  }
};

const listar = async (req, res) => {
  try {
    const turnos = await Turno.findAll({ order: [['fecha', 'ASC']] });
    res.json(turnos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener turnos' });
  }
};

module.exports = { generar, listar };
