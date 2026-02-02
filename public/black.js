/* ==========================================================
   black.js - The Central Logic Engine (UPDATED)
   ========================================================== */

const API_URL = '/api/items';

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. INITIALIZE CART ---
    updateCartCount();

    // --- 2. START SMOOTH SCROLL ---
    initSmoothScroll();
    
    // --- 3. PAGE CONTENT LOADER ---
    // This checks which page we are on and loads the correct items
    const grid = document.querySelector('.product-grid');
    if (grid) {
        loadCatalog(); // We are on a Catalog Page (Winery/Clothing)
    } else if (document.getElementById('page-product-detail')) {
        // Do nothing here, specific logic runs at bottom of script
    } else {
        initHomepage(); // We are on the Homepage
    }

    // --- 4. GLOBAL LISTENER (Navigation & Checkout) ---
    document.addEventListener('click', function(e) {

        // A. CLICKED CHECKOUT BUTTON?
        if (e.target && e.target.id === 'checkout-btn') {
            handleCheckout(); 
        }

        // B. CLICKED MOBILE MENU?
        if (e.target && e.target.id === 'mobile-menu-btn') {
            const navLinks = document.getElementById('nav-links-container');
            const mobileBtn = document.getElementById('mobile-menu-btn');
            if(navLinks) navLinks.classList.toggle('active');
            if(mobileBtn) mobileBtn.classList.toggle('active');
        }

        // C. CLICKED DROPDOWN?
        if (e.target && e.target.classList.contains('dropdown-toggle')) {
            e.preventDefault();
            e.stopPropagation();
            const currentMenu = e.target.nextElementSibling;
            
            document.querySelectorAll('.dropdown-content').forEach(menu => {
                if (menu !== currentMenu) menu.classList.remove('show');
            });
            
            if(currentMenu) currentMenu.classList.toggle('show');
        }

        // D. CLICKED ELSEWHERE? (Close Dropdowns)
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-content').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });

    // Run Hmmm Count
    updateHmmmCount();
});

/* ==========================================================
   CATALOG PAGE LOGIC (Winery & Clothing Pages)
   ========================================================== */
