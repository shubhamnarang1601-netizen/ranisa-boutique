/**
 * Ranisa Boutique - Main Scripts
 * Handles UI interactions for the static version
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initCartCounter();
});

/**
 * Mobile Navigation Toggle
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            // In a real implementation, we'd toggle a specific mobile-nav class
            // For now, we'll just toggle a simple active state
            nav.classList.toggle('mobile-active');

            // Basic animation for the hamburger
            const spans = menuToggle.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('open'));
        });
    }
}

/**
 * Initialize Cart Counter from LocalStorage
 */
function initCartCounter() {
    const cartBadge = document.querySelector('.cart-badge');
    if (!cartBadge) return;

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((total, item) => total + item.quantity, 0);

    if (count > 0) {
        cartBadge.textContent = count;
        cartBadge.style.display = 'flex';
    } else {
        cartBadge.style.display = 'none';
    }
}

/**
 * Helper to add to cart (can be used on product pages)
 */
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = cart.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    initCartCounter();

    // Optional: show notification
    alert(`${product.name} added to cart!`);
}
