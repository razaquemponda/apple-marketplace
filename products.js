// Product Data for Products Page
const allProducts = [
    {
        id: 1,
        name: "iPhone 13 Pro",
        category: "iphone",
        price: "1,200,000",
        condition: "excellent",
        description: "Like new, 256GB, 100% battery health",
        icon: "fas fa-mobile-alt",
        image: "images/iphone13pro.jpeg",
        conditionText: "Excellent Condition",
        conditionClass: "condition-excellent"
    },
    {
        id: 2,
        name: "MacBook Air M2",
        category: "macbook",
        price: "2,500,000",
        condition: "excellent",
        description: "2023 model, 8GB RAM, 512GB SSD",
        icon: "fas fa-laptop",
        image: "images/macbook4.jpg",
        conditionText: "Excellent Condition",
        conditionClass: "condition-excellent"
    },
    {
        id: 3,
        name: "AirPods Pro 2nd Gen",
        category: "accessories",
        price: "450,000",
        condition: "good",
        description: "Minor signs of use, works perfectly",
        icon: "fas fa-headphones",
        image: "images/airpodspro.jpg",
        conditionText: "Good Condition",
        conditionClass: "condition-good"
    },
    {
        id: 4,
        name: "iPhone 12",
        category: "iphone",
        price: "850,000",
        condition: "eco",
        description: "Refurbished, eco-friendly packaging",
        icon: "fas fa-mobile-alt",
        image: "images/iphone11.jpeg",
        conditionText: "Eco-Friendly",
        conditionClass: "condition-eco"
    },
    {
        id: 5,
        name: "MacBook Pro 14\"",
        category: "macbook",
        price: "3,800,000",
        condition: "excellent",
        description: "M1 Pro, 16GB RAM, 1TB SSD",
        icon: "fas fa-laptop",
        image: "images/macbook.jpg",
        conditionText: "Excellent Condition",
        conditionClass: "condition-excellent"
    },
    {
        id: 6,
        name: "Apple Watch Series 8",
        category: "accessories",
        price: "750,000",
        condition: "good",
        description: "GPS model, includes charger",
        icon: "fas fa-clock",
        image: "images/watch.jpg",
        conditionText: "Good Condition",
        conditionClass: "condition-good"
    },
    {
        id: 7,
        name: "iPad Air 5th Gen",
        category: "accessories",
        price: "1,500,000",
        condition: "excellent",
        description: "M1 chip, 64GB, like new",
        icon: "fas fa-tablet-alt",
        image: "images/ipad.jpg",
        conditionText: "Excellent Condition",
        conditionClass: "condition-excellent"
    },
    {
        id: 8,
        name: "Magic Keyboard",
        category: "accessories",
        price: "350,000",
        condition: "good",
        description: "For iPad Pro, slight wear",
        icon: "fas fa-keyboard",
        image: "images/keyboard.jpg",
        conditionText: "Good Condition",
        conditionClass: "condition-good"
    }
];

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadProducts(allProducts);
    setupMobileMenu();
    updateCartCount();
});

// Load products for both desktop and mobile
function loadProducts(products) {
    const desktopGrid = document.getElementById('desktopProductsGrid');
    const mobileGrid = document.getElementById('mobileProductsGrid');
    
    // Clear containers
    if (desktopGrid) desktopGrid.innerHTML = '';
    if (mobileGrid) mobileGrid.innerHTML = '';
    
    products.forEach(product => {
        const imageHTML = product.image 
            ? `<img src="${product.image}" alt="${product.name}" class="product-img">`
            : `<i class="${product.icon}"></i>`;
        
        // ===== DESKTOP CARD (3-4 per row) =====
        const desktopCard = `
            <div class="product-card">
                <div class="product-image">
                    ${imageHTML}
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <span class="condition-badge ${product.conditionClass}">
                        ${product.conditionText}
                    </span>
                    <p>${product.description}</p>
                    <div class="product-price">MWK ${product.price}</div>
                    <button class="order-button" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
        
        // ===== MOBILE CARD (2 per row) =====
        const mobileCard = `
            <div class="product-card">
                <div class="product-image">
                    ${imageHTML}
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <span class="condition-badge ${product.conditionClass}">
                        ${product.conditionText}
                    </span>
                    <p class="mobile-description">${product.description.substring(0, 60)}...</p>
                    <div class="product-price">MWK ${product.price}</div>
                    <button class="order-button" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
        
        // Add to appropriate grids
        if (desktopGrid) desktopGrid.innerHTML += desktopCard;
        if (mobileGrid) mobileGrid.innerHTML += mobileCard;
    });
}

// Filter products
function filterProducts(category) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    if (category === 'all') {
        loadProducts(allProducts);
    } else {
        const filtered = allProducts.filter(product => product.category === category);
        loadProducts(filtered);
    }
}

// Add to cart function
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    
    if (product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Check if product already in cart
        const existingIndex = cart.findIndex(item => item.id === productId);
        
        if (existingIndex > -1) {
            // Increase quantity
            cart[existingIndex].quantity += 1;
        } else {
            // Add new item
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                icon: product.icon,
                conditionText: product.conditionText,
                conditionClass: product.conditionClass,
                quantity: 1
            });
        }
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
        
        // Show success notification
        showCartNotification();
    }
}

// Show cart notification
function showCartNotification() {
    const notification = document.getElementById('successNotification');
    const overlay = document.getElementById('notificationOverlay');
    
    if (notification && overlay) {
        notification.style.display = 'block';
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            if (notification.style.display === 'block') {
                hideCartNotification();
            }
        }, 3000);
    }
}

function hideCartNotification() {
    const notification = document.getElementById('successNotification');
    const overlay = document.getElementById('notificationOverlay');
    
    if (notification && overlay) {
        notification.style.display = 'none';
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update all cart counters
    document.querySelectorAll('#cartCount').forEach(el => el.textContent = count);
    document.querySelectorAll('#mobileCartCount').forEach(el => el.textContent = count);
    document.querySelectorAll('#bottomCartCount').forEach(el => el.textContent = count);
}

// Mobile Menu Functionality
function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const closeMenu = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            mobileMenu.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeMenu) {
        closeMenu.addEventListener('click', closeMobileMenu);
    }
    
    // Close menu when clicking outside
    if (mobileMenu) {
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                closeMobileMenu();
            }
        });
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close notification when clicking overlay
document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('notificationOverlay');
    if (overlay) {
        overlay.addEventListener('click', hideCartNotification);
    }
});
