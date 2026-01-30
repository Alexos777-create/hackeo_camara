# WebRTC Signaling + Example Publisher/Viewer

Este proyecto incluye un servidor de señalización simple (Node.js + socket.io) y páginas cliente para publicar la cámara (`index.html`) y para ver y grabar la transmisión (`public/viewer.html`).

IMPORTANTE: solo utilízalo con usuarios que hayan dado consentimiento explícito para transmitir su audio/video.

Requisitos:
- Node.js 16+ (o compatible)

Instalación y ejecución:

```bash
cd path/to/nomas
npm install
npm start
```

Por defecto el servidor corre en `http://localhost:3000`.

Uso:
- Abre el publisher (tu página principal): `http://localhost:3000/index.html?room=miSala` y acepta la cámara/micro.
- Abre un visor desde otro dispositivo: `https://<tu-dominio>:3000/public/viewer.html?room=miSala` (o `http://localhost:3000/public/viewer.html?room=miSala` para pruebas locales).
- En el viewer, haz clic en "Iniciar Grabación" para capturar el video en tiempo real.
- Haz clic en "Detener y Guardar" para terminar la grabación y enviarla al servidor.

Las grabaciones se guardan en la carpeta `recordings/` del servidor en formato WebM.

Notas de despliegue:
- Para acceso desde otros dispositivos debes desplegar `server.js` en un servidor público con HTTPS y WSS (socket.io sobre TLS). GitHub Pages no sirve como señalización, necesitas un servidor que ejecute Node.
- Asegúrate de usar HTTPS en producción para que los navegadores permitan getUserMedia y WebRTC.
- Las grabaciones se almacenan en el servidor en la carpeta `recordings/`.

Si quieres, puedo hacer commit y push de estos archivos al repo por ti.

