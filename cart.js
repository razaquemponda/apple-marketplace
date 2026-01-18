// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count in navigation
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('#cartCount').forEach(element => {
        element.textContent = count;
    });
}

// Display cart items
function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add some products from our store!</p>
                <a href="products.html" class="cta-button">Browse Products</a>
            </div>
        `;
        cartSummary.style.display = 'none';
        return;
    }
    
    cartSummary.style.display = 'block';
    let cartHTML = '';
    let subtotal = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-image">
                    <i class="${item.icon}"></i>
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <span class="condition-badge ${item.conditionClass}">
                        ${item.conditionText}
                    </span>
                    <div class="cart-item-price">MWK${itemTotal.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" value="${item.quantity}" 
                               min="1" onchange="updateQuantity(${index}, 0, this.value)">
                        <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="remove-item" onclick="removeFromCart(${index})">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartItems.innerHTML = cartHTML;
    
    // Update summary
    const shipping = 15000;
    const total = subtotal + shipping;
    
    document.getElementById('subtotal').textContent = `MWK${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `MWk${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `MWK${total.toFixed(2)}`;
}

// Update quantity
function updateQuantity(index, change, newValue) {
    if (newValue !== undefined) {
        cart[index].quantity = parseInt(newValue) || 1;
    } else {
        cart[index].quantity += change;
        if (cart[index].quantity < 1) cart[index].quantity = 1;
    }
    
    saveCart();
    displayCart();
    updateCartCount();
}

// Remove from cart
let itemToRemove = null; // Track which item we're removing

// Show confirmation dialog
function showRemoveConfirmation(index, productName) {
    itemToRemove = index;
    
    // Update dialog message
    document.getElementById('dialogMessage').textContent = 
        `Are you sure you want to remove "${productName}" from your cart?`;
    
    // Show dialog
    document.getElementById('confirmationDialog').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Hide confirmation dialog
function hideConfirmation() {
    document.getElementById('confirmationDialog').style.display = 'none';
    document.body.style.overflow = 'auto';
    itemToRemove = null;
}

// Actually remove the item after confirmation
function confirmRemove() {
    if (itemToRemove !== null) {
        cart.splice(itemToRemove, 1);
        saveCart();
        displayCart();
        updateCartCount();
        hideConfirmation();
        
        // Show notification
        showNotification('Item removed from cart', 'info');
    }
}

// Update the cart item display to use confirmation dialog
function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add some products from our store!</p>
                <a href="products.html" class="cta-button">Browse Products</a>
            </div>
        `;
        cartSummary.style.display = 'none';
        return;
    }
    
    cartSummary.style.display = 'block';
    let cartHTML = '';
    let subtotal = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        // Use image if available, otherwise use icon
        const imageHTML = item.image 
            ? `<img src="${item.image}" alt="${item.name}" class="product-img">`
            : `<i class="${item.icon}"></i>`;
        
        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-image">
                    ${imageHTML}
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <span class="condition-badge ${item.conditionClass}">
                        ${item.conditionText}
                    </span>
                    <div class="cart-item-price">MWK${itemTotal.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" value="${item.quantity}" 
                               min="1" onchange="updateQuantity(${index}, 0, this.value)">
                        <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="remove-item" onclick="showRemoveConfirmation(${index}, '${item.name}')">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartItems.innerHTML = cartHTML;
    
    // Update summary
    const shipping = 10;
    const total = subtotal + shipping;
    
    document.getElementById('subtotal').textContent = `MWK${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `MWK${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `MWK${total.toFixed(2)}`;
}

// Notification function (add this if you don't have it)
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `cart-notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 2000);
}
// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Proceed to checkout
function proceedToCheckout() {
    // Prepare order summary
    let orderText = "Order Details:\n";
    cart.forEach(item => {
        orderText += `${item.name} x ${item.quantity} = MWK${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const total = subtotal + 15000;
    
    orderText += `\nSubtotal: MWK${subtotal.toFixed(2)}`;
    orderText += `\nShipping: MWK15,000.00`;
    orderText += `\nTotal: MWK${total.toFixed(2)}`;
    
    // Set order summary in form
    document.getElementById('orderSummary').value = orderText;
    
    // Display items in checkout modal
    const checkoutItems = document.getElementById('checkoutItems');
    checkoutItems.innerHTML = cart.map(item => `
        <div class="checkout-item">
            ${item.name} x ${item.quantity} - MWK${(item.price * item.quantity).toFixed(2)}
        </div>
    `).join('');
    
    document.getElementById('checkoutTotal').textContent = `MWK${total.toFixed(2)}`;
    
    // Show modal
    document.getElementById('checkoutModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close checkout modal
function closeCheckoutModal() {
    document.getElementById('checkoutModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    displayCart();
    
    // Setup checkout form
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            // Show loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            
            // Submit to Formspree
            fetch(this.action, {
                method: 'POST',
                body: new FormData(this),
                headers: {
                    'Accept': 'application/json'
                }
            })
                       .then(response => {
                if (response.ok) {
                    // USE OUR COOL NOTIFICATION INSTEAD OF ALERT
                    showSuccessNotification(); // <-- ADD THIS LINE
                    this.reset();
                    closeCheckoutModal();
                } else {
                    alert('There was an error. Please try again.');
                }
            })
            .catch(error => {
                alert('Network error. Please check your connection.');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            });
        });
    }
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('checkoutModal');
    if (event.target === modal) {
        closeCheckoutModal();
    }
};
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
    
    // Clear cart and go to homepage
    cart = [];
    saveCart();
    updateCartCount();
    
    // Go to homepage after 1 second
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Close notification when clicking overlay
document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('notificationOverlay');
    if (overlay) {
        overlay.addEventListener('click', hideSuccessNotification);
    }
});
