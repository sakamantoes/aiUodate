import Medication from './Medication.js';
import User from './User.js';

// Define associations
User.hasMany(Medication, { foreignKey: 'userId' });
Medication.belongsTo(User, { foreignKey: 'userId' });

export { User, Medication };