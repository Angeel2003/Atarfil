const express = require('express');
const { Pool } = require('pg');
const db = require('./models');

// Configuración de la conexión
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'atarfil',
  password: 'password',
  port: 5432,
});

const app = express();

// Ruta de prueba para verificar la conexión
app.get('/check-db', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM information_schema.tables WHERE table_name = 'usuarios'");
    res.json({
      message: 'Conexión exitosa',
      tables: result.rows
    });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    res.status(500).json({ error: 'Error al conectar con la base de datos' });
  }
});

app.get('/usuarios', async (req, res) => {
  try {
      const resultado = await pool.query('SELECT * FROM usuarios');
      res.json(resultado.rows);
  } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
