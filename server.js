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

// Endpoint para listar los usuarios
app.get('/usuarios', async (req, res) => {
  try {
      const resultado = await pool.query('SELECT * FROM usuarios ORDER BY nombre_completo ASC');
      res.json(resultado.rows);
  } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// Endpoint para dar de alta (crear) un nuevo usuario
app.post('/usuarios', async (req, res) => {
  try {
    const { nombreCompleto, correo, telefono, tipoUsuario, idioma } = req.body;

    // Validación básica de campos obligatorios
    if (!nombreCompleto || !correo || !tipoUsuario || !idioma) {
      return res.status(400).json({ error: 'Campos obligatorios no proporcionados.' });
    }

    // Si el teléfono es opcional, se usa null si está vacío
    const telefonoValue = (telefono && telefono.trim() !== '') ? telefono : null;

    // Se mapean los campos recibidos a los nombres de las columnas en la base de datos
    const insertQuery = `
      INSERT INTO usuarios (nombre_completo, correo_electronico, numero_telefono, tipo_usuario, idioma)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [nombreCompleto, correo, telefonoValue, tipoUsuario, idioma];

    const result = await pool.query(insertQuery, values);

    // Se devuelve el usuario creado
    res.status(201).json({ message: 'Usuario creado correctamente', usuario: result.rows[0] });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para eliminar un usuario
app.delete('/usuarios/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const resultado = await pool.query('DELETE FROM usuarios WHERE id = $1', [userId]);
    if (resultado.rowCount > 0) {
      res.json({ message: 'Usuario eliminado con éxito' });
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

// Iniciar el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
