import { DataTypes } from 'sequelize';
import sequelize from './db.js';

const Medication = sequelize.define('Medication', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dosage: {
    type: DataTypes.STRING,
    allowNull: false
  },
  frequency: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reminderTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'medications',
  timestamps: true
});

export default Medication;