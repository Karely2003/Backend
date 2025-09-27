import express from 'express';
import citasController from '../controllers/citasController.js';

const router = express.Router();

router.get('/', citasController.getAllCitas);
router.post('/register', citasController.createCita);
router.put('/edit/:id', citasController.updateCita);
router.delete('/delete/:id', citasController.deleteCita);

export default router;
