// Client facing scripts here

$(document).ready(function() {
  // Initialize the cart
  initializeCart();

  // Set up event listeners for add to cart buttons
  setupAddToCartButtons();

  // Set up checkout button functionality
  $('#checkout-button').on('click', handleCheckout);
});

// Initialize the cart from localStorage
function initializeCart() {
  if (!localStorage.getItem('forkNGoCart')) {
    localStorage.setItem('forkNGoCart', JSON.stringify([]));
  }

  // Update the cart UI on page load
  updateCartUI();
}



