import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  'RoblesLaLaguna',
  'root',
  '',
  {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
  }
);

// Verifica la conexión dentro de una función async
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión establecida');
  } catch (error) {
    console.error('Error de conexión:', error.message);
  }
})();

export default sequelize;
