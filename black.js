/* --- script.js VERSION 4.0 (QUANTITY SUPPORT) --- */

// 1. MOBILE MENU
const hamburger = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links-container');
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// 2. INITIALIZE CART
let cart = JSON.parse(localStorage.getItem('ATT_Cart')) || [];
updateCartBadge(); 

// 3. UPDATE NAV BADGE (Sums up ALL quantities)
function updateCartBadge() {
    const badge = document.getElementById('cart-count');
    if (badge) {
        // Calculate total items (e.g., 2 wines + 1 suit = 3 items)
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.innerText = totalItems;
    }
}

// 4. ADD TO CART (With Quantity Logic)
function addToCart(productId) {
    // Check if item exists
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // If it exists, just add +1 to quantity
        existingItem.quantity += 1;
        alert(`Updated quantity! You now have ${existingItem.quantity} of this item.`);
    } 
    
    saveCart();
}

// 5. CHANGE QUANTITY (For the + and - buttons)
function changeQty(index, change) {
    // 'change' will be +1 or -1
    
    if (cart[index].quantity + change > 0) {
        cart[index].quantity += change;
    } else {
        // If quantity goes to 0, ask to remove
        if(confirm("Remove this item from cart?")) {
            cart.splice(index, 1);
        }
    }
    
    saveCart();
    
    // If we are on the cart page, we need to re-draw the list
    function changeQty(index, change) {
    if (cart[index].quantity + change > 0) {
        cart[index].quantity += change;
    } else {
        if(confirm("Remove this item?")) {
            cart.splice(index, 1);
        }
    }
    
    // Save to memory
    localStorage.setItem('ATT_Cart', JSON.stringify(cart));
    
    // Always refresh to show new prices
    location.reload(); 
 }
}

// 6. REMOVE ITEM COMPLETELY
function removeFromCart(index) {
    if(confirm("Are you sure you want to remove this item?")) {
        cart.splice(index, 1);
        saveCart();
        location.reload();
    }
}

// Helper to save and update UI
function saveCart() {
    localStorage.setItem('ATT_Cart', JSON.stringify(cart));
    updateCartBadge();
}

// 7. CHECKOUT
function processCheckout() {
    if (cart.length === 0) return alert("Cart is empty!");
    
    // Calculate final price
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (confirm(`Total is $${total.toFixed(2)}. Proceed to purchase?`)) {
        alert("Order Successful! ID: ATT-" + Math.floor(Math.random() * 9999));
        cart = [];
        saveCart();
        window.location.href = "black.html";
    }
}

// 8. CONTACT FORM
function submitContactForm(event) {
    event.preventDefault();
    document.getElementById('contact-form').reset();
    alert("Message sent! We will contact you shortly.");
}

// --- PASTE AT BOTTOM OF SCRIPT.JS ---

// Function to handle + and - clicks
function changeQty(index, change) {
    console.log("Button clicked! Index:", index, "Change:", change); // DEBUG LINE

    // 1. Calculate new quantity
    // cart[index] gets the item (like the wine bottle)
    // .quantity is the number (1, 2, 3...)
    // change is +1 or -1
    
    if (cart[index].quantity + change > 0) {
        // If the result is 1 or more, update it
        cart[index].quantity += change;
    } else {
        // If the result is 0, ask to delete
        if(confirm("Remove this item from cart?")) {
            cart.splice(index, 1);
        }
    }
    
    // 2. Save to Browser Memory
    localStorage.setItem('ATT_Cart', JSON.stringify(cart));
    
    // 3. Refresh the page to show new numbers
    location.reload(); 
}


// --- SAFE TAILORING FORM SUBMISSION (COMPLETE) ---
const tailoringForm = document.getElementById('tailoringForm');

// 🛡️ SAFETY CHECK: Only run this if the form exists on the current page
if (tailoringForm) {
    tailoringForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        // 1. Get Elements (Defined here so the timer can see them)
        const formSection = document.getElementById('tailoring-form-section');
        const successSection = document.getElementById('confirmation-message');
        const summaryBox = document.getElementById('summary-content');
        const submitBtn = document.getElementById('btn-confirm');

        // 2. Change Button State (Feedback for user)
        submitBtn.innerText = "Processing...";
        submitBtn.style.backgroundColor = "#555";
        submitBtn.disabled = true;

        // 3. Capture Values
        const bustVal = document.getElementById('bust_chest').value;
        const waistVal = document.getElementById('waist').value;
        const hipsVal = document.getElementById('hips').value;
        const shoulderVal = document.getElementById('shoulder').value;
        const sleeveVal = document.getElementById('sleeve').value || "N/A";
        const lengthVal = document.getElementById('length').value || "N/A";
        const commentsVal = document.getElementById('comments').value || "None";

        // 4. Wait 1.5 seconds then update (The Logic)
        setTimeout(function() {
            // Hide the form
            if(formSection) formSection.style.display = 'none';
            
            // Show the success message
            if(successSection) successSection.style.display = 'block';

            // Fill the summary box
            if(summaryBox) {
                summaryBox.innerHTML = `
                    <p><strong>Bust/Chest:</strong> ${bustVal} inches</p>
                    <p><strong>Waist:</strong> ${waistVal} inches</p>
                    <p><strong>Hips:</strong> ${hipsVal} inches</p>
                    <p><strong>Shoulder:</strong> ${shoulderVal} inches</p>
                    <p><strong>Sleeve:</strong> ${sleeveVal} inches</p>
                    <p><strong>Length:</strong> ${lengthVal} inches</p>
                    <p><strong>Notes:</strong> ${commentsVal}</p>
                    <p style="margin-top:10px; color:green;"><em>We have sent a copy to your email.</em></p>
                `;
            }
            
            // Scroll to top so they see the message
            window.scrollTo(0, 0);

        }, 1500); // End of Timeout
    });
}
// ------------------------------------------------

// --- STRIPE CHECKOUT LOGIC ---

// 1. Initialize Stripe with your Public Key
const stripe = Stripe('pk_test_51SkRSLF4PldbqlsvXTAIUfo06TDLq40Bz0URppq5ucMPBPDxbIrzBwM1IPkNIwPArcq6IheQLfQ1wWIQcitcnxP300Gs6vc3Dj'); 

const checkoutButton = document.getElementById('checkout-btn'); 

if (checkoutButton) {
    checkoutButton.addEventListener('click', function() {
        // Change button text so user knows something is happening
        checkoutButton.innerText = "Redirecting to Payment...";
        
        // 2. Call your Backend to create the session
        fetch('/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // ✅ FIX IS HERE: We now send the actual 'cart' variable
            body: JSON.stringify({ 
                items: cart 
            }) 
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(session) {
            // 3. Redirect to Stripe
            return stripe.redirectToCheckout({ sessionId: session.id });
        })
        .then(function(result) {
            if (result.error) {
                alert(result.error.message);
                checkoutButton.innerText = "Try Again"; // Reset button on error
            }
        })
        .catch(function(error) {
            console.error('Error:', error);
            checkoutButton.innerText = "Try Again";
        });
    });
}



function showToast() {
    // Get the snackbar DIV
    var x = document.getElementById("toast");
  
    // Add the "show" class to DIV
    x.className = "show";
  
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }