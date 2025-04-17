const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./models/userSchema');
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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
