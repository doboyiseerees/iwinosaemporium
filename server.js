const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

// 🔴 IMPORTANT: Ensure this Stripe Key is correct
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // GOOD
const multer = require('multer'); // For uploading images

const app = express();
// Use the port Render gives us, OR use 3000 if we are on localhost
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'data.json');


// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve your HTML/CSS/JS files
/* =========================================
   HOMEPAGE ROUTE
   ========================================= */
// When someone visits the root domain (e.g., mysite.com/), show black.html
app.get('/', (req, res) => {
    // Adjust 'public' if your HTML file is in a specific folder, 
    // otherwise just use: path.join(__dirname, 'black.html')
    res.sendFile(path.join(__dirname, 'public', 'black.html'));
});
app.use('/uploads', express.static('uploads')); // Serve uploaded images

// --- IMAGE UPLOAD CONFIGURATION ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
        cb(null, Date.now() + '-' + safeName);
    }
});
const upload = multer({ storage: storage });

// --- HELPER FUNCTIONS ---

// Safely read the database
const readData = () => {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, '[]', 'utf8');
        return [];
    }
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return data ? JSON.parse(data) : [];
    } catch (err) {
        console.error("Error reading data.json:", err);
        return [];
    }
};

// Safely write to the database
const writeData = (data) => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (err) {
        console.error("Error writing to data.json:", err);
        return false;
    }
};

// --- ROUTES ---

// 1. GET ALL ITEMS
app.get('/api/items', (req, res) => {
    const items = readData();
    res.json(items);
});

// 2. ADD NEW ITEM
app.post('/api/products', upload.single('image'), (req, res) => {
    try {
        const items = readData();

        const newItem = {
            id: Date.now().toString(),
            name: req.body.name,
            price: parseFloat(req.body.price),
            category: req.body.category,
            description: req.body.description,
            specs: req.body.specs || "",
            role: req.body.role || "",
            quote: req.body.quote || "",
            image: req.file ? `/uploads/${req.file.filename}` : '/images/placeholder.jpg'
        };

        items.push(newItem);

        if (writeData(items)) {
            console.log('Success: Item added:', newItem.name);
            res.status(201).json({ message: 'Product added successfully', product: newItem });
        } else {
            throw new Error('Failed to write to file');
        }

    } catch (error) {
        console.error("SERVER ERROR:", error);
        res.status(500).json({ error: 'Failed to save product' });
    }
});

// 3. DELETE ITEM
app.delete('/api/items/:id', (req, res) => {
    try {
        let items = readData();
        const initialLength = items.length;
        
        items = items.filter(item => item.id !== req.params.id);

        if (items.length === initialLength) {
            return res.status(404).json({ error: 'Item not found' });
        }

        writeData(items);
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error("DELETE ERROR:", error);
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

// 4. STRIPE CHECKOUT ROUTE (Fixed for Empty Descriptions)
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const cartItems = req.body.cart; 
        const inventory = readData();    

        const line_items = cartItems.map(cartItem => {
            
            // A. SPECIAL CASE: MEMBERSHIP
            if (cartItem.id === 'membership-premium') {
                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: "Premium Membership",
                            description: "Unlock the Winery & Clothing Collection",
                        },
                        unit_amount: 8100, 
                    },
                    quantity: 1,
                };
            }

            // B. STANDARD ITEMS (Database Lookup)
            const product = inventory.find(p => p.id == cartItem.id);
            if (!product) return null; 

            // --- THE FIX IS HERE ---
            // Create a safe description (Stripe crashes if description is "")
            let safeDescription = "African Tenacity Collection";
            if (product.description && product.description.trim() !== "") {
                safeDescription = product.description;
            }

            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.name,
                        description: safeDescription, // Use safe description
                    },
                    unit_amount: Math.round(product.price * 100), 
                },
                quantity: cartItem.quantity,
            };
        }).filter(item => item !== null);

        if (line_items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty or invalid' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: line_items,
            mode: 'payment',
            success_url: 'http://localhost:3000/success.html',
            cancel_url: 'http://localhost:3000/cart.html',
        });

        res.json({ url: session.url });

    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).json({ error: error.message });
    }
});

/* =========================================
   REVIEWS API (Add to server.js)
   ========================================= */
const REVIEWS_FILE = path.join(__dirname, 'reviews.json');

// Helper to read reviews
function getReviews() {
    if (!fs.existsSync(REVIEWS_FILE)) return [];
    const data = fs.readFileSync(REVIEWS_FILE);
    return JSON.parse(data);
}

// 1. GET Reviews for a specific product
app.get('/api/reviews', (req, res) => {
    const { productId } = req.query;
    const allReviews = getReviews();
    // Filter to show only reviews for this specific item
    const productReviews = allReviews.filter(r => r.productId === productId);
    res.json(productReviews);
});

// 2. POST a new review
app.post('/api/reviews', (req, res) => {
    const { productId, user, rating, comment } = req.body;
    
    if (!productId || !rating) {
        return res.status(400).json({ error: "Missing data" });
    }

    const newReview = {
        id: Date.now().toString(),
        productId,
        user: user || "Anonymous",
        rating: parseInt(rating),
        comment: comment || "",
        date: new Date().toLocaleDateString()
    };

    const reviews = getReviews();
    reviews.push(newReview);
    
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
    
    res.json({ success: true, review: newReview });
});

// --- 5. START THE SERVER ---
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Database file located at: ${DB_FILE}`);
});