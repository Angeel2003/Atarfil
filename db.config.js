module.exports = {
    HOST: '192.168.1.135',
    USER: 'postgres',
    PASSWORD: 'password',
    DB: 'atarfil',
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
};