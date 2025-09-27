import express from 'express';
import clientesController from '../controllers/clientesController.js';

const router = express.Router();

router.get('/', clientesController.getAllClientes);
router.post('/register', clientesController.createCliente);
router.put('/edit/:id', clientesController.updateCliente);
router.delete('/delete/:id', clientesController.deleteCliente);

export default router;
