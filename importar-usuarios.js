const fs = require('fs');
const xlsx = require('xlsx');
const { Pool } = require('pg');

// Configura tu conexión a PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: '192.168.1.135',
    database: 'atarfil',
    password: 'password',
    port: 5432,
  });

// Leer archivo Excel o CSV
const workbook = xlsx.readFile('EXCEL/usuarios_ejemplo.xlsx'); // o usuarios.csv
const sheetName = workbook.SheetNames[0];
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

async function insertarUsuarios() {
  try {
    for (const row of data) {
      const { nombre_completo, correo_electronico, numero_telefono, tipo_usuario, idioma } = row;

      await pool.query(
        `INSERT INTO usuarios (nombre_completo, correo_electronico, numero_telefono, tipo_usuario, idioma)
         VALUES ($1, $2, $3, $4, $5)`,
        [nombre_completo, correo_electronico, numero_telefono, tipo_usuario, idioma]
      );
    }

    console.log('Usuarios insertadas correctamente');
  } catch (err) {
    console.error('Error al insertar usuarios:', err);
  } finally {
    await pool.end();
  }
}

insertarUsuarios();
