// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let itemToRemove = null; // Track which item we're removing

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    displayCart();
    setupMobileMenu();
    setupCheckoutForm();
});

// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update all cart counters
    document.querySelectorAll('#cartCount').forEach(el => el.textContent = count);
    document.querySelectorAll('#mobileCartCount').forEach(el => el.textContent = count);
    document.querySelectorAll('#bottomCartCount').forEach(el => el.textContent = count);
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
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }
    
    if (cartSummary) cartSummary.style.display = 'block';
    let cartHTML = '';
    let subtotal = 0;
    
    cart.forEach((item, index) => {
        // Convert price from "1,200,000" to number 1200000
        const priceNumber = parseFloat(item.price.replace(/,/g, ''));
        const itemTotal = priceNumber * item.quantity;
        subtotal += itemTotal;
        
        // Format price for display
        const formattedPrice = formatPrice(priceNumber);
        const formattedItemTotal = formatPrice(itemTotal);
        
        // Use image if available, otherwise use icon
        const imageHTML = item.image 
            ? `<img src="${item.image}" alt="${item.name}">`
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
                    <div class="cart-item-price">MWK ${formattedItemTotal}</div>
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
    const shipping = 10000; // MWK 10,000 shipping
    const total = subtotal + shipping;
    
    if (cartSummary) {
        document.getElementById('subtotal').textContent = `MWK ${formatPrice(subtotal)}`;
        document.getElementById('shipping').textContent = `MWK ${formatPrice(shipping)}`;
        document.getElementById('total').textContent = `MWK ${formatPrice(total)}`;
    }
}

// Format price with commas
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

// Show confirmation dialog
function showRemoveConfirmation(index, productName) {
    itemToRemove = index;
    
    // Update dialog message
    const dialogMessage = document.getElementById('dialogMessage');
    if (dialogMessage) {
        dialogMessage.textContent = `Are you sure you want to remove "${productName}" from your cart?`;
    }
    
    // Show dialog
    const dialog = document.getElementById('confirmationDialog');
    if (dialog) {
        dialog.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Hide confirmation dialog
function hideConfirmation() {
    const dialog = document.getElementById('confirmationDialog');
    if (dialog) {
        dialog.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
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
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Proceed to checkout
function proceedToCheckout() {
    // Prepare order summary
    let orderText = "ORDER DETAILS:\n\n";
    let itemsText = "";
    let subtotal = 0;
    
    cart.forEach(item => {
        const priceNumber = parseFloat(item.price.replace(/,/g, ''));
        const itemTotal = priceNumber * item.quantity;
        subtotal += itemTotal;
        
        itemsText += `${item.name} x ${item.quantity} = MWK ${formatPrice(itemTotal)}\n`;
    });
    
    const shipping = 10000;
    const total = subtotal + shipping;
    
    orderText += itemsText;
    orderText += `\nSubtotal: MWK ${formatPrice(subtotal)}`;
    orderText += `\nShipping: MWK ${formatPrice(shipping)}`;
    orderText += `\nTOTAL: MWK ${formatPrice(total)}`;
    
    // Set order summary in form
    const orderSummaryInput = document.getElementById('orderSummary');
    if (orderSummaryInput) {
        orderSummaryInput.value = orderText;
    }
    
    // Display items in checkout modal
    const checkoutItems = document.getElementById('checkoutItems');
    if (checkoutItems) {
        let itemsHTML = '';
        cart.forEach(item => {
            const priceNumber = parseFloat(item.price.replace(/,/g, ''));
            const itemTotal = priceNumber * item.quantity;
            itemsHTML += `
                <div class="checkout-item" style="margin-bottom: 0.5rem;">
                    ${item.name} x ${item.quantity} = MWK ${formatPrice(itemTotal)}
                </div>
            `;
        });
        checkoutItems.innerHTML = itemsHTML;
    }
    
    // Update total in checkout modal
    const checkoutTotal = document.getElementById('checkoutTotal');
    if (checkoutTotal) {
        const total = cart.reduce((sum, item) => {
            const priceNumber = parseFloat(item.price.replace(/,/g, ''));
            return sum + (priceNumber * item.quantity);
        }, 10000); // Add shipping
        checkoutTotal.textContent = `MWK ${formatPrice(total)}`;
    }
    
    // Show checkout modal
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        checkoutModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Close checkout modal
function closeCheckoutModal() {
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        checkoutModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Setup checkout form submission
function setupCheckoutForm() {
    const form = document.getElementById('checkoutForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.submit-btn');
        if (!submitBtn) return;
        
        const originalText = submitBtn.innerHTML;
        
        // Show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        
        // Submit to Formspree
        fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Show success notification
                showSuccessNotification();
                // Clear cart
                cart = [];
                saveCart();
                updateCartCount();
                displayCart();
                closeCheckoutModal();
                form.reset();
            } else {
                alert('There was an error processing your order. Please try again.');
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

// Show success notification
function showSuccessNotification() {
    const notification = document.getElementById('successNotification');
    const overlay = document.getElementById('notificationOverlay');
    
    if (notification && overlay) {
        notification.style.display = 'block';
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Hide success notification
function hideSuccessNotification() {
    const notification = document.getElementById('successNotification');
    const overlay = document.getElementById('notificationOverlay');
    
    if (notification && overlay) {
        notification.style.display = 'none';
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Redirect to homepage after 1 second
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// Mobile Menu Functionality
function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const closeMenu = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            if (mobileMenu) {
                mobileMenu.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
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

// Close modals when clicking outside or pressing Escape
window.onclick = function(event) {
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal && event.target === checkoutModal) {
        closeCheckoutModal();
    }
    
    const confirmationDialog = document.getElementById('confirmationDialog');
    if (confirmationDialog && event.target === confirmationDialog) {
        hideConfirmation();
    }
    
    const notificationOverlay = document.getElementById('notificationOverlay');
    if (notificationOverlay && event.target === notificationOverlay) {
        hideSuccessNotification();
    }
};

// Close with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const checkoutModal = document.getElementById('checkoutModal');
        if (checkoutModal && checkoutModal.style.display === 'flex') {
            closeCheckoutModal();
        }
        
        const confirmationDialog = document.getElementById('confirmationDialog');
        if (confirmationDialog && confirmationDialog.style.display === 'flex') {
            hideConfirmation();
        }
        
        const successNotification = document.getElementById('successNotification');
        if (successNotification && successNotification.style.display === 'block') {
            hideSuccessNotification();
        }
    }
});
