// =====================================
// Puerto
// =====================================
process.env.PORT = process.env.PORT;

// =====================================
// Entorno
// =====================================
process.env.NODE_ENV = process.env.NODE_ENV;

// =====================================
// Vencimiento del Token
// =====================================
// 60 segundos
// 60 minitos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = '168h';

// =====================================
// SEED de autentificación
// =====================================
process.env.SEED = process.env.SEED;

// =====================================
// Base de Datos
// =====================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// =====================================
// Gloogle Client ID
// =====================================
process.env.CLIENT_ID = process.env.CLIENT_ID;
