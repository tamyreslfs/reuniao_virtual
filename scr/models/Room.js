const mongoose = require('mongoose');

// Define o esquema da sala
const roomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String }, // Descrição da sala
    capacity: { type: Number, required: true }, // Capacidade da sala
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Referência ao usuário criador da sala
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Lista de participantes
    isActive: { type: Boolean, default: true }, // Indicador de sala ativa
    createdAt: { type: Date, default: Date.now }, // Data de criação
});

// Criação do modelo Room
const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
