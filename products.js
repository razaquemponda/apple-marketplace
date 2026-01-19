// Product Data - Expanded
const allProducts = [
    {
        id: 1,
        name: "iPhone 13 Pro",
        category: "iphone",
        price: 699,
        condition: "excellent",
        description: "Like new, 256GB, 100% battery health",
        icon: "fas fa-mobile-alt",
        conditionText: "Excellent Condition",
        conditionClass: "condition-excellent",
        image:"images/iphone13.jpeg"
    },
    {
        id: 2,
        name: "MacBook Air M2",
        category: "macbook",
        price: 899,
        condition: "excellent",
        description: "2023 model, 8GB RAM, 512GB SSD",
        icon: "fas fa-laptop",
        conditionText: "Excellent Condition",
        conditionClass: "condition-excellent",
        image:"images/macbook-air.jpg"
    },
    {
        id: 3,
        name: "AirPods Pro 2nd Gen",
        category: "accessories",
        price: 199,
        condition: "good",
        description: "Minor signs of use, works perfectly",
        icon: "fas fa-headphones",
        conditionText: "Good Condition",
        conditionClass: "condition-good",
        image:"images/airpods.jpg"
    },
    {
        id: 4,
        name: "iPhone 12",
        category: "iphone",
        price: 499,
        condition: "eco",
        description: "Refurbished, eco-friendly packaging",
        icon: "fas fa-mobile-alt",
        conditionText: "Eco-Friendly",
        conditionClass: "condition-eco",
        image:"images/iphone 12.jpeg"

    },
    {
        id: 5,
        name: "MacBook Pro 14",
        category: "macbook",
        price: 1299,
        condition: "excellent",
        description: "M1 Pro, 16GB RAM, 1TB SSD",
        icon: "fas fa-laptop",
        conditionText: "Excellent Condition",
        conditionClass: "condition-excellent",
        image:"images/macbook4.jpg"
    },
    {
        id: 6,
        name: "Apple Watch Series 8",
        category: "accessories",
        price: 299,
        condition: "good",
        description: "GPS model, includes charger",
        icon: "fas fa-clock",
        conditionText: "Good Condition",
        conditionClass: "condition-good",
        image:"images/watch.jpg"
    },
    {
        id: 7,
        name: "iPad Air 5th Gen",
        category: "accessories",
        price: 599,
        condition: "excellent",
        description: "M1 chip, 64GB, like new",
        icon: "fas fa-tablet-alt",
        conditionText: "Excellent Condition",
        conditionClass: "condition-excellent",
        image:"images/ipad.jpg"
    },
    {
        id: 8,
        name: "Magic Keyboard",
        category: "accessories",
        price: 249,
        condition: "good",
        description: "For iPad Pro, slight wear",
        icon: "fas fa-keyboard",
        conditionText: "Good Condition",
        conditionClass: "condition-good",
        image:"images/keyboard.jpg"
    }
];

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
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            closeMobileMenu();
        }
    });
    
    // Close menu with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.style.display === 'block') {
            closeMobileMenu();
        }
    });
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Update mobile cart count
function updateMobileCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const mobileCartCount = document.getElementById('mobileCartCount');
    if (mobileCartCount) {
        mobileCartCount.textContent = count;
    }
}

// Load products
function loadProducts(products) {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        // Use image if available, otherwise use icon
        const imageHTML = product.image 
            ? `<img src="${product.image}" alt="${product.name}" class="product-img">`
            : `<i class="${product.icon}"></i>`;
        
        const productCard = `
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
                    <div class="product-price">MWK${product.price}</div>
                    <button class="order-button" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
        productGrid.innerHTML += productCard;
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
            cart[existingIndex].quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
        
        // Show subtle notification
        showCartNotification(product.name);
    }
}

// Show notification function
function showCartNotification(productName) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.cart-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Added to cart: ${productName}</span>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 2 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 2000);
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('#cartCount').forEach(element => {
        element.textContent = count;
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    loadProducts(allProducts);
    updateMobileCartCount(); // Add this line
    setupMobileMenu(); // Add this line
});
