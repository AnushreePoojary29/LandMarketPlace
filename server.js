const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/land-listings', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ Connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  phone: String,
  password: String
});
const User = mongoose.model('User', userSchema);

// Land Schema
const landSchema = new mongoose.Schema({
  name: String,
  location: String,
  price: Number,
  description: String,
  sellerEmail: String
});
const Land = mongoose.model('Land', landSchema);

// BuyRequest Schema
const buyRequestSchema = new mongoose.Schema({
  buyerName: String,
  buyerEmail: String,
  landName: String,
  message: String
});
const BuyRequest = mongoose.model('BuyRequest', buyRequestSchema);

// Get all lands
app.get('/api/lands', async (req, res) => {
  try {
    const lands = await Land.find();
    res.json(lands);
  } catch {
    res.status(500).send('Error fetching land listings');
  }
});

// Post new land
app.post('/api/lands', async (req, res) => {
  try {
    const newLand = new Land(req.body);
    await newLand.save();
    res.status(201).send('Land added successfully');
  } catch {
    res.status(500).send('Error adding land');
  }
});

// Post a buy request
app.post('/api/buy', async (req, res) => {
  try {
    const request = new BuyRequest(req.body);
    await request.save();
    res.status(201).send('Buy request submitted');
  } catch {
    res.status(500).send('Error submitting request');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
