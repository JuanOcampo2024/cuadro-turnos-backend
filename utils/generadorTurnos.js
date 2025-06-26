const dayjs = require('dayjs');
const weekday = require('dayjs/plugin/weekday');
const isLeapYear = require('dayjs/plugin/isLeapYear');
const Turno = require('../models/Turno');

dayjs.extend(weekday);
dayjs.extend(isLeapYear);

const USUARIOS = [
  'Juan Carlos', 'Diana', 'Tato', 'Abelardo', 'Sebastian',
  'Maria', 'Dora', 'Monica', 'Beatriz', 'Sonia'
];

const TODOS = ['Yolanda', ...USUARIOS];

const TURNOS = ['A', 'B', 'C', 'D'];

function miercolesAlternos(mes, anio) {
  const fecha = dayjs(`${anio}-${String(mes).padStart(2, '0')}-01`);
  let primerMiercoles = fecha;

  while (primerMiercoles.day() !== 3) {
    primerMiercoles = primerMiercoles.add(1, 'day');
  }

  const miercoles = [];
  while ((primerMiercoles.month() + 1) === Number(mes)) {
    miercoles.push(primerMiercoles.format('YYYY-MM-DD'));
    primerMiercoles = primerMiercoles.add(14, 'day');
  }

  return miercoles;
}

function siguienteUsuario(lista, contador) {
  const usuario = lista[contador.index];
  contador.index = (contador.index + 1) % lista.length;
  return usuario;
}

async function generarTurnos(mes, anio) {
  const fechaInicio = dayjs(`${anio}-${String(mes).padStart(2, '0')}-01`);
  const diasEnMes = fechaInicio.daysInMonth();

  const turnosGenerados = [];
  const contador = { index: 0 };
  const miercolesDescanso = miercolesAlternos(mes, anio);

  for (let i = 0; i < diasEnMes; i++) {
    const fecha = fechaInicio.add(i, 'day');
    const diaStr = fecha.format('YYYY-MM-DD');
    const diaSemana = fecha.day(); // 0 domingo ... 6 sábado

    let usuariosAsignados = [];

    // Yolanda solo trabaja turno A de lunes a viernes y no en sus miércoles libres
    let yolandaDisponible =
      diaSemana >= 1 && diaSemana <= 5 &&
      !miercolesDescanso.includes(diaStr);

    // Turno A
    if (yolandaDisponible) {
      turnosGenerados.push({
        fecha: diaStr,
        usuario: 'Yolanda',
        letraTurno: 'A'
      });
      usuariosAsignados.push('Yolanda');
    } else {
      const usuarioA = siguienteUsuario(USUARIOS, contador);
      turnosGenerados.push({
        fecha: diaStr,
        usuario: usuarioA,
        letraTurno: 'A'
      });
      usuariosAsignados.push(usuarioA);
    }

    // Turnos B, C, D
    for (let j = 1; j < 4; j++) {
      let siguiente;
      let intentos = 0;

      do {
        siguiente = siguienteUsuario(USUARIOS, contador);
        intentos++;
        if (intentos > USUARIOS.length) {
          siguiente = '-';
          break;
        }
      } while (usuariosAsignados.includes(siguiente));

      turnosGenerados.push({
        fecha: diaStr,
        usuario: siguiente,
        letraTurno: siguiente === '-' ? '-' : TURNOS[j]
      });

      usuariosAsignados.push(siguiente);
    }

    // ✅ NUEVO BLOQUE: asegurar que todos tengan un turno, aunque sea '-'
    for (const usuario of TODOS) {
      const yaTieneTurno = turnosGenerados.some(
        (t) => t.fecha === diaStr && t.usuario === usuario
      );
      if (!yaTieneTurno) {
        turnosGenerados.push({
          fecha: diaStr,
          usuario,
          letraTurno: '-'
        });
      }
    }
  }

  // Limpiar y guardar en la base de datos
  await Turno.destroy({ where: {} });
  await Turno.bulkCreate(turnosGenerados);

  return turnosGenerados;
}

module.exports = generarTurnos;