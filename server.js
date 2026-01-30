const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);

app.use(express.static('.'));
app.use(express.json({ limit: '50mb' }));

// Almacenar la última imagen por sala
const latestImages = {};

// POST: Recibir imagen del publisher
app.post('/api/send-image', (req, res) => {
  const { room, imageData } = req.body;
  
  if (!room || !imageData) {
    return res.status(400).json({ error: 'room y imageData requeridos' });
  }

  latestImages[room] = {
    imageData: imageData,
    timestamp: Date.now()
  };

  console.log(`Imagen recibida para sala: ${room}`);
  res.json({ success: true });
});

// GET: Obtener la última imagen de una sala
app.get('/api/get-image/:room', (req, res) => {
  const room = req.params.room;
  const imageData = latestImages[room];

  if (!imageData) {
    return res.status(404).json({ error: 'No hay imagen disponible' });
  }

  res.json(imageData);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
