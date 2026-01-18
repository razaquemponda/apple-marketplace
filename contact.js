// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('#cartCount').forEach(element => {
        element.textContent = count;
    });
}

// Show success notification
function showSuccessNotification() {
    const notification = document.getElementById('successNotification');
    const overlay = document.getElementById('notificationOverlay');
    
    notification.style.display = 'block';
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Hide success notification
function hideSuccessNotification() {
    const notification = document.getElementById('successNotification');
    const overlay = document.getElementById('notificationOverlay');
    
    notification.style.display = 'none';
    overlay.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Setup contact form
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.contact-submit');
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

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    setupContactForm();
    
    // Close notification when clicking overlay
    const overlay = document.getElementById('notificationOverlay');
    if (overlay) {
        overlay.addEventListener('click', hideSuccessNotification);
    }
});