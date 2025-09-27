import express from 'express';
import reportesControllers from '../controllers/reportesControllers.js';

const router = express.Router();

router.get('/clientes-resumen', reportesControllers.clientesConResumen);

export default router;
