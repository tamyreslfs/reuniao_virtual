const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ msg: 'Acesso negado. Sem token.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Token inválido:', err.message);
            return res.status(403).json({ msg: 'Token inválido.' });
        }

        console.log('Usuário decodificado do token:', user); // Adicione esta linha

        // Garante que o userId seja um ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(user.userId)) {
            return res.status(400).json({ msg: 'ID de usuário inválido no token.' });
        }

        req.user = user; // Armazena o usuário no req
        next();
    });
}

module.exports = authenticateToken;
