const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../db.config.js');

// Conexión a la base de datos
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool
});

// Verificar conexión
sequelize.authenticate()
  .then(() => console.log('Conexión exitosa a la base de datos.'))
  .catch(err => console.error('No se pudo conectar:', err));

// Exportar conexión
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
