const express = require('express');
const { body, validationResult } = require('express-validator');
const Room = require('../models/Room');
const authenticateToken = require('../middleware/auth');
const mongoose = require('mongoose');

const router = express.Router();

// Rota para criar uma nova sala com validação
router.post('/create', [
    authenticateToken,
    body('name').notEmpty().withMessage('O nome da sala é obrigatório'),
    body('capacity').isInt({ min: 1 }).withMessage('A capacidade deve ser um número inteiro maior que 0'),
], async (req, res) => {
    console.log('Request Body:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation Errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, capacity } = req.body;

    try {
        // Verifica se o userId é um ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(req.user.userId)) {
            return res.status(400).json({ msg: 'ID de usuário inválido.' });
        }

        // O userId não precisa ser convertido novamente, já que você já validou antes
        const userId = new mongoose.Types.ObjectId(req.user.userId);

        const newRoom = new Room({
            name,
            capacity,
            createdBy: userId,
        });

        await newRoom.save();
        res.status(201).json({ msg: 'Sala criada com sucesso', room: newRoom });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Erro ao criar sala' });
    }
});

// Rota para entrar em uma sala
router.post('/join/:roomId', authenticateToken, async (req, res) => {
    const { roomId } = req.params; // Obtém o roomId da URL
    const userId = req.user.userId; // Obtém o ID do usuário do token

    try {
        // Verifica se a sala existe
        const room = await Room.findById(roomId); // Altere isso se estiver usando Sequelize ou outro ORM
        if (!room) {
            return res.status(404).json({ msg: 'Sala não encontrada.' });
        }

        // Converte o userId para ObjectId
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Lógica para entrar na sala, adicionando o usuário ao array de participantes
        if (!room.participants.includes(userObjectId)) {
            room.participants.push(userObjectId); // Adiciona o userObjectId ao array de participantes
            await room.save();
        }

        res.status(200).json({ msg: 'Você entrou na sala com sucesso.', room });
    } catch (err) {
        console.error('Erro ao entrar na sala:', err.message);
        res.status(500).json({ msg: 'Erro no servidor' });
    }
});

// Rota para obter todas as salas
router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find(); // Obtém todas as salas
        res.json(rooms); // Retorna as salas como JSON
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Erro ao obter salas' });
    }
});

// Rota para atualizar uma sala
router.put('/:id', [
    authenticateToken, // Certifique-se de que o usuário esteja autenticado
    body('name').optional().notEmpty().withMessage('O nome da sala não pode estar vazio'),
    body('capacity').optional().isInt({ min: 1 }).withMessage('A capacidade deve ser um número inteiro maior que 0'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, capacity } = req.body;
    const roomId = req.params.id; // Obtém o ID da sala

    try {
        // Verifica se a sala existe
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ msg: 'Sala não encontrada' });
        }

        // Atualiza os campos que foram enviados
        if (name) room.name = name;
        if (capacity) room.capacity = capacity;

        await room.save(); // Salva as alterações

        res.json({ msg: 'Sala atualizada com sucesso', room });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Erro ao atualizar sala' });
    }
});

// Rota para deletar uma sala
router.delete('/:id', authenticateToken, async (req, res) => {
    const roomId = req.params.id; // Obtém o ID da sala

    try {
        // Tenta encontrar e deletar a sala
        const room = await Room.findByIdAndDelete(roomId);
        if (!room) {
            return res.status(404).json({ msg: 'Sala não encontrada' });
        }

        res.json({ msg: 'Sala deletada com sucesso' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Erro ao deletar sala' });
    }
});


module.exports = router;
