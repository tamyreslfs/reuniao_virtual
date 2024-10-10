const socket = io();  // Inicializa o socket

const joinRoomBtn = document.getElementById('joinRoom');
const sendMessageBtn = document.getElementById('sendMessage');
const messagesDiv = document.getElementById('messages');

let roomId = '';
let userName = '';

// Evento de clique para entrar na sala
joinRoomBtn.addEventListener('click', () => {
  roomId = document.getElementById('roomId').value;
  userName = document.getElementById('userName').value;

  if (roomId && userName) {
    socket.emit('joinRoom', { roomId, userName });
    addMessage(`Você entrou na sala ${roomId}`);
  } else {
    alert('Por favor, preencha o ID da sala e seu nome.');
  }
});

// Evento de clique para enviar mensagem
sendMessageBtn.addEventListener('click', () => {
  const message = document.getElementById('message').value;
  if (message && roomId && userName) {
    socket.emit('sendMessage', { roomId, userName, message });
    addMessage(`Você: ${message}`);
    document.getElementById('message').value = '';  // Limpa o campo de mensagem
  } else {
    alert('Preencha a mensagem e entre em uma sala.');
  }
});

// Receber mensagem do servidor
socket.on('receiveMessage', ({ userName, message }) => {
  addMessage(`${userName}: ${message}`);
});

// Usuário entrou na sala
socket.on('userJoined', ({ userName }) => {
  addMessage(`${userName} entrou na sala.`);
});

// Usuário saiu da sala
socket.on('userLeft', ({ userName }) => {
  addMessage(`${userName} saiu da sala.`);
});

// Função para adicionar mensagens à tela
function addMessage(msg) {
  const newMessage = document.createElement('div');
  newMessage.textContent = msg;
  messagesDiv.appendChild(newMessage);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;  // Scroll automático
}
