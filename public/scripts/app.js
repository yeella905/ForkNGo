// Client facing scripts here

$(document).ready(function() {
  // Initialize the cart
  initializeCart();

  // Set up event listeners for add to cart buttons
  setupAddToCartButtons();

  // Set up checkout button functionality
  $('#checkout-button').on('click', placeOrder);

  // Disable Place Order button if cart is empty
  updateCheckoutButtonState();
});

let cart = [];

// Update checkout button state based on cart
const updateCheckoutButtonState = function () {
  const $checkoutButton = $('#checkout-button');
  if (cart.length === 0) {
    $checkoutButton.prop('disabled', true);
  } else {
    $checkoutButton.prop('disabled', false);
  }
};

// Initialize the cart from localStorage
const initializeCart = function() {
  // Update the cart UI on page load
  updateCartUI(cart);
};

const placeOrder = function() {
  // Disable the button
  const $checkoutButton = $('#checkout-button');
  $checkoutButton.prop('disabled', true).text('Processing');

  let recipient_id = $("#cart-content").data("recipient-id");

  let o = {
    recipient_id: recipient_id,
    items: cart.map(it => {
      return {
        food_items_id : it.food_items_id,
        quantity : it.quantity,
        special_request: it.special_request,
      };
    }),
  }

  $.post({
    url: "/api/orders",
    data: JSON.stringify(o),
    contentType: "application/json"
  }).done(res => {
    // Show success message
    const $cartContent = $('#cart-content');
    $cartContent.prepend('<div class="order-success-message">Order placed successfully!</div>');

    cart = [];
    updateCartUI(cart);

    // Change button text to "Order Placed" for a while
    $checkoutButton.text('Order Placed!');

    console.log(res);
  }).fail(err => {
    console.log(err);
  });
};

// Set up data attributes and event listeners for Add to Cart buttons
const setupAddToCartButtons = function() {
  $('.add-to-cart-btn').each(function() {
    const $foodItem = $(this).closest('.food-item');
    const foodId = $foodItem.data('food-id')
    const foodName = $foodItem.find('.food-item-name').text();
    const foodPrice = parseFloat($foodItem.find('.food-item-price').text().replace('$', ''));
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
      const quantity = parseInt($(this).closest('.food-item').find('.food-item-quantity').val(), 10);

      addToCart(id, name, price, image, specialRequest);

    });
  });
};

/**
 * Add food item to the cart
 * @param {number} id - Food item ID
 * @param {string} name - Food item name
 * @param {number} price - Food item price
 * @param {string} image - Food item image URL
 * @param {string} specialRequest - Special request for this item
 * @param {number} quantity - The selected quantity of the food item
 */

const addToCart = function(id, name, price, image, specialRequest) {
  // Calculate tax (13%)
  const tax = price * 0.13;

  // Check if item already exists in cart
  const existingItemIndex = cart.findIndex(item => item.food_items_id === id && item.special_request === specialRequest);

  if (existingItemIndex !== -1) { // findIndex method returns -1
    // Item already exists with same special request, increment quantity
    cart[existingItemIndex].quantity += 1;
  } else {
    // Add new item if item doesn't exist or has different special request
    cart.push({
      food_items_id: id,
      name: name,
      price: price,
      tax: tax,
      quantity: 1,
      special_request: specialRequest,
      image: image
    });
  }

  updateCartUI(cart);
};

const cartContentTemplate = `
<% if (items.length > 0) { %>
<div id="cart-items" class="cart-items">
  <% items.forEach(it => { %>
    <div class="cart-item">
      <span><%= it.quantity %></span>
      <span><%= it.name %></span>
      <span>$<%= it.price.toFixed(2) %></span>
    </div>
  <% }); %>
</div>
<div id="cart-total" class="cart-total">
  <div class="cart-subtotal">Subtotal: $<%= subtotal.toFixed(2) %></div>
  <div class="cart-tax">Tax: $<%= taxtotal.toFixed(2) %></div>
  <div class="cart-total-amount">Total: $<%= (subtotal + taxtotal).toFixed(2) %></div>
</div>
<% } else { %>
<span>Cart is empty</span>
<% } %>
`;

// Update the cart UI
const updateCartUI = function(cart) {
  const $cartContent = $("#cart-content");

  // Calculate the totals
  const tax_rate = 0.13;
  const subtotal = cart.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const taxtotal = subtotal * tax_rate;

  // Clear current cart items
  $cartContent.empty();
  $cartContent.html(
    ejs.render(cartContentTemplate, {
      items: cart,
      subtotal: subtotal,
      taxtotal: taxtotal,
    })
  );

  // Update checkout(Place order) button state
  updateCheckoutButtonState();
}
