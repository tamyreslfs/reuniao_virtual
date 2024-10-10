const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User'); // Agora com Sequelize
const router = express.Router();

// Rota de registro de usuários com validação
router.post('/register', [
  body('name').notEmpty().withMessage('O nome é obrigatório'),
  body('email').isEmail().withMessage('Insira um email válido'),
  body('password').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Verificar se o usuário já existe
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ msg: 'Usuário já existe' });
    }

    // Criação de um novo usuário com senha hash
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Geração do token JWT
    const payload = { userId: user.id.toString() }; // Garante que userId seja uma string
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    

    // Envia a resposta com o token e os detalhes do usuário
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Erro ao registrar usuário:', err.message);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
});

// Rota de login de usuários
router.post('/login', [
  body('email').isEmail().withMessage('Insira um email válido'),
  body('password').notEmpty().withMessage('A senha é obrigatória'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Verifica se o usuário existe
    let user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }

    // Verifica se a senha está correta
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }

// Geração do token JWT
const payload = { userId: user.id }; // Use o user.id diretamente, não é necessário converter para string
const token = jwt.sign(
  payload, // Passa o payload aqui
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

    

    // Envia a resposta com o token e os detalhes do usuário
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Erro ao fazer login:', err.message);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
});

module.exports = router;
