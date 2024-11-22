// src/routes.js
import express from 'express';
import { uploadFile, deleteFile, createUser, deleteUser, uploadToProtocol } from './controllers/uploadController.js';

const router = express.Router();

// Define a rota para upload de arquivos
router.post('/', uploadFile);

// Define a rota para deletar arquivos
router.delete('/delete/:filename', deleteFile);

// Define a rota para criação de usuários com upload de arquivo
router.post('/users', createUser);

// Define a rota para deletar o arquivo de um usuário específico
router.delete('/users/:filename', deleteUser);

// Rota para upload em pasta específica por protocolo
router.post('/protocol/:protocolo', uploadToProtocol);


export default router;
