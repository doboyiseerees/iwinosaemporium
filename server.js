require('dotenv').config();
const path = require('path');
// --- server.js (Final Corrected Version) ---
const express = require('express');
app.use(express.static(__dirname));
const app = express();
app.use(express.static('public'));

//  STRIPE SECRET KEY
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

//  SERVE FILES 
// We use __dirname to tell it to look in the CURRENT folder
app.use(express.static(__dirname)); 

// 3. MIDDLEWARE
app.use(express.json());

const YOUR_DOMAIN = 'http://localhost:3000';

// ---Temporary database ---
const users = [];

// --- LOGIN/SIGNUP ROUTES ---
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    const userExists = users.find(u => u.email === email);
    if (userExists) return res.json({ success: false, message: 'Email taken.' });
    users.push({ name, email, password });
    res.json({ success: true, message: 'Account created.' });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) res.json({ success: true, userName: user.name });
    else res.json({ success: false, message: 'Invalid login.' });
});

// --- STRIPE PAYMENT ROUTE ---
app.post('/create-checkout-session', async (req, res) => {
    try {
        const items = req.body.items;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        const lineItems = items.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity || 1,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${YOUR_DOMAIN}/success.html`,
            cancel_url: `${YOUR_DOMAIN}/cancel.html`,
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// --- START SERVER ---

const PORT = process.env.PORT || 3000; 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'black.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});