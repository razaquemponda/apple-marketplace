// Product Data
const products = [
    {
        id: 1,
        name: "iPhone 13 Pro",
        category: "iphone",
        price: 699,
        condition: "excellent",
        description: "Like new, 256GB, 100% battery health",
        icon: "fas fa-mobile-alt",
        image: "images/iPhone13Pro.jpeg"

    },
    {
        id: 2,
        name: "MacBook Air M2",
        category: "macbook",
        price: 899,
        condition: "excellent",
        description: "2023 model, 8GB RAM, 512GB SSD",
        icon: "fas fa-laptop",
        image:"images/macbook.jpg"
    },
    {
        id: 3,
        name: "AirPods Pro 2nd Gen",
        category: "accessories",
        price: 199,
        condition: "good",
        description: "Minor signs of use, works perfectly",
        icon: "fas fa-headphones",
        image:"images/airpodspro.jpg"
    },
    {
        id: 4,
        name: "iPhone 12",
        category: "iphone",
        price: 499,
        condition: "eco",
        description: "Refurbished, eco-friendly packaging",
        icon: "fas fa-mobile-alt",
        image:"images/iphone11.jpeg"
    },
    {
        id: 5,
        name: "MacBook Pro 14\"",
        category: "macbook",
        price: 1299,
        condition: "excellent",
        description: "M1 Pro, 16GB RAM, 1TB SSD",
        icon: "fas fa-laptop",
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
        image:"images/watch.jpg"

    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayProducts(products);
    setupFormSubmission();
});

// Display products
function displayProducts(productsToShow) {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const conditionText = {
            'excellent': 'Excellent Condition',
            'good': 'Good Condition',
            'eco': 'Eco-Friendly'
        };
        
        const conditionClass = {
            'excellent': 'condition-excellent',
            'good': 'condition-good',
            'eco': 'condition-eco'
        };
        
        // USE IMAGE IF AVAILABLE, OTHERWUSE USE ICON
        const imageHTML = product.image 
            ? `<img src="${product.image}" alt="${product.name}" class="product-img">`
            : `<i class="${product.icon}"></i>`;
        
        const productCard = `
            <div class="product-card">
                <div class="product-image">
                    ${imageHTML} <!-- THIS SHOWS THE IMAGE -->
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <span class="condition-badge ${conditionClass[product.condition]}">
                        ${conditionText[product.condition]}
                    </span>
                    <p>${product.description}</p>
                    <div class="product-price">MWK${product.price}</div>
                    <button class="order-button" onclick="openOrderModal('${product.name}', ${product.price})">
                        <i class="fas fa-shopping-cart"></i> Order Now
                    </button>
                </div>
            </div>
        `;
        
        productGrid.innerHTML += productCard;
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
}

// Modal functions
function openOrderModal(productName, productPrice) {
    const modal = document.getElementById('orderModal');
    const productNameElement = document.getElementById('productName');
    const productInput = document.getElementById('selectedProduct');
    
    productNameElement.textContent = productName;
    productInput.value = `${productName} - MWK${productPrice}`;
    
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
}

// Form submission with Formspree
// Form submission with Formspree
function setupFormSubmission() {
    const form = document.getElementById('orderForm');
    
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
                // USE THE COOL NOTIFICATION
                showSuccessNotification();
                form.reset();
                closeModal();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            } else {
                alert('There was an error submitting your order. Please try again.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
            
        } catch (error) {
            alert('Network error. Please check your connection and try again.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
}
// ====================
// SUCCESS NOTIFICATION
// ====================

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
    
    // Close order modal too
    closeModal();
}

// Close notification when clicking overlay
document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('notificationOverlay');
    if (overlay) {
        overlay.addEventListener('click', hideSuccessNotification);
    }
});



