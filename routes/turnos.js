const express = require('express');
const router = express.Router();
const { generar, listar } = require('../controllers/turnosController');
const Turno = require('../models/Turno');

// Generar turnos para un mes y año
router.get('/generar', generar);

// Listar todos los turnos generados
router.get('/', listar);

// PUT /api/turnos/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { letraTurno, usuario } = req.body;

  if (!['A', 'B', 'C', 'D', '-'].includes(letraTurno)) {
    return res.status(400).json({ error: 'Letra de turno inválida' });
  }

  try {
    const turno = await Turno.findByPk(id);
    if (!turno) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }

    turno.letraTurno = letraTurno;
    turno.usuario = usuario; // ✅ ESTA LÍNEA ES LA CLAVE

    await turno.save();

    res.json({ mensaje: 'Turno actualizado con éxito' });
  } catch (err) {
    console.error('Error al actualizar turno:', err);
    res.status(500).json({ error: 'Error interno al actualizar turno' });
  }
});


module.exports = router;
