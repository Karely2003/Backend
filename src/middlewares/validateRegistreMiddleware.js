import { body } from 'express-validator';

const validationsRegister = [
  body("name")
    .notEmpty()
    .withMessage("El nombre es requerido")
    .bail()
    .isLength({ min: 4 })
    .withMessage("El nombre debe tener al menos 4 caracteres"),

  body("email")
    .notEmpty()
    .withMessage("El email es requerido")
    .bail()
    .isEmail()
    .withMessage("Debes escribir un email válido"),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es requerida")
    .bail()
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .bail()
    .matches(/^(?=.*[A-Z]).*$/)
    .withMessage("La contraseña debe contener al menos una letra mayúscula"),
];

export default validationsRegister;

    
