import express from 'express';
import usersController from '../controllers/usersController.js';
import validationsRegister from '../middlewares/validateRegistreMiddleware.js';


const router = express.Router();
//mostrar usuarios
router.get("/", usersController.getAllUsers);

//ruta crear usuarios
router.post("/register",validationsRegister, usersController.createUser);

router.post("/login", usersController.loginProcess)

export default router;