async function loadCatalog() {
    const grid = document.querySelector('.product-grid');
    if (!grid) return;

    grid.innerHTML = '<p style="text-align:center; width:100%; color:#888;">Loading collection...</p>';

    try {
        const products = await fetchInventory();
        
        grid.innerHTML = ''; 

        const isClothingPage = document.body.id === 'page-clothing' || window.location.href.includes('clothing');
        const isWineryPage = document.body.id === 'page-winery' || window.location.href.includes('winery');

        const filteredProducts = products.filter(product => {
            const cat = (product.category || '').toLowerCase();
            
            // EXPANDED WINERY FILTER
            if (isWineryPage) {
                return (cat === 'wine' || cat.includes('drink') || cat.includes('bottle') || cat.includes('alcohol') || cat.includes('beverage') || cat.includes('spirit')) 
                        && cat !== 'motivation';
            }
            
            // CLOTHING FILTER
            if (isClothingPage) {
                return (cat === 'clothing' || cat === 'suit' || cat.includes('cloth') || cat.includes('wear')) 
                        && cat !== 'motivation';
            }
            return false; 
        });

        if(filteredProducts.length === 0) {
            grid.innerHTML = '<p style="text-align:center; padding:20px;">No products found.</p>';
            return;
        }

        filteredProducts.forEach(product => {
            const card = document.createElement('div');
            card.className = 'catalog-card'; 
            
            // --- UPDATED CARD HTML: LINKS TO DETAIL PAGE ---
            card.innerHTML = `
                <div class="card-image-container" onclick="window.location.href='product-detail.html?id=${product.id}'" style="cursor:pointer;">
                    <img class="card-img" src="${product.image}" alt="${product.name}">
                </div>
                <div class="card-info">
                    <h3 onclick="window.location.href='product-detail.html?id=${product.id}'" style="cursor:pointer;">${product.name}</h3>
                    <p class="card-summary" style="display:none;">${product.description}</p>
                    
                    <div class="card-footer">
                        <span class="price">$${parseFloat(product.price).toFixed(2)}</span>
                    </div>

                    <div class="card-buttons" style="display: flex; gap: 5px; margin-top: 5px;">
                        <button onclick="addToCart('${product.id}')" class="btn btn-gold" style="flex: 2;">Add</button>
                        <button class="hmmm-btn" onclick="addToHmmm('${product.id}')" style="flex: 1; padding:0;">Hmmm</button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error("Error loading products:", error);
        grid.innerHTML = '<p>Could not connect to server.</p>';
    }
}

/* ==========================================================
   HOMEPAGE LOGIC
   ========================================================== */
async function initHomepage() {
    try {
        const items = await fetchInventory();
        const wines = items.filter(i => isCategory(i, 'wine'));
        const clothes = items.filter(i => isCategory(i, 'clothing'));
        renderGrid(wines.slice(-3), 'wine-container', 'carousel-item');
        renderGrid(clothes.slice(-3), 'suit-container', 'carousel-item');
    } catch (error) {
        console.error("Homepage Load Error:", error);
    }
}

function renderGrid(items, containerId, cardClass) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = cardClass; 
        const imgSrc = item.image || '/images/placeholder.jpg';
        
        // --- UPDATED HOMEPAGE CARDS: ALSO LINK TO DETAIL PAGE ---
        div.innerHTML = `
            <div class="card-image-container" onclick="window.location.href='product-detail.html?id=${item.id}'" style="height: 220px; cursor:pointer;">
                 <img class="card-img" src="${imgSrc}" alt="${item.name}">
            </div>
            <h3 onclick="window.location.href='product-detail.html?id=${item.id}'" style="margin-top:15px; font-size:1.1rem; cursor:pointer;">${item.name}</h3>
            <p class="price">$${parseFloat(item.price).toFixed(2)}</p>
            <button class="cta-btn " onclick="addToCart('${item.id}')" style="margin-top:10px;">Get</button>
        `;
        container.appendChild(div);
    });
}

/* ==========================================================
   "HMMM" (WISHLIST) LOGIC
   ========================================================== */
function toggleHmmm(e) {
    if(e) e.preventDefault();
    const sidebar = document.getElementById('hmmm-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if(sidebar) {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
        if (sidebar.classList.contains('open')) {
            renderHmmmList(); 
        }
    }
}

function closeAllSidebars() {
    document.querySelectorAll('.sidebar-panel').forEach(el => el.classList.remove('open'));
    document.getElementById('sidebar-overlay').classList.remove('active');
}

async function addToHmmm(itemId) {
    let hmmmList = JSON.parse(localStorage.getItem('hmmm_list')) || [];
    
    if (!hmmmList.includes(itemId)) {
        hmmmList.push(itemId);
        localStorage.setItem('hmmm_list', JSON.stringify(hmmmList));
        showToast("Hmm... Interesting.");
        updateHmmmCount();
    } else {
        showToast("Already in your thoughts.");
    }
}

function removeFromHmmm(itemId) {
    let hmmmList = JSON.parse(localStorage.getItem('hmmm_list')) || [];
    hmmmList = hmmmList.filter(id => id !== itemId);
    localStorage.setItem('hmmm_list', JSON.stringify(hmmmList));
    renderHmmmList();
    updateHmmmCount();
}

function moveHmmmToCart(itemId) {
    addToCart(itemId);
    removeFromHmmm(itemId);
    toggleHmmm(); 
}

function updateHmmmCount() {
    const hmmmList = JSON.parse(localStorage.getItem('hmmm_list')) || [];
    const badge = document.getElementById('hmmm-count');
    if(badge) badge.innerText = hmmmList.length;
}

async function renderHmmmList() {
    const container = document.getElementById('hmmm-list-container');
    const hmmmList = JSON.parse(localStorage.getItem('hmmm_list')) || [];
    
    if (hmmmList.length === 0) {
        container.innerHTML = '<p class="empty-msg" style="color:#666; text-align:center; margin-top:50px;">Your mind is clear.</p>';
        return;
    }

    container.innerHTML = '<p style="color:#666;">Loading thoughts...</p>';

    try {
        const allItems = await fetchInventory(); 
        const savedItems = allItems.filter(item => hmmmList.includes(item.id));

        container.innerHTML = ''; 

        savedItems.forEach(item => {
            const div = document.createElement('div');
            div.className = 'hmmm-item';
            div.innerHTML = `
                <img src="${item.image}" class="hmmm-img" alt="${item.name}">
                <div class="hmmm-details">
                    <h4>${item.name}</h4>
                    <p style="color:#d4af37;">$${item.price}</p>
                    <div class="hmmm-actions">
                        <button class="btn-move-cart" onclick="moveHmmmToCart('${item.id}')">Add to Cart</button>
                        <button class="btn-remove-hmmm" onclick="removeFromHmmm('${item.id}')">Forget it</button>
                    </div>
                </div>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error("Error loading Hmmm list", error);
    }
}

/* ==========================================================
   CHECKOUT LOGIC
   ========================================================== */
async function handleCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkoutButton = document.getElementById('checkout-btn');

    if (cart.length === 0) {
        showToast("Your cart is empty!");
        return;
    }

    if (checkoutButton) {
        checkoutButton.innerText = "Processing...";
        checkoutButton.disabled = true;
        checkoutButton.style.opacity = "0.7";
    }

    try {
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart: cart }) 
        });

        const data = await response.json();

        if (data.url) {
            window.location.href = data.url; 
        } else {
            showToast("Checkout failed. Try again.");
            resetCheckoutBtn(checkoutButton);
        }
    } catch (error) {
        console.error('Checkout Error:', error);
        showToast("Network error.");
        resetCheckoutBtn(checkoutButton);
    }
}

