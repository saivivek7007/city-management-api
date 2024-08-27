const express = require('express');
const City = require('../models/city');

const router = express.Router();

// Add City
router.post('/cities', async (req, res) => {
  try {
    const city = new City(req.body);
    await city.save();
    res.status(201).json({ message: 'City added successfully', city });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update City
router.put('/cities/:id', async (req, res) => {
  try {
    const city = await City.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!city) return res.status(404).json({ message: 'City not found' });
    res.json({ message: 'City updated successfully', city });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete City
router.delete('/cities/:id', async (req, res) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);
    if (!city) return res.status(404).json({ message: 'City not found' });
    res.json({ message: 'City deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get Cities
router.get('/cities', async (req, res) => {
  const { page = 1, limit = 10, filter = {}, sort = 'name', search = '', projection = '' } = req.query;
  try {
    const query = City.find(filter);
    if (search) {
      query.where('name').regex(new RegExp(search, 'i'));
    }
    const cities = await query
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select(projection);
    res.json(cities);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
