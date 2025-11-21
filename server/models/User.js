import { DataTypes } from 'sequelize';
import sequelize from './db.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  condition: {
    type: DataTypes.STRING,
    allowNull: false
  },
  timezone: {
    type: DataTypes.STRING,
    defaultValue: 'UTC'
  }
}, {
  tableName: 'users',
  timestamps: true
});

export default User;