import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagosFilePath = path.join(__dirname, '../database/models/Pagos.json');
const clientesFilePath = path.join(__dirname, '../database/models/cliente.json');

const pagosController = {
  // Obtener todos los pagos
  getAllPagos: async (req, res) => {
    try {
      const data = await fs.readFile(pagosFilePath, 'utf-8');
      const pagos = JSON.parse(data);
      res.status(200).json({ data: pagos });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener pagos', error });
    }
  },

  // Crear nuevo pago
  createPago: async (req, res) => {
    try {
      const { nombre, monto, fecha } = req.body;

      // Validar que el cliente exista
      const clientesData = await fs.readFile(clientesFilePath, 'utf-8');
      const clientes = JSON.parse(clientesData);
      const existeCliente = clientes.find(c => c.nombre === nombre);

      if (!existeCliente) {
        return res.status(400).json({ message: 'El cliente no está registrado' });
      }

      const pagosData = await fs.readFile(pagosFilePath, 'utf-8');
      const pagos = JSON.parse(pagosData);

      const nuevoId = pagos.length > 0 ? pagos[pagos.length - 1].id + 1 : 1;
      const nuevoPago = { id: nuevoId, nombre, monto, fecha };

      pagos.push(nuevoPago);
      await fs.writeFile(pagosFilePath, JSON.stringify(pagos, null, 2), 'utf-8');

      res.status(201).json({ message: 'Pago registrado con éxito', pago: nuevoPago });
    } catch (error) {
      res.status(500).json({ message: 'Error al registrar pago', error });
    }
  },

  // Editar pago
  updatePago: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, monto, fecha } = req.body;

      const pagosData = await fs.readFile(pagosFilePath, 'utf-8');
      const pagos = JSON.parse(pagosData);

      const index = pagos.findIndex(p => p.id === parseInt(id));
      if (index === -1) {
        return res.status(404).json({ message: 'Pago no encontrado' });
      }

      pagos[index].nombre = nombre || pagos[index].nombre;
      pagos[index].monto = monto || pagos[index].monto;
      pagos[index].fecha = fecha || pagos[index].fecha;

      await fs.writeFile(pagosFilePath, JSON.stringify(pagos, null, 2), 'utf-8');
      res.status(200).json({ message: 'Pago actualizado con éxito' });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar pago', error });
    }
  },

  // Eliminar pago
  deletePago: async (req, res) => {
    try {
      const { id } = req.params;
      const pagosData = await fs.readFile(pagosFilePath, 'utf-8');
      const pagos = JSON.parse(pagosData);

      const filtrados = pagos.filter(p => p.id !== parseInt(id));
      if (filtrados.length === pagos.length) {
        return res.status(404).json({ message: 'Pago no encontrado' });
      }

      await fs.writeFile(pagosFilePath, JSON.stringify(filtrados, null, 2), 'utf-8');
      res.status(200).json({ message: 'Pago eliminado con éxito' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar pago', error });
    }
  }
};

export default pagosController;
