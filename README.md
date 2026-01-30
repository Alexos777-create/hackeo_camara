# Camera Streamer - Transmisión de Imágenes en Tiempo Real

Sistema simple para capturar imágenes de cámara cada segundo y transmitirlas a otro dispositivo.

**IMPORTANTE:** Solo utilízalo con usuarios que hayan dado consentimiento explícito para capturar su cámara.

## Requisitos
- Node.js 16+ (o compatible)

## Instalación y ejecución

```bash
cd path/to/nomas
npm install
npm start
```

El servidor corre por defecto en `http://localhost:3000`.

## Uso

### Para el dispositivo que transmite la cámara:
1. Abre: `http://localhost:3000/index.html?room=test`
2. Acepta los permisos de cámara
3. Las imágenes se enviarán automáticamente cada segundo al servidor

### Para recibir las imágenes desde otro dispositivo:
1. Abre: `http://localhost:3000/receiver.html`
2. Ingresa el mismo nombre de sala (ej: `test`)
3. Haz clic en "Conectar"
4. Verás las imágenes en tiempo real

## Parámetro de sala

Puedes usar cualquier nombre de sala en la URL:
- Publisher: `http://localhost:3000/index.html?room=miSala`
- Receiver: Ingresa `miSala` en el campo de sala

## Despliegue en internet

Para usar desde internet, debes desplegar en un servidor Node.js público con HTTPS:
- Heroku
- Railway
- Render
- Replit
- AWS / Google Cloud
- DigitalOcean

GitHub Pages **NO funciona** porque solo sirve archivos estáticos.

Ejemplo con Replit:
```
https://tu-replit.repl.co/index.html?room=test
https://tu-replit.repl.co/receiver.html
```
