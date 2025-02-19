const express = require('express');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const saltRounds = 10;

// Middleware para parsear JSON y permitir CORS
app.use(express.json());
app.use(cors());

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'atarfil',
  password: 'password',
  port: 5432,
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

// Endpoint para Login
app.post('/api/login', async (req, res) => {
  const { correo_electronico, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE correo_electronico = $1',
      [correo_electronico]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const usuario = result.rows[0];

    // Si el usuario no tiene contraseña establecida (primer login)
    if (!usuario.contrasena) {
      // Se espera que ingrese su correo como contraseña para iniciar el proceso
      if (password === correo_electronico) {
        return res.json({
          message: 'Primer login. Se requiere actualizar la contraseña.',
          setPassword: true,
          usuarioId: usuario.id,
        });
      } else {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }
    }

    // Si ya tiene contraseña, se compara la ingresada con el hash almacenado
    const passwordValido = await bcrypt.compare(password, usuario.contrasena);
    if (!passwordValido) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Login exitoso
    return res.json({ message: 'Login exitoso', usuario });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para actualizar la contraseña
app.post('/api/update-password', async (req, res) => {
  const { usuarioId, newPassword } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await pool.query(
      'UPDATE usuarios SET contrasena = $1 WHERE id = $2',
      [hashedPassword, usuarioId]
    );

    return res.json({ message: 'Contraseña actualizada con éxito' });
  } catch (error) {
    console.error('Error actualizando contraseña:', error);
    res.status(500).json({ error: 'Error al actualizar la contraseña' });
  }
});

// Iniciar el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
