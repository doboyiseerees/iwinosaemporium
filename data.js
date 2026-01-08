
// --- 1. PRODUCT DATABASE (UPDATED) ---
const products = [
    // --- WINES ---
    { id: "wine_001", name: "Mercedes Vodka", price: 120.00, image: "/images/wine17.jpg" },
    { id: "wine_002", name: "Paso D'oro", price: 250.00, image: "/images/wine4.jpg" },
    { id: "wine_003", name: "Manchester Gin", price: 180.00, image: "/images/wine16.jpg" },
    { id: "wine_014", name: "Tekirdağ Rakısı", price: 45.00, image: "/images/wine14.jpg" },
    { id: "wine_015", name: "Bacardi Dragonberry", price: 25.00, image: "/images/wine15.jpg" },
    { id: "wine_011", name: "Bumbu XO Rum", price: 65.00, image: "/images/wine11.jpg" },
    { id: "wine_019", name: "The Dalmore 40", price: 8500.00, image: "/images/wine19.jpg" },
    { id: "wine_001", name: "Opaline Pinot Noir", price: 35.00, image: "/images/wine1.jpg" },
    { id: "wine_013", name: "Grey Goose Vodka", price: 50.00, image: "/images/wine13.jpg" },
    { id: "wine_008", name: "Perfekt Small Batch", price: 40.00, image: "/images/wine8.jpg" },
    { id: "wine_007", name: "Emmolo Sauvignon", price: 30.00, image: "/images/wine7.jpg" },
    { id: "wine_018", name: "Hennessy Paradis", price: 1500.00, image: "/images/wine18.jpg" },
    { id: "wine_012", name: "Dictador 12 Year", price: 55.00, image: "/images/wine12.jpg" },

    // --- ACCESSORIES ---
    { id: "acc_001", name: "The Obsidian Strand", price: 350.00, image: "/images/beads12.jpg" },
    { id: "acc_002", name: "The Royal Peach Coral", price: 600.00, image: "/images/beads3.jpg" },
    { id: "acc_003", name: "The Gilded Sunset", price: 550.00, image: "/images/beads4.jpg" },
    { id: "acc_004", name: "The Amber Legacy", price: 300.00, image: "/images/beads1.jpg" },
    { id: "acc_005", name: "The Bronze Armor", price: 400.00, image: "/images/beads11.jpg" },
    { id: "acc_006", name: "The Dual Heritage", price: 250.00, image: "/images/beads10.jpg" },

    // --- CLOTHING (NEW IDS) ---
    { id: "cloth_020", name: "The Verdant Houndstooth", price: 850.00, image: "/images/suits4.jpg" },
    { id: "cloth_021", name: "The Executive Pinstripe", price: 950.00, image: "/images/suits2.jpg" },
    { id: "cloth_022", name: "The Artiste Senator", price: 450.00, image: "/images/senator3.jpg" },
    { id: "cloth_023", name: "The Gilded Noir", price: 1200.00, image: "/images/suits7.jpg" },
    { id: "cloth_024", name: "The Diplomat Navy", price: 780.00, image: "/images/suits1.jpg" },
    { id: "cloth_025", name: "The Sovereign Drape", price: 500.00, image: "/images/senator2.jpg" },
    { id: "cloth_026", name: "The Crimson Heritage", price: 480.00, image: "/images/senator4.jpg" },
    { id: "cloth_027", name: "The Rose Quartz", price: 820.00, image: "/images/suits6.jpg" },
    { id: "cloth_028", name: "The Ivory & Mocha", price: 880.00, image: "/images/suits3.jpg" }
];

// --- 2. MOBILE MENU & DROPDOWN FIX ---
const hamburger = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links-container');
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Mobile Dropdown Fix: Toggle dropdown on click for mobile
const dropdowns = document.querySelectorAll('.dropdown');
dropdowns.forEach(drop => {
    drop.addEventListener('click', function() {
        if (window.innerWidth <= 768) { // Only on mobile
            this.querySelector('.dropdown-content').classList.toggle('show');
        }
    });
});


// --- 3. INITIALIZE CART ---
let cart = JSON.parse(localStorage.getItem('ATT_Cart')) || [];
updateCartBadge(); 

// --- 4. UPDATE NAV BADGE ---
function updateCartBadge() {
    const badge = document.getElementById('cart-count');
    if (badge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.innerText = totalItems;
    }
}

// --- 5. ADD TO CART (FIXED) ---
function addToCart(productId) {
    // Find the product details
    const productInfo = products.find(p => p.id === productId);

    if (!productInfo) {
        console.error("Product ID not found in database:", productId);
        return; 
    }

    // Check if item is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // If new, push to cart
        cart.push({
            id: productInfo.id,
            name: productInfo.name,
            price: productInfo.price,
            image: productInfo.image,
            quantity: 1
        });
    }
    
    saveCart();
    showToast(); 
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
function showToast() {
    var x = document.getElementById("toast");
    if(x) {
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }
}