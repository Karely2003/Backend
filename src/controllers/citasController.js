import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const citasFilePath = path.join(__dirname, '../database/models/Citas.json');
const clientesFilePath = path.join(__dirname, '../database/models/cliente.json');

const citasController = {
  // Obtener todas las citas
  getAllCitas: async (req, res) => {
    try {
      const data = await fs.readFile(citasFilePath, 'utf-8');
      const citas = JSON.parse(data);
      res.status(200).json({ data: citas });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener citas', error });
    }
  },

  // Crear nueva cita
  createCita: async (req, res) => {
    try {
      const { nombre, fecha, hora, notas } = req.body;

      // Validar que el nombre exista en cliente.json
      const clientesData = await fs.readFile(clientesFilePath, 'utf-8');
      const clientes = JSON.parse(clientesData);
      const existeCliente = clientes.find(c => c.nombre === nombre);

      if (!existeCliente) {
        return res.status(400).json({ message: 'El cliente no está registrado' });
      }

      const citasData = await fs.readFile(citasFilePath, 'utf-8');
      const citas = JSON.parse(citasData);

      const nuevoId = citas.length > 0 ? citas[citas.length - 1].id + 1 : 1;
      const nuevaCita = { id: nuevoId, nombre, fecha, hora, notas };

      citas.push(nuevaCita);
      await fs.writeFile(citasFilePath, JSON.stringify(citas, null, 2), 'utf-8');

      res.status(201).json({ message: 'Cita registrada con éxito', cita: nuevaCita });
    } catch (error) {
      res.status(500).json({ message: 'Error al registrar cita', error });
    }
  },

  // Editar cita
  updateCita: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, fecha, hora, notas } = req.body;
      const data = await fs.readFile(citasFilePath, 'utf-8');
      const citas = JSON.parse(data);

      const index = citas.findIndex(c => c.id === parseInt(id));
      if (index === -1) {
        return res.status(404).json({ message: 'Cita no encontrada' });
      }

      citas[index].nombre = nombre || citas[index].nombre;
      citas[index].fecha = fecha || citas[index].fecha;
      citas[index].hora = hora || citas[index].hora;
      citas[index].notas = notas || citas[index].notas;

      await fs.writeFile(citasFilePath, JSON.stringify(citas, null, 2), 'utf-8');
      res.status(200).json({ message: 'Cita actualizada con éxito' });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar cita', error });
    }
  },

  // Eliminar cita
  deleteCita: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await fs.readFile(citasFilePath, 'utf-8');
      const citas = JSON.parse(data);

      const filtradas = citas.filter(c => c.id !== parseInt(id));
      if (filtradas.length === citas.length) {
        return res.status(404).json({ message: 'Cita no encontrada' });
      }

      await fs.writeFile(citasFilePath, JSON.stringify(filtradas, null, 2), 'utf-8');
      res.status(200).json({ message: 'Cita eliminada con éxito' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar cita', error });
    }
  }
};

export default citasController;
