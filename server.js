const express = require('express');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const cors = require('cors');

const cron = require('node-cron');

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

    // Verificar si el correo ya está registrado
    const existingUser = await pool.query('SELECT * FROM usuarios WHERE correo_electronico = $1', [correo]);

    if (existingUser.rowCount > 0) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
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

// Endpoint para listar todas las incidencias
app.get('/incidencias', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM incidencias ORDER BY id DESC');
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener incidencias:', error);
    res.status(500).json({ message: 'Error al obtener incidencias' });
  }
});

// Obtener todas las tareas urgentes que han sido completadas
app.get('/tareas-urgentes-completadas', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM tareas_urgentes 
       WHERE estado = 'completada' 
       ORDER BY fecha, hora`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener tareas completadas:', error);
    res.status(500).json({ error: 'Error al obtener tareas completadas' });
  }
});

// Endpoint para eliminar una tarea completada
app.delete('/tareas-urgentes-completadas/:id', async (req, res) => {
  const taskId = req.params.id;
  try {
    const resultado = await pool.query('DELETE FROM tareas_urgentes WHERE id = $1', [taskId]);
    if (resultado.rowCount > 0) {
      res.json({ message: 'Tarea eliminada con éxito' });
    } else {
      res.status(404).json({ error: 'Tarea no encontrada' });
    }
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({ error: 'Error al eliminar tarea' });
  }
});

// Endpoint para eliminar una incidencia
app.delete('/incidencias/:id', async (req, res) => {
  const incidentId = req.params.id;
  try {
    const resultado = await pool.query('DELETE FROM incidencias WHERE id = $1', [incidentId]);
    if (resultado.rowCount > 0) {
      res.json({ message: 'Incidencia eliminada con éxito' });
    } else {
      res.status(404).json({ error: 'Incidencia no encontrada' });
    }
  } catch (error) {
    console.error('Error al eliminar incidencia:', error);
    res.status(500).json({ error: 'Error al eliminar incidencia' });
  }
});

// Endpoint para listar los usuarios operadores
app.get('/usuarios-operadores', async (req, res) => {
  try {
    const resultado = await pool.query("SELECT id, nombre_completo FROM usuarios WHERE tipo_usuario = 'Operador'");
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener operadores:', error);
    res.status(500).json({ message: 'Error al obtener operadores' });
  }
});

// Endpoint para listar todas las tareas urgentes
app.get('/tareas-urgentes', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM tareas_urgentes ORDER BY id DESC');
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener tareas urgentes:', error);
    res.status(500).json({ message: 'Error al obtener tareas urgentes' });
  }
});

// Endpoint para crear una nueva tarea urgente
app.post('/tareas-urgentes', async (req, res) => {
  try {
    const { usuario_asignado, tarea_a_asignar, fecha, hora } = req.body;

    // Verificar que los datos requeridos están presentes
    if (!usuario_asignado || !tarea_a_asignar || !fecha || !hora) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Insertar la tarea urgente en la base de datos
    const insertQuery = `
      INSERT INTO tareas_urgentes (usuario_asignado, tarea_a_asignar, fecha, hora)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [usuario_asignado, tarea_a_asignar, fecha, hora];

    const result = await pool.query(insertQuery, values);

    res.status(201).json({ message: 'Tarea urgente creada con éxito', tarea: result.rows[0] });
  } catch (error) {
    console.error('Error al insertar tarea urgente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para listar todas las tareas periodicas
app.get('/tareas-periodicas', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM tareas_periodicas ORDER BY id ASC');
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener tareas periodicas:', error);
    res.status(500).json({ message: 'Error al obtener tareas periodicas' });
  }
});

