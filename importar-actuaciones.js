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
const workbook = xlsx.readFile('EXCEL/actuaciones_ejemplo.xlsx'); // o actuaciones.csv
const sheetName = workbook.SheetNames[0];
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

async function insertarActuaciones() {
  try {
    for (const row of data) {
      const { nombre, descripcion } = row;

      await pool.query(
        `INSERT INTO accion (nombre, descripcion)
         VALUES ($1, $2)`,
        [nombre, descripcion]
      );
    }

    console.log('Actuaciones insertadas correctamente');
  } catch (err) {
    console.error('Error al insertar actuaciones:', err);
  } finally {
    await pool.end();
  }
}

insertarActuaciones();
