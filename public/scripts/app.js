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
const initializeCart = function() {
  if (!localStorage.getItem('forkNGoCart')) {
    localStorage.setItem('forkNGoCart', JSON.stringify([]));
  }

  // Update the cart UI on page load
  updateCartUI();
};

// Set up data attributes and event listeners for Add to Cart buttons
const setupAddToCartButtons = function() {
  $('add-to-cart-btn').each(function() {
    const $foodItem = $(this).closest('.food-item');
    const foodId = $foodItem.index() + 1;
    const foodName = $foodItem.find('.food-item-name').text();
    const foodPrice = $foodItem.find('.food-item-price').text();
    const foodImage = $foodItem.find('img').attr('src');

    // Set data attributes for the button
    $(this).attr({
      'data-food-id': foodId,
      'data-food-name': foodName,
      'data-food-price': foodPrice,
      'data-food-image': foodImage
    });

    // Add click event listener
    $(this).on('click', function() {
      const id = $(this).data('food-id');
      const name = $(this).data('food-name');
      const price = $(this).data('food-price');
      const image = $(this).data('food-image');
      const specialRequest = $(this).closest('.food-item-actions').find('.special-request-input').val();

      addToCart(id, name, price, image, specialRequest);

    });
  });
}
