import express from 'express';
import pagosController from '../controllers/pagosController.js';

const router = express.Router();

router.get('/', pagosController.getAllPagos);
router.post('/register', pagosController.createPago);
router.put('/edit/:id', pagosController.updatePago);
router.delete('/delete/:id', pagosController.deletePago);

export default router;
