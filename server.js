const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Crear carpeta de grabaciones si no existe
const recordingsDir = path.join(__dirname, 'recordings');
if (!fs.existsSync(recordingsDir)) {
  fs.mkdirSync(recordingsDir);
}

// Configurar multer para uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, recordingsDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `recording-${timestamp}.webm`);
  }
});
const upload = multer({ storage });

// Servir archivos estáticos desde el directorio actual
app.use(express.static('.'));

// Ruta para recibir grabaciones de video
app.post('/upload-recording', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  console.log('Recording saved:', req.file.filename);
  res.json({ success: true, filename: req.file.filename });
});

// Ruta para listar grabaciones
app.get('/api/recordings', (req, res) => {
  fs.readdir(recordingsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read recordings' });
    }
    res.json({ recordings: files });
  });
});

const publishers = {}; // room -> socketId

io.on('connection', socket => {
  console.log('socket connected:', socket.id);

  socket.on('join', ({ room, role }) => {
    socket.join(room);
    socket.data.role = role;
    socket.data.room = room;

    if (role === 'publisher') {
      publishers[room] = socket.id;
      console.log(`Publisher joined room ${room}: ${socket.id}`);
    } else {
      console.log(`Viewer joined room ${room}: ${socket.id}`);
      // notify publisher a viewer joined (optional)
      const pubId = publishers[room];
      if (pubId) {
        io.to(pubId).emit('viewer-joined', { viewerId: socket.id });
      }
    }
  });

  socket.on('offer', ({ room, sdp }) => {
    // publisher sends offer to viewers
    socket.to(room).emit('offer', { sdp, from: socket.id });
  });

  // Offer targeted to a single client (used when publisher creates per-viewer peer)
  socket.on('offer-to', ({ to, sdp }) => {
    if (to) io.to(to).emit('offer', { sdp, from: socket.id });
  });

  socket.on('answer', ({ to, sdp }) => {
    // viewer sends answer back to publisher
    io.to(to).emit('answer', { sdp, from: socket.id });
  });

  socket.on('candidate', ({ to, candidate }) => {
    if (to) io.to(to).emit('candidate', { candidate, from: socket.id });
    else socket.to(socket.data.room).emit('candidate', { candidate, from: socket.id });
  });

  socket.on('disconnect', () => {
    console.log('socket disconnected:', socket.id);
    const room = socket.data.room;
    if (socket.data.role === 'publisher' && room) {
      delete publishers[room];
      socket.to(room).emit('publisher-left');
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Signaling server running on port ${PORT}`));