function resetCheckoutBtn(btn) {
    if (btn) {
        btn.innerText = "Secure Checkout";
        btn.disabled = false;
        btn.style.opacity = "1";
    }
}

/* ==========================================================
   HELPER FUNCTIONS
   ========================================================== */
function showToast(message) {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        document.body.appendChild(toast);
    }
    toast.innerText = message;
    toast.className = "show";
    setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
}

async function fetchInventory() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
}

function isCategory(item, type) {
    const cat = (item.category || '').toLowerCase();
    if (type === 'wine') return cat.includes('wine') || cat.includes('drink');
    if (type === 'clothing') return cat.includes('cloth') || cat.includes('suit') || cat.includes('trad') || cat.includes('access');
    return false;
}

function addToCart(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id == itemId); 
    if (existingItem) {
        existingItem.quantity += 1;
        showToast("Quantity increased!");
    } else {
        cart.push({ id: itemId, quantity: 1 });
        showToast("Item added to cart!");
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countSpan = document.getElementById('cart-count');
    if (countSpan) countSpan.innerText = totalCount;
}

/* ==========================================================
   SMOOTH SCROLL LOGIC
   ========================================================== */
function initSmoothScroll() {
    if (typeof Lenis === 'undefined') return;
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical', 
        smooth: true,
        smoothTouch: false,
    });
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}


/* ==========================================================
   PRODUCT DETAIL PAGE LOGIC
   ========================================================== */
// 1. Check if we are on the detail page
if (document.body.id === 'page-product-detail') {
    initProductDetail();
}

async function initProductDetail() {
    // Get ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        window.location.href = 'black.html'; // Redirect if no ID
        return;
    }

    try {
        const products = await fetchInventory();
        const product = products.find(p => p.id === productId);

        if (!product) {
            document.querySelector('.detail-container').innerHTML = '<p>Product not found.</p>';
            return;
        }

        // Fill Data
        document.getElementById('detail-img').src = product.image;
        document.getElementById('detail-title').innerText = product.name;
        document.getElementById('detail-price').innerText = `$${parseFloat(product.price).toFixed(2)}`;
        document.getElementById('detail-desc').innerText = product.description || "No description available.";

        // --- ADD THESE TWO LINES HERE: ---
       trackRecentlyViewed(productId); // Start the 5-second timer
       renderRecentlyViewed();         // Show previous items

        // Activate Buttons
        document.getElementById('add-btn').onclick = () => addToCart(product.id);
        document.getElementById('hmmm-btn').onclick = () => addToHmmm(product.id);

        // Open the first accordion item by default (optional)
        const firstAccordion = document.querySelector('.accordion-item');
        if(firstAccordion) {
            firstAccordion.classList.add('active');
            const content = firstAccordion.querySelector('.accordion-content');
            if(content) content.style.maxHeight = "200px";
        }

    } catch (error) {
        console.error("Error loading detail:", error);
    }
    // ... inside initProductDetail ...
    trackRecentlyViewed(productId);
    renderRecentlyViewed();
    
    // ADD THIS:
    loadReviews(productId); 

}

// 2. Accordion Logic
function toggleAccordion(button) {
    const item = button.parentElement;
    const content = button.nextElementSibling;
    
    // Toggle Active Class
    item.classList.toggle('active');

    // Smooth Height Animation
    if (item.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + "px";
    } else {
        content.style.maxHeight = "0";
    }
}

/* ==========================================================
   RECENTLY VIEWED LOGIC (With Time Delay)
   ========================================================== */

// 1. Logic to Track View (Only triggers after 5 seconds)
function trackRecentlyViewed(productId) {
    const VIEW_THRESHOLD = 5000; // 5 seconds

    setTimeout(() => {
        // If user is still on the page after 5 seconds, save it
        let recent = JSON.parse(localStorage.getItem('recently_viewed')) || [];
        
        // Remove if it already exists (so we can move it to the top)
        recent = recent.filter(id => id !== productId);
        
        // Add to the front of the array
        recent.unshift(productId);
        
        // Keep only the last 5 items
        if (recent.length > 5) recent.pop();

        localStorage.setItem('recently_viewed', JSON.stringify(recent));
        console.log("Item tracked as recently viewed:", productId); // Debug log
        
    }, VIEW_THRESHOLD);
}

