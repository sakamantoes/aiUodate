import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/Users.js'
import medicationRoutes from './routes/Medication.js'
import { initEmailScheduler } from './controller/emailController.js';
import sequelize from './models/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/medications', medicationRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Health API is running!' });
});

// Sync database and start server
sequelize.sync()
  .then(() => {
    console.log('Database synced');
   initEmailScheduler();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database sync error:', err);
  });