import express from 'express';
import { Medication, User } from '../models/index.js';

const router = express.Router();

// Get medications for user
router.get('/user/:userId', async (req, res) => {
  try {
    const medications = await Medication.findAll({
      where: { userId: req.params.userId, isActive: true },
      include: [User]
    });
    res.json(medications);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add medication
router.post('/', async (req, res) => {
  try {
    const medication = await Medication.create(req.body);
    res.status(201).json(medication);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update medication
router.put('/:id', async (req, res) => {
  try {
    const medication = await Medication.findByPk(req.params.id);
    if (!medication) {
      return res.status(404).json({ error: 'Medication not found' });
    }
    
    await medication.update(req.body);
    res.json(medication);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete medication (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const medication = await Medication.findByPk(req.params.id);
    if (!medication) {
      return res.status(404).json({ error: 'Medication not found' });
    }
    
    await medication.update({ isActive: false });
    res.json({ message: 'Medication deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;