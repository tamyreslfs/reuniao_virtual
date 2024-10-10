const { Sequelize } = require('sequelize');
require('dotenv').config(); // Carrega variáveis de ambiente

console.log(`Tentando conectar ao MySQL com: ${process.env.DB_USER}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);

// Cria a conexão com o MySQL usando Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  logging: false, // Desativa logs de SQL no console
});

const connectRelationalDB = async () => {
  try {
    await sequelize.authenticate(); // Testa a conexão
    console.log('Conectado ao MySQL');
    await sequelize.sync(); // Sincroniza os modelos com o banco
  } catch (error) {
    console.error(`Erro ao conectar ao MySQL: ${error.message}`);
    process.exit(1);
  }
};

module.exports = sequelize;
module.exports.connectRelationalDB = connectRelationalDB;
