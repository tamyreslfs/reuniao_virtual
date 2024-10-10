const { DataTypes } = require('sequelize');
const sequelize = require('../config/relationalDatabase'); // Conexão com MySQL

// Define o modelo de Usuário para MySQL
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, // Valida formato de email
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true, // Adiciona createdAt e updatedAt automaticamente
});

module.exports = User;