// 2. Logic to Render the List
async function renderRecentlyViewed() {
    const container = document.getElementById('recently-viewed');
    if (!container) return; // Only runs if the container exists (on detail page)

    const recentIds = JSON.parse(localStorage.getItem('recently_viewed')) || [];
    
    // Get current product ID from URL to exclude it from the list
    const urlParams = new URLSearchParams(window.location.search);
    const currentId = urlParams.get('id');
    
    // Filter: Show recent items, but NOT the one we are currently looking at
    const idsToShow = recentIds.filter(id => id !== currentId);

    if (idsToShow.length === 0) return; // Nothing to show

    try {
        const allProducts = await fetchInventory();
        const productsToShow = allProducts.filter(p => idsToShow.includes(p.id));

        // Create the Section HTML
        let html = `
            <div class="recent-section-wrapper">
                <h3 class="recent-title">Interests...</h3>
                <div class="product-grid recent-grid">
        `;

        productsToShow.forEach(product => {
            html += `
                <div class="catalog-card recent-card">
                    <div class="card-image-container" onclick="window.location.href='product-detail.html?id=${product.id}'" style="cursor:pointer; height: 180px;">
                        <img class="card-img" src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="card-info" style="padding: 15px;">
                        <h4 style="font-size: 1rem; margin-bottom: 5px;">${product.name}</h4>
                        <span class="price" style="font-size: 0.9rem;">$${parseFloat(product.price).toFixed(2)}</span>
                    </div>
                </div>
            `;
        });

        html += `</div></div>`;
        container.innerHTML = html;

    } catch (error) {
        console.error("Error loading recently viewed:", error);
    }
}

/* ==========================================================
   LIVE REVIEWS LOGIC
   ========================================================== */

async function loadReviews(productId) {
    const container = document.getElementById('reviews-section');
    if (!container) return;

    // 1. Setup the HTML Structure
    container.innerHTML = `
        <div class="reviews-wrapper">
            <h3 class="section-header">Customer Reviews</h3>
            
            <div id="reviews-list" class="reviews-list">
                <p>Loading reviews...</p>
            </div>

            <div class="review-form">
                <h4>Write a Review</h4>
                <form id="review-form-element">
                    <input type="text" id="review-name" placeholder="Your Name" required>
                    <select id="review-rating" required>
                        <option value="5">★★★★★ (5 Stars)</option>
                        <option value="4">★★★★☆ (4 Stars)</option>
                        <option value="3">★★★☆☆ (3 Stars)</option>
                        <option value="2">★★☆☆☆ (2 Stars)</option>
                        <option value="1">★☆☆☆☆ (1 Star)</option>
                    </select>
                    <textarea id="review-comment" placeholder="Share your thoughts..." rows="3" required></textarea>
                    <button type="submit" class="hmmm-btn">Post Review</button>
                </form>
            </div>
        </div>
    `;

    // 2. Fetch existing reviews
    try {
        const res = await fetch(`/api/reviews?productId=${productId}`);
        const reviews = await res.json();
        renderReviewsList(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
    }

    // 3. Handle Form Submit
    document.getElementById('review-form-element').onsubmit = async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        btn.innerText = "Posting...";
        btn.disabled = true;

        const data = {
            productId: productId,
            user: document.getElementById('review-name').value,
            rating: document.getElementById('review-rating').value,
            comment: document.getElementById('review-comment').value
        };

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                // Refresh the list immediately
                const responseData = await res.json();
                addReviewToDom(responseData.review); 
                e.target.reset();
                showToast("Review Posted!");
            }
        } catch (err) {
            showToast("Failed to post review.");
        } finally {
            btn.innerText = "Post Review";
            btn.disabled = false;
        }
    };
}

function renderReviewsList(reviews) {
    const list = document.getElementById('reviews-list');
    if (reviews.length === 0) {
        list.innerHTML = '<p style="color:#888;">No reviews yet. Be the first!</p>';
        return;
    }
    list.innerHTML = '';
    // Reverse to show newest first
    reviews.reverse().forEach(addReviewToDom);
}

function addReviewToDom(review) {
    const list = document.getElementById('reviews-list');
    
    // Remove "No reviews" text if it exists
    if (list.querySelector('p')?.innerText.includes('No reviews')) {
        list.innerHTML = '';
    }

    const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
    
    const div = document.createElement('div');
    div.className = 'review-card';
    div.innerHTML = `
        <div class="review-header">
            <strong>${review.user}</strong>
            <span class="review-date">${review.date}</span>
        </div>
        <div class="review-stars">${stars}</div>
        <p class="review-text">${review.comment}</p>
    `;
    list.prepend(div); // Add to top
}


