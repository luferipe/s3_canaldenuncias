// src/controllers/uploadController.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

// Corrige o __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configura a pasta de armazenamento e o nome dos arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    // Cria a pasta se não existir
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Gera um hash aleatório para o nome do arquivo
    const hash = crypto.randomBytes(16).toString('hex');
    // Extrai a extensão original do arquivo
    const fileExtension = path.extname(file.originalname);
    // Cria o nome do arquivo usando o hash e a extensão original
    const newFileName = `${hash}${fileExtension}`;
    cb(null, newFileName);
  }
});

// Configura o multer para salvar especificamente na pasta /uploads/users
const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userUploadPath = path.join(__dirname, '..', 'uploads', 'users');
    // Cria a pasta se não existir
    if (!fs.existsSync(userUploadPath)) {
      fs.mkdirSync(userUploadPath, { recursive: true });
    }
    cb(null, userUploadPath);
  },
  filename: (req, file, cb) => {
    // Gera um hash aleatório para o nome do arquivo
    const hash = crypto.randomBytes(16).toString('hex');
    // Extrai a extensão original do arquivo
    const fileExtension = path.extname(file.originalname);
    // Cria o nome do arquivo usando o hash e a extensão original
    const newFileName = `${hash}${fileExtension}`;
    cb(null, newFileName);
  }
});

// Configura o multer para salvar na pasta do protocolo
const protocolStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { protocolo } = req.params;
    const protocolPath = path.join(__dirname, '..', 'uploads', protocolo);

    // Cria a pasta do protocolo se não existir
    if (!fs.existsSync(protocolPath)) {
      fs.mkdirSync(protocolPath, { recursive: true });
    }

    cb(null, protocolPath);
  },
  filename: (req, file, cb) => {
    // Gera um hash aleatório para o nome do arquivo
    const hash = crypto.randomBytes(16).toString('hex');
    // Extrai a extensão original do arquivo
    const fileExtension = path.extname(file.originalname);
    // Cria o nome do arquivo usando o hash e a extensão original
    const newFileName = `${hash}${fileExtension}`;
    cb(null, newFileName);
  }
});

// Configura o multer para utilizar o armazenamento específico para protocolo
const protocolUpload = multer({ storage: protocolStorage }).single('file');


// Configura o multer para utilizar o armazenamento definido acima
const upload = multer({ storage: storage }).single('file'); // 'file' é o nome do campo que envia o arquivo

// Configura o multer para utilizar o armazenamento definido acima para usuários
const userUpload = multer({ storage: userStorage }).single('file');

// Controlador para lidar com o upload
export const uploadFile = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao fazer upload do arquivo.', details: err });
    }

    // Verifica se o arquivo foi enviado
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    // Retorna a URL do arquivo salvo
    const fileUrl = `http://localhost:3030/uploads/${req.file.filename}`;
    return res.status(200).json({ message: 'Upload realizado com sucesso!', fileUrl: fileUrl });
  });
};

// Controlador para deletar um arquivo
export const deleteFile = (req, res) => {
  const { filename } = req.params; // Pega o nome do arquivo dos parâmetros da URL

  // Caminho completo do arquivo que será deletado
  const filePath = path.join(__dirname, '..', 'uploads', filename);

  // Verifica se o arquivo existe antes de deletar
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Arquivo não encontrado.' });
  }

  // Deleta o arquivo
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao deletar o arquivo.', details: err });
    }
    return res.status(200).json({ message: 'Arquivo deletado com sucesso!' });
  });
};

// Controlador para criar o usuário com upload de arquivo
export const createUser = (req, res) => {
  userUpload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao fazer upload do arquivo.', details: err });
    }

    // Verifica se o arquivo foi enviado
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    // Retorna a URL do arquivo salvo na pasta users
    const fileUrl = `http://localhost:3030/uploads/users/${req.file.filename}`;
    return res.status(200).json({ message: 'Usuário criado e arquivo salvo com sucesso!', fileUrl: fileUrl });
  });
};

// Controlador para deletar o arquivo do usuário
export const deleteUser = (req, res) => {
  const { filename } = req.params; // Pega o nome do arquivo dos parâmetros da URL

  // Caminho completo do arquivo que será deletado na pasta users
  const filePath = path.join(__dirname, '..', 'uploads', 'users', filename);

  // Verifica se o arquivo existe antes de deletar
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Arquivo não encontrado.' });
  }

  // Deleta o arquivo
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao deletar o arquivo.', details: err });
    }
    return res.status(200).json({ message: 'Arquivo do usuário deletado com sucesso!' });
  });
};

// Controlador para fazer upload na pasta do protocolo
export const uploadToProtocol = (req, res) => {
  protocolUpload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao fazer upload do arquivo.', details: err });
    }

    // Verifica se o arquivo foi enviado
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    // Retorna a URL do arquivo salvo na pasta do protocolo
    const fileUrl = `http://localhost:3030/uploads/${req.params.protocolo}/${req.file.filename}`;
    return res.status(200).json({ message: 'Arquivo salvo com sucesso na pasta do protocolo!', fileUrl: fileUrl });
  });
};
