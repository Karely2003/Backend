import fs from 'fs/promises';
import path from "path";
import { fileURLToPath } from 'url';
import bcryptjs from 'bcryptjs';
import {validationResult} from "express-validator";
import { error } from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usersFilePath = path.join(__dirname, "../database/models/users.json");

const usersController = {
    getAllUsers: async (req, res) => {
        try{
            const data = await fs.readFile(usersFilePath, 'utf-8');
            const users = JSON.parse(data);
            const response = {
                meta:{
                    status:200,
                }, 
                data: users,
            };
            res.json(response)

        }catch(error){
            res.status(500).json({message: "Error al obtener usuario", error});
        }
    },

        createUser: async (req, res) => {
        try {
            const resultValidation = validationResult(req);
            if (!resultValidation.isEmpty()) {
            return res.status(400).json({ errors: resultValidation.array() });
            }

            const data = await fs.readFile(usersFilePath, "utf-8");
            const users = JSON.parse(data);

            
            const exists = users.find(u => u.email === req.body.email);
            if (exists) {
            return res.status(400).json({
                errors: [{ path: "email", msg: "Este correo ya está registrado" }]
            });
            }

            const newUser = {
            id: users.length + 1,
            name: req.body.name,
            email: req.body.email,
            password: bcryptjs.hashSync(req.body.password, 10),
            };

            users.push(newUser);
            await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), "utf-8");

            res.status(201).json({
            meta: { status: 201 },
            message: "Usuario creado con éxito",
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
        },


       loginProcess: async (req, res) => {
            try {
                const { email, password } = req.body;
                const data = await fs.readFile(usersFilePath, "utf-8");
                const users = JSON.parse(data);

                const user = users.find(u => u.email === email);
                if (!user) {
                return res.status(400).json({
                    errors: { email: { msg: "Correo no registrado" } }
                });
                }

                const validPass = bcryptjs.compareSync(password, user.password);
                if (!validPass) {
                return res.status(400).json({
                    errors: { password: { msg: "La contraseña es incorrecta" } }
                });
                }

                
                const { password: _, ...userData } = user; 
                return res.status(200).json({
                meta: { status: 200 },
                message: "Inicio de sesión exitoso",
                user: userData
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Error interno del servidor" });
            }
            },



    };


export default usersController;
