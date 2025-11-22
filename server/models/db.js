import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Use the Railway URL directly in your code (not recommended for production)
// But for quick testing, you can do this:
const sequelize = new Sequelize('mysql://root:wQtCcaktohbehNDffpsYFezGLqeJlUEq@mysql.railway.internal:3306/railway', {
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    connectTimeout: 60000
  }
});

export default sequelize;