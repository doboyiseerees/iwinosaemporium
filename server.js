require('dotenv').config();
const path = require('path');
const express = require('express');

// 1. Initialize 'app' FIRST (This fixes the crash)
const app = express();

// 2. Setup Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// 3. Serve Files
// 3. Serve Files
// Serve the main folder (for HTML files)
app.use(express.static(__dirname)); 

// Serve the 'public' folder (This fixes the images!)
app.use(express.static(path.join(__dirname, 'public'))); 

app.use(express.json());

// --- Temporary database ---
const users = [];

// --- DYNAMIC DOMAIN (Fixes the Stripe Redirect) ---
// This automatically detects if you are on Localhost or Render
const getDomain = (req) => {
    // If we are on the live server, use the actual URL. Otherwise use localhost.
    return req.headers.origin || 'http://localhost:3000';
};

// --- ROUTES ---

// 1. Homepage Route (Fixes "Cannot GET /")
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'black.html'));
});

// 2. Signup
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    const userExists = users.find(u => u.email === email);
    if (userExists) return res.json({ success: false, message: 'Email taken.' });
    users.push({ name, email, password });
    res.json({ success: true, message: 'Account created.' });
});

// 3. Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) res.json({ success: true, userName: user.name });
    else res.json({ success: false, message: 'Invalid login.' });
});

// 4. Stripe Payment
app.post('/create-checkout-session', async (req, res) => {
    try {
        const domain = getDomain(req); // Get the correct URL (Local or Live)
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
            success_url: `${domain}/black.html?status=success`, 
            cancel_url: `${domain}/black.html?status=canceled`,
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// --- START SERVER ---
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});