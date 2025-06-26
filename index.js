const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Importar rutas
const turnosRoutes = require('./routes/turnos');
app.use('/api/turnos', turnosRoutes);

// Conexión a base de datos
const sequelize = require('./database/database');
const Turno = require('./models/Turno');

// Sincronizar base de datos
sequelize.sync().then(() => {
  console.log('✅ Base de datos lista');
  // Iniciar servidor
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Error al sincronizar la base de datos:', err);
});
