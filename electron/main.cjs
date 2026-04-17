const { app, BrowserWindow } = require('electron');
const crypto = require('crypto');
const fs = require('fs');
const http = require('http');
const path = require('path');
const { URL } = require('url');

const HOST = '127.0.0.1';
const PORT = 8000;
const PROJECT_ROOT = path.resolve(__dirname, '..');
const isDev = process.env.ELECTRON_DEV === '1';

let apiServer = null;

const sampleProperties = [
  {
    id: 1,
    titulo: 'Departamento en Santiago Centro',
    imagen: 'https://placehold.co/800x520/0f62fe/ffffff?text=Santiago+Centro',
    dueno: 'Marcela Soto',
    telefono: '+56 9 7654 3210',
    rol: 'ROL-1001',
    foja: '201',
    numero: '51',
    ano: '2025',
    tipo: 'Departamento',
    ciudad: 'Santiago',
    comuna: 'Santiago Centro',
    direccion: 'Carmen 245',
    precio: 185000,
    uf: 5050,
    superficieTotal: 72,
    superficieConstruida: 68,
    numeroPisos: 1,
    numeroHabitaciones: 2,
    numeroBanos: 2,
    anoConstruccion: 2018,
    estado: 'Remodelado',
    estacionamientos: 1,
    balcon: true,
    bodega: true,
    gastosComunes: '$95.000',
    calefaccion: 'Eléctrica',
    orientacion: 'Surponiente',
    numeroPiso: 11,
    numeroDepartamento: '1108',
    departamentosPorPiso: 6,
    ascensor: 'Sí',
    aguaPotable: true,
    electricidad: true,
    gas: true,
    lavanderia: true,
    piscina: true,
    clubHouse: true,
    conserjeria: true,
    areaVerde: true,
    areaNinos: true,
    estacionamientoVisitas: true,
    costosPublicidad: '$180.000',
    costosFotografia: '$95.000',
    materialPublicitario: '$65.000',
    otrosGastos: '$40.000',
    costoTotalEstimado: '$380.000',
    tramitesRealizados: ['Tasación realizada', 'Fotografías tomadas', 'Publicación en portales'],
    tramitesPendientes: ['Firma de contrato', 'Recepción de documentos', 'Coordinación de visitas'],
    notas: 'Unidad con alta rotación en cartera interna.',
    condicionesVenta: 'Venta sujeta a financiamiento aprobado.',
    honorariosCorretaje: '2',
    descripcion: 'Departamento moderno, bien ubicado y listo para gestión comercial.',
  },
];

function getStorageDir() {
  if (isDev || !app.isPackaged) {
    return path.join(PROJECT_ROOT, 'Propiedades');
  }

  return path.join(app.getPath('userData'), 'Propiedades');
}

function getImagesDir() {
  return path.join(getStorageDir(), 'imagenes');
}

function ensureDir(target) {
  fs.mkdirSync(target, { recursive: true });
}

function seedPackagedStorage() {
  const storageDir = getStorageDir();
  const hasJson = fs.existsSync(storageDir)
    && fs.readdirSync(storageDir).some((name) => name.toLowerCase().endsWith('.json'));

  if (hasJson) return;

  const bundledDir = path.join(process.resourcesPath || PROJECT_ROOT, 'Propiedades');
  if (app.isPackaged && fs.existsSync(bundledDir)) {
    fs.cpSync(bundledDir, storageDir, { recursive: true });
    return;
  }

  sampleProperties.forEach(writeProperty);
}

function ensureStorage() {
  ensureDir(getStorageDir());
  ensureDir(getImagesDir());
  seedPackagedStorage();
}

function propertyFile(id) {
  return path.join(getStorageDir(), `${Number(id)}.json`);
}

function readProperty(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (Array.isArray(data.imagenes)) {
    data.imagenes = data.imagenes.filter(Boolean);
  } else if (data.imagen) {
    data.imagenes = [data.imagen];
  } else {
    data.imagenes = [];
  }

  if (!data.imagen && data.imagenes.length > 0) {
    data.imagen = data.imagenes[0];
  }

  return data;
}

function writeProperty(data) {
  fs.writeFileSync(propertyFile(data.id), JSON.stringify(data, null, 2), 'utf8');
}

function listProperties() {
  return fs
    .readdirSync(getStorageDir())
    .filter((name) => name.toLowerCase().endsWith('.json'))
    .map((name) => readProperty(path.join(getStorageDir(), name)))
    .sort((a, b) => Number(a.id) - Number(b.id));
}

function nextPropertyId() {
  const properties = listProperties();
  if (!properties.length) return 1;
  return Math.max(...properties.map((property) => Number(property.id))) + 1;
}

function imageExtension(mimeType, filename) {
  if (mimeType === 'image/jpeg') return '.jpg';
  if (mimeType === 'image/png') return '.png';
  if (mimeType === 'image/webp') return '.webp';
  const originalExtension = path.extname(filename || '');
  return originalExtension || '.jpg';
}

function mimeTypeForFile(filename) {
  const extension = path.extname(filename).toLowerCase();
  if (extension === '.jpg' || extension === '.jpeg') return 'image/jpeg';
  if (extension === '.png') return 'image/png';
  if (extension === '.webp') return 'image/webp';
  if (extension === '.gif') return 'image/gif';
  return 'application/octet-stream';
}

