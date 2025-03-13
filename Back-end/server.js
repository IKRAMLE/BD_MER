const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://ikramlechqer:ikramlechqer@cluster0.owgf0.mongodb.net/Medical-Equipment', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Equipment Schema
const equipmentSchema = new mongoose.Schema({
  name: String,
  status: String, // "active" or "pending"
  price: Number
});

// Create Equipment Model
const Equipment = mongoose.model('Dashboard', equipmentSchema);

// API Route to Fetch Stats
app.get('/equip', async (req, res) => {
  try {
    const totalEquipment = await Equipment.countDocuments();
    const active = await Equipment.countDocuments({ status: 'active' });
    const pending = await Equipment.countDocuments({ status: 'pending' });
    const revenue = await Equipment.aggregate([
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);

    res.json({
      totalEquipment,
      active,
      pending,
      revenue: revenue.length ? revenue[0].total : 0
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
