// src/server.js
import express from 'express';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import router from './routes.js';
import cors from 'cors';

// Defina __filename e __dirname para uso em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3030;

app.use(cors({ 
  origin: ['http://localhost:3000', 'http://localhost:4000']
})); 

// Middleware para servir arquivos estáticos
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Middlewares para processar JSON e URL-encoded (opcional)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para uso das rotas com prefixo '/upload'
app.use('/upload', router);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