function saveImageUpload(upload) {
  const content = upload.content || '';
  const [header, encoded] = content.split(',');
  if (!encoded) return '';

  const mimeType = header.replace('data:', '').split(';')[0] || 'image/jpeg';
  const filename = `${crypto.randomUUID()}${imageExtension(mimeType, upload.filename)}`;
  fs.writeFileSync(path.join(getImagesDir(), filename), Buffer.from(encoded, 'base64'));
  return `http://${HOST}:${PORT}/media/${filename}`;
}

function preparePropertyPayload(payload) {
  const cleanPayload = { ...payload };
  const imageUploads = Array.isArray(cleanPayload.imageUploads) ? [...cleanPayload.imageUploads] : [];
  const fichaImagenUpload = cleanPayload.fichaImagenUpload;

  if (cleanPayload.imageUpload?.content) {
    imageUploads.push(cleanPayload.imageUpload);
  }

  delete cleanPayload.imageUploads;
  delete cleanPayload.imageUpload;
  delete cleanPayload.fichaImagenUpload;

  const existingImages = Array.isArray(cleanPayload.imagenes)
    ? cleanPayload.imagenes.filter(Boolean)
    : cleanPayload.imagen
      ? [cleanPayload.imagen]
      : [];

  const uploadedImages = imageUploads
    .filter((upload) => upload?.content)
    .map(saveImageUpload)
    .filter(Boolean);

  const images = [...existingImages, ...uploadedImages];
  cleanPayload.imagenes = images;
  cleanPayload.imagen = images[0] || '';

  if (fichaImagenUpload?.content) {
    cleanPayload.fichaImagen = saveImageUpload(fichaImagenUpload);
  }

  return cleanPayload;
}

function sendJson(response, payload, status = 200) {
  const body = Buffer.from(JSON.stringify(payload), 'utf8');
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': body.length,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  response.end(body);
}

function readJsonRequest(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    request.on('data', (chunk) => chunks.push(chunk));
    request.on('end', () => {
      const body = Buffer.concat(chunks).toString('utf8') || '{}';
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    request.on('error', reject);
  });
}

function sendMedia(response, filename) {
  const imagePath = path.join(getImagesDir(), path.basename(filename));
  if (!fs.existsSync(imagePath)) {
    sendJson(response, { error: 'Imagen no encontrada' }, 404);
    return;
  }

  const content = fs.readFileSync(imagePath);
  response.writeHead(200, {
    'Content-Type': mimeTypeForFile(imagePath),
    'Content-Length': content.length,
    'Access-Control-Allow-Origin': '*',
  });
  response.end(content);
}

async function handleApiRequest(request, response) {
  const url = new URL(request.url, `http://${HOST}:${PORT}`);
  const parts = url.pathname.split('/').filter(Boolean);

  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    response.end();
    return;
  }

  if (request.method === 'GET' && parts[0] === 'media' && parts[1]) {
    sendMedia(response, parts[1]);
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/properties') {
    sendJson(response, listProperties());
    return;
  }

  if (request.method === 'GET' && parts.length === 3 && parts[0] === 'api' && parts[1] === 'properties') {
    const target = propertyFile(parts[2]);
    if (!fs.existsSync(target)) {
      sendJson(response, { error: 'Propiedad no encontrada' }, 404);
      return;
    }
    sendJson(response, readProperty(target));
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/properties') {
    const payload = preparePropertyPayload(await readJsonRequest(request));
    payload.id = nextPropertyId();
    writeProperty(payload);
    sendJson(response, payload, 201);
    return;
  }

  if (request.method === 'PUT' && parts.length === 3 && parts[0] === 'api' && parts[1] === 'properties') {
    const target = propertyFile(parts[2]);
    if (!fs.existsSync(target)) {
      sendJson(response, { error: 'Propiedad no encontrada' }, 404);
      return;
    }
    const payload = preparePropertyPayload(await readJsonRequest(request));
    payload.id = Number(parts[2]);
    writeProperty(payload);
    sendJson(response, payload);
    return;
  }

  sendJson(response, { error: 'Ruta no encontrada' }, 404);
}

function startApiServer() {
  ensureStorage();

  return new Promise((resolve, reject) => {
    apiServer = http.createServer((request, response) => {
      handleApiRequest(request, response).catch(() => {
        sendJson(response, { error: 'Error interno del servidor local' }, 500);
      });
    });

    apiServer.once('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        apiServer = null;
        resolve();
        return;
      }
      reject(error);
    });

    apiServer.listen(PORT, HOST, resolve);
  });
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1366,
    height: 820,
    minWidth: 1100,
    minHeight: 720,
    backgroundColor: '#f4f6fb',
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  window.once('ready-to-show', () => {
    window.maximize();
    window.show();
  });

  if (isDev) {
    window.loadURL('http://127.0.0.1:5173');
    return;
  }

  window.loadFile(path.join(PROJECT_ROOT, 'dist', 'index.html'));
}

app.whenReady().then(async () => {
  await startApiServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (apiServer) {
    apiServer.close();
  }
});
