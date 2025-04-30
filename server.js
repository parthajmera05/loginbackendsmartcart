const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./models/userSchema');
const Order = require('./models/orderSchema');
const Address = require('./models/addressSchema');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());




const MONGODB_URI = process.env.MONGO_DB_URL;

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));




  
app.get('/good', (req, res) => {    
    res.json({ message: 'Good' });
});
app.post('/signup', async (req, res) => {
    const { email, password, firstname, lastname, phone } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ email, password: hashedPassword, firstname, lastname, phone });
        await user.save();

        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});


app.get('/user', async (req, res) => {
    
    const user = await User.findOne();
    res.json(user);
});
app.post('/neworder', async (req, res) => {
    try {
      const { email, items, total_price, platform } = req.body;
  
      if (!email || !items || !total_price || !platform) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const newOrder = new Order({ email, items, total_price, platform });
      await newOrder.save();
  
      res.status(201).json({ message: 'Order placed successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  });
  

  app.get('/orders', async (req, res) => {
    try {
      const { email } = req.query;
  
      if (!email) return res.status(400).json({ message: 'Email is required' });
  
      const orders = await Order.find({ email }).sort({ date: -1 });
  
      res.json({ orders });
    } catch (err) {
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  });
app.post('/saveaddress', async (req, res) => {
    try {
      const newAddress = new Address(req.body);
      await newAddress.save();
      res.status(200).json({ message: 'Address saved successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to save address', error: err.message });
    }
  });
  
  // Get addresses by email
app.get('/address', async (req, res) => {
    const email = req.query.email;
    if (!email) return res.status(400).json({ message: 'Email is required' });
  
    try {
      const addresses = await Address.find({ email });
      res.status(200).json(addresses);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching addresses', error: err.message });
    }
  });
  

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
