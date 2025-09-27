import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientesFilePath = path.join(__dirname, '../database/models/cliente.json');

const clientesController = {
  // Obtener todos los clientes
  getAllClientes: async (req, res) => {
    try {
      const data = await fs.readFile(clientesFilePath, 'utf-8');
      const clientes = JSON.parse(data);
      res.status(200).json({ data: clientes });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener clientes', error });
    }
  },

  // Crear nuevo cliente
  createCliente: async (req, res) => {
    try {
      const { nombre, telefono, correo } = req.body;
      const data = await fs.readFile(clientesFilePath, 'utf-8');
      const clientes = JSON.parse(data);

      const existe = clientes.find(c => c.correo === correo);
      if (existe) {
        return res.status(400).json({
          errors: [{ path: 'correo', msg: 'Este correo ya está registrado' }]
        });
      }

      const nuevoId = clientes.length > 0 ? clientes[clientes.length - 1].id + 1 : 1;
      const nuevoCliente = { id: nuevoId, nombre, telefono, correo };

      clientes.push(nuevoCliente);
      await fs.writeFile(clientesFilePath, JSON.stringify(clientes, null, 2), 'utf-8');

      res.status(201).json({ message: 'Cliente registrado con éxito', cliente: nuevoCliente });
    } catch (error) {
      res.status(500).json({ message: 'Error al registrar cliente', error });
    }
  },

  // Editar cliente
  updateCliente: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, telefono, correo } = req.body;
      const data = await fs.readFile(clientesFilePath, 'utf-8');
      const clientes = JSON.parse(data);

      const index = clientes.findIndex(c => c.id === parseInt(id));
      if (index === -1) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }

      clientes[index].nombre = nombre || clientes[index].nombre;
      clientes[index].telefono = telefono || clientes[index].telefono;
      clientes[index].correo = correo || clientes[index].correo;

      await fs.writeFile(clientesFilePath, JSON.stringify(clientes, null, 2), 'utf-8');
      res.status(200).json({ message: 'Cliente actualizado con éxito' });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar cliente', error });
    }
  },

  // Eliminar cliente
  deleteCliente: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await fs.readFile(clientesFilePath, 'utf-8');
      const clientes = JSON.parse(data);

      const filtrados = clientes.filter(c => c.id !== parseInt(id));
      if (filtrados.length === clientes.length) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }

      await fs.writeFile(clientesFilePath, JSON.stringify(filtrados, null, 2), 'utf-8');
      res.status(200).json({ message: 'Cliente eliminado con éxito' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar cliente', error });
    }
  }
};

export default clientesController;