// Endpoint para crear una nueva tarea periodica
app.post('/tareas-periodicas', async (req, res) => {
  try {
    const { area, inspeccion, periodicidad, zonas } = req.body;

    // Insertar la tarea periódica
    const result = await pool.query(
      'INSERT INTO tareas_periodicas (area, inspeccion, periodicidad, zonas) VALUES ($1, $2, $3, $4) RETURNING *',
      [area, inspeccion, periodicidad, JSON.stringify(zonas)]
    );

    res.status(201).json({
      message: 'Tarea periódica creada con éxito',
      tarea: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Error al insertar tarea periódica:', error);
    res.status(500).json({ error: 'Error al insertar tarea periódica' });
  }
});

// Obtener todas las tareas periódicas a realizar
app.get('/tareas-a-realizar', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ta.id AS tarea_realizar_id, tp.*, ta.fecha  
      FROM tareas_a_realizar ta
      JOIN tareas_periodicas tp ON ta.tarea_periodica_id = tp.id
      ORDER BY ta.fecha;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener tareas del operador:', error);
    res.status(500).json({ error: 'Error al obtener tareas del operador' });
  }
});

// Obtener tareas urgentes asignadas a un operador para la fecha actual y fechas anteriores con estado "pendiente"
app.get('/tareas-urgentes/:usuarioId', async (req, res) => {
  try {
    const { usuarioId } = req.params;

    // Obtener la fecha actual en formato YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    const result = await pool.query(
      `SELECT * FROM tareas_urgentes 
       WHERE usuario_asignado @> $1 
       AND fecha <= $2
       AND estado = 'pendiente' 
       ORDER BY fecha DESC, hora DESC`,
      [`[${usuarioId}]`, today]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener tareas urgentes del operador:', error);
    res.status(500).json({ error: 'Error al obtener tareas urgentes' });
  }
});

// Marcar una tarea urgente como "completada"
app.patch('/tareas-urgentes/:id/completar', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE tareas_urgentes 
       SET estado = 'completada' 
       WHERE id = $1 
       RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Tarea urgente no encontrada' });
    }

    res.json({ message: 'Tarea marcada como completada', tarea: result.rows[0] });
  } catch (error) {
    console.error('Error al actualizar el estado de la tarea urgente:', error);
    res.status(500).json({ error: 'No se pudo actualizar la tarea urgente' });
  }
});

// Crear una nueva incidencia
app.post('/incidencias', async (req, res) => {
  try {
    const { area, zona, subzona, tipo_actuacion, material_necesario, hora_inicio, hora_fin, otros } = req.body;

    if (!tipo_actuacion) {
      return res.status(400).json({ error: 'El campo "tipo_actuacion" es obligatorio para registrar una incidencia' });
    }

    const query = `
      INSERT INTO incidencias (area, zona, subzona, tipo_actuacion, material_necesario, hora_inicio, hora_fin, otros)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [area, zona, subzona, tipo_actuacion, material_necesario, hora_inicio, hora_fin, otros];

    const result = await pool.query(query, values);

    res.status(201).json({ message: 'Incidencia creada correctamente', incidencia: result.rows[0] });
  } catch (error) {
    console.error('Error al crear la incidencia:', error);
    res.status(500).json({ error: 'No se pudo crear la incidencia' });
  }
});

app.delete('/tareas-a-realizar/:id', async (req, res) => {
  const { id } = req.params;
  const { tarea } = req.body;

  if (!tarea || !Array.isArray(tarea.zonas)) {
    return res.status(400).json({ error: 'Tarea inválida o sin zonas' });
  }

  try {
    let tieneEnPausa = false;
    let todasCompletadas = true;

    tarea.zonas.forEach(zona => {
      const subtareas = zona.subtareas || [];
      subtareas.forEach(sub => {
        if (sub.estado === 'en-pausa') tieneEnPausa = true;
        if (sub.estado !== 'completado') todasCompletadas = false;
      });
    });

    if (todasCompletadas) {
      await pool.query('INSERT INTO tareas_completadas (tarea) VALUES ($1)', [tarea]);
    } else if (tieneEnPausa) {
      await pool.query('INSERT INTO tareas_no_terminadas (tarea) VALUES ($1)', [tarea]);
    } else {
      return res.status(400).json({ error: 'La tarea no puede marcarse como completada ni en pausa' });
    }

    await pool.query('DELETE FROM tareas_a_realizar WHERE id = $1', [id]);

    res.json({ message: 'Tarea procesada correctamente' });

  } catch (error) {
    console.error('Error al completar la tarea:', error);
    res.status(500).json({ error: 'Error al procesar la tarea' });
  }
});

// Obtener todas las tareas completadas
app.get('/tareas-completadas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tareas_completadas ORDER BY fecha DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener tareas completadas:', error);
    res.status(500).json({ error: 'Error al obtener tareas completadas' });
  }
});

// Obtener todas las tareas no terminadas (pausadas)
app.get('/tareas-no-terminadas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tareas_no_terminadas ORDER BY fecha DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener tareas no terminadas:', error);
    res.status(500).json({ error: 'Error al obtener tareas no terminadas' });
  }
});

// Obtener el estado de la configuracion de las incidencias
app.get('/config/incidencia-en-pausa', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT valor FROM configuracion WHERE clave = 'crear_incidencia_en_pausa'`
    );

    res.json({ habilitado: result.rows[0]?.valor === 'true' });
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    res.status(500).json({ error: 'No se pudo obtener la configuración' });
  }
});

