// Product Data for Homepage
const products = [
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
        image: "images/macbook-air.jpg",
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
        image: "images/airpods.jpg",
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
        image: "images/iphone 12.jpeg",
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
        image: "images/macbook4.jpg",
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
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayProducts(products);
    setupFormSubmission();
    setupMobileMenu();
    updateCartCount();
});

// Display products for both desktop and mobile
function displayProducts(productsToShow) {
    const desktopGrid = document.getElementById('desktopProductGrid');
    const mobileGrid = document.getElementById('mobileProductGrid');
    
    // Clear containers
    if (desktopGrid) desktopGrid.innerHTML = '';
    if (mobileGrid) mobileGrid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const imageHTML = product.image 
            ? `<img src="${product.image}" alt="${product.name}">`
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
                    <button class="order-button" onclick="openOrderModal('${product.name}', '${product.price}')">
                        <i class="fas fa-shopping-cart"></i> Order Now
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
                    <button class="order-button" onclick="openOrderModal('${product.name}', '${product.price}')">
                        <i class="fas fa-shopping-cart"></i> Order Now
                    </button>
                </div>
            </div>
        `;
        
        // Add to appropriate grids
        if (desktopGrid) desktopGrid.innerHTML += desktopCard;
        if (mobileGrid) mobileGrid.innerHTML += mobileCard;
    });
}

// Filter products by category
function filterProducts(category) {
    if (category === 'all') {
        displayProducts(products);
    } else {
        const filtered = products.filter(product => product.category === category);
        displayProducts(filtered);
    }
    
    // Scroll to products section
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Modal functions
function openOrderModal(productName, productPrice) {
    const modal = document.getElementById('orderModal');
    const productNameElement = document.getElementById('productName');
    const productInput = document.getElementById('selectedProduct');
    
    productNameElement.textContent = productName;
    productInput.value = `${productName} - MWK ${productPrice}`;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('orderModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('orderModal');
    if (event.target === modal) {
        closeModal();
    }
};

// Form submission with Formspree
function setupFormSubmission() {
    const form = document.getElementById('orderForm');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        try {
            // Submit to Formspree
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showSuccessNotification();
                form.reset();
                closeModal();
            } else {
                alert('There was an error submitting your order. Please try again.');
            }
        } catch (error) {
            alert('Network error. Please check your connection and try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
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
    mobileMenu.style.display = 'none';
    document.body.style.overflow = 'auto';
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

// Show success notification
function showSuccessNotification() {
    const notification = document.getElementById('successNotification');
    const overlay = document.getElementById('notificationOverlay');
    
    // Show them
    notification.style.display = 'block';
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Hide success notification
function hideSuccessNotification() {
    const notification = document.getElementById('successNotification');
    const overlay = document.getElementById('notificationOverlay');
    
    // Hide them
    notification.style.display = 'none';
    overlay.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close notification when clicking overlay
document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('notificationOverlay');
    if (overlay) {
        overlay.addEventListener('click', hideSuccessNotification);
    }
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const notification = document.getElementById('successNotification');
            if (notification && notification.style.display === 'block') {
                hideSuccessNotification();
            }
            const modal = document.getElementById('orderModal');
            if (modal && modal.style.display === 'flex') {
                closeModal();
            }
        }
    });
});
