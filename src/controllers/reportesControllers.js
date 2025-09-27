import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientesPath = path.join(__dirname, '../database/models/Cliente.json');
const pagosPath = path.join(__dirname, '../database/models/Pagos.json');
const citasPath = path.join(__dirname, '../database/models/Citas.json');

const reportesControllers = {
  clientesConResumen: async (req, res) => {
    try {
      const clientesData = await fs.readFile(clientesPath, 'utf-8');
      const pagosData = await fs.readFile(pagosPath, 'utf-8');
      const citasData = await fs.readFile(citasPath, 'utf-8');

      const clientes = JSON.parse(clientesData);
      const pagos = JSON.parse(pagosData);
      const citas = JSON.parse(citasData);

      const hoy = new Date().toISOString().split('T')[0];

      const reporte = clientes.map(cliente => {
        const pagosCliente = pagos.filter(p => p.nombre === cliente.nombre);
        const citasCliente = citas.filter(c => c.nombre === cliente.nombre);

        const totalPagos = pagosCliente.reduce((sum, p) => sum + p.monto, 0);
        const ultimoPago = pagosCliente.length > 0 ? pagosCliente[pagosCliente.length - 1].fecha : 'Sin pagos';

        const totalCitas = citasCliente.length;

        const ultimaCita = citasCliente.length > 0
          ? `${citasCliente[citasCliente.length - 1].fecha} ${citasCliente[citasCliente.length - 1].hora}`
          : 'Sin citas';

        const tieneCitaProxima = citasCliente.some(c => c.fecha >= hoy);

        return {
          id: cliente.id,
          nombre: cliente.nombre,
          telefono: cliente.telefono,
          correo: cliente.correo,
          totalPagado: totalPagos,
          ultimoPago,
          cantidadPagos: pagosCliente.length,
          cantidadCitas: totalCitas,
          ultimaCita,
          citaProxima: tieneCitaProxima ? 'Sí' : 'No'
        };
      });

      res.status(200).json({ data: reporte });
    } catch (error) {
      res.status(500).json({ message: 'Error al generar reporte', error });
    }
  }
};

export default reportesControllers;