// Actualizar el estado de la configuracion de las incidencias
app.patch('/config/incidencia-en-pausa', async (req, res) => {
  const { habilitado } = req.body;

  try {
    await pool.query(
      `UPDATE configuracion SET valor = $1 WHERE clave = 'crear_incidencia_en_pausa'`,
      [habilitado ? 'true' : 'false']
    );

    res.json({ message: 'Configuración actualizada' });
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    res.status(500).json({ error: 'No se pudo actualizar la configuración' });
  }
});

// Obtener los materiales disponibles
app.get('/materiales', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM material ORDER BY nombre');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener materiales:', error);
    res.status(500).json({ error: 'No se pudo obtener la lista de materiales' });
  }
});




// Tarea programada para ejecutarse a las 12:00 AM todos los días
cron.schedule('52 18 * * *', async () => {
  try {
    console.log('Ejecutando tarea programada...');

    // Paso 1: Eliminar tareas_completadas y tareas_no_terminadas (limpieza de histórico diario)
    await pool.query('DELETE FROM tareas_completadas');
    await pool.query('DELETE FROM tareas_no_terminadas');

    // Paso 2: Obtener fecha de hoy
    const fechaHoy = new Date().toISOString().split('T')[0];

    // Paso 3: Eliminar tareas diarias del día anterior
    await pool.query(`
      DELETE FROM tareas_a_realizar
      WHERE tarea_periodica_id IN (
        SELECT id FROM tareas_periodicas WHERE periodicidad = 'Diaria'
      )
      AND fecha <> $1
    `, [fechaHoy]);

    // Paso 4: Obtener las tareas periódicas que se deben realizar hoy
    const tareasHoy = await pool.query(`
      SELECT id FROM tareas_periodicas
      WHERE periodicidad = 'Diaria'
        OR (periodicidad = 'Semanal' AND EXTRACT(DOW FROM NOW()) = 1) -- Lunes
        OR (periodicidad = 'Mensual' AND EXTRACT(DAY FROM NOW()) = 1) -- Día 1 del mes
        OR (periodicidad = 'Semestral' AND EXTRACT(MONTH FROM NOW()) IN (1, 7) AND EXTRACT(DAY FROM NOW()) = 1) -- Ene/Jul
        OR (periodicidad = 'Anual' AND EXTRACT(MONTH FROM NOW()) = 1 AND EXTRACT(DAY FROM NOW()) = 1) -- 1 Ene
    `);

    // Paso 5: Insertar solo las tareas que aún no estén registradas para hoy
    for (const tarea of tareasHoy.rows) {
      const check = await pool.query(
        'SELECT 1 FROM tareas_a_realizar WHERE tarea_periodica_id = $1 AND fecha = $2',
        [tarea.id, fechaHoy]
      );

      if (check.rowCount === 0) {
        await pool.query(
          'INSERT INTO tareas_a_realizar (tarea_periodica_id, fecha) VALUES ($1, $2)',
          [tarea.id, fechaHoy]
        );
      }
    }

    console.log('Tareas periódicas procesadas correctamente.');
  } catch (error) {
    console.error('Error en la tarea programada:', error);
  }
});

// Iniciar el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
