function initializeCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemCount = cart.length;
    const cartCount = document.querySelector('.cart-items');
    if (cartCount) {
        cartCount.textContent = `(${cartItemCount})`;
    }
}
document.addEventListener('DOMContentLoaded', initializeCartCount);
