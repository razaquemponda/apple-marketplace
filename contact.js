// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    setupMobileMenu();
    setupContactForm();
});

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

// Setup contact form
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.contact-submit');
        if (!submitBtn) return;
        
        const originalText = submitBtn.innerHTML;
        
        // Show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
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
                showSuccessNotification();
                form.reset();
            } else {
                alert('There was an error sending your message. Please try again.');
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
    }
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
        }
    });
});
