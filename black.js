// --- 1. PRODUCT DATABASE ---
// WE REMOVED THE HARDCODED LIST HERE.
// Now, this script will automatically use the 'products' list from data.js

// --- 2. MOBILE MENU ---
const hamburger = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links-container');
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// --- 3. INITIALIZE CART ---
// We use 'ATT_Cart' to save your items in the browser
let cart = JSON.parse(localStorage.getItem('ATT_Cart')) || [];
updateCartBadge(); 

// --- 4. NAV BADGE ---
function updateCartBadge() {
    const badge = document.getElementById('cart-count');
    if (badge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.innerText = totalItems;
    }
}

// --- 5. ADD TO CART ---
function addToCart(productId) {
    // SECURITY CHECK:
    // Ensure 'products' exists. If not, the data.js file didn't load correctly.
    if (typeof products === 'undefined') {
        console.error("CRITICAL ERROR: 'products' list is missing. Make sure data.js is loaded before black.js and includes 'const products = inventory;' at the bottom.");
        alert("System Error: Product database not loaded.");
        return;
    }

    // 1. Find the product details from the GLOBAL 'products' list (from data.js)
    const productInfo = products.find(p => p.id === productId);

    if (!productInfo) {
        console.error("Product ID not found in database:", productId);
        alert("Error: Item not found in inventory."); // Helpful alert for debugging
        return; 
    }

    // 2. Check if item is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // 3. If new, push the full object to cart
        cart.push({
            id: productInfo.id,
            name: productInfo.name,
            price: productInfo.price,
            image: productInfo.image,
            quantity: 1
        });
    }
    
    saveCart();
    showToast(productInfo.name); // Pass name to toast for better UX
}

// --- 6. CHANGE QUANTITY ---
function changeQty(index, change) {
    if (cart[index].quantity + change > 0) {
        cart[index].quantity += change;
    } else {
        if(confirm("Remove this item from cart?")) {
            cart.splice(index, 1);
        }
    }
    saveCart();
    
    // If we are on the cart page, reload to show updates
    if (window.location.href.includes("cart.html")) {
        location.reload();
    }
}

// --- 7. REMOVE ITEM COMPLETELY ---
function removeFromCart(index) {
    if(confirm("Are you sure you want to remove this item?")) {
        cart.splice(index, 1);
        saveCart();
        if (window.location.href.includes("cart.html")) {
            location.reload();
        }
    }
}

// Helper to save and update UI
function saveCart() {
    localStorage.setItem('ATT_Cart', JSON.stringify(cart));
    updateCartBadge();
}

// --- 8. STRIPE CHECKOUT ---
// Note: This is your public test key. 
const stripe = Stripe('pk_test_51SkRSLF4PldbqlsvXTAIUfo06TDLq40Bz0URppq5ucMPBPDxbIrzBwM1IPkNIwPArcq6IheQLfQ1wWIQcitcnxP300Gs6vc3Dj'); 
const checkoutButton = document.getElementById('checkout-btn'); 

if (checkoutButton) {
    checkoutButton.addEventListener('click', function() {
        checkoutButton.innerText = "Redirecting...";
        
        fetch('/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: cart }) 
        })
        .then(function(response) { return response.json(); })
        .then(function(session) {
            return stripe.redirectToCheckout({ sessionId: session.id });
        })
        .then(function(result) {
            if (result.error) {
                alert(result.error.message);
                checkoutButton.innerText = "Try Again";
            }
        })
        .catch(function(error) {
            console.error('Error:', error);
            checkoutButton.innerText = "Try Again";
        });
    });
}

// --- 9. TAILORING FORM ---
const tailoringForm = document.getElementById('tailoringForm');
if (tailoringForm) {
    tailoringForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        const formSection = document.getElementById('tailoring-form-section');
        const successSection = document.getElementById('confirmation-message');
        const submitBtn = document.getElementById('btn-confirm');

        submitBtn.innerText = "Processing...";
        submitBtn.disabled = true;

        setTimeout(function() {
            if(formSection) formSection.style.display = 'none';
            if(successSection) successSection.style.display = 'block';
            window.scrollTo(0, 0);
        }, 1500);
    });
}

// --- 10. TOAST NOTIFICATION ---
function showToast(productName) {
    var x = document.getElementById("toast");
    if(x) {
        // Use name if provided, otherwise default
        x.innerText = productName ? productName + " added to bag!" : "Item added to bag!";
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }
}