const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/database'); // Conexão ao MongoDB
const { connectRelationalDB } = require('./config/relationalDatabase'); // Conexão ao MySQL
require('dotenv').config(); // Carrega variáveis de ambiente


const authRoutes = require('./routes/auth'); // Rotas de autenticação
const roomRoutes = require('./routes/rooms'); // Rotas de salas de reunião

// Inicializa o app Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });

app.use(express.json());
app.use(express.static('public')); // Serve arquivos estáticos

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

// Inicialização de bancos de dados e servidor
(async () => {
  try {
    await connectDB(); // Conecta ao MongoDB
    await connectRelationalDB(); // Conecta ao MySQL

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error(`Erro ao iniciar o servidor: ${error.message}`);
    process.exit(1);
  }
})();
