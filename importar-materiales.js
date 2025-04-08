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
const workbook = xlsx.readFile('EXCEL/materiales_ejemplo.xlsx'); // o materiales.csv
const sheetName = workbook.SheetNames[0];
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

async function insertarMateriales() {
  try {
    for (const row of data) {
      const { nombre, descripcion, codigo } = row;

      await pool.query(
        `INSERT INTO material (nombre, descripcion, codigo)
         VALUES ($1, $2, $3)`,
        [nombre, descripcion || null, codigo || null]
      );
    }

    console.log('Materiales insertados correctamente');
  } catch (err) {
    console.error('Error al insertar materiales:', err);
  } finally {
    await pool.end();
  }
}

insertarMateriales();
