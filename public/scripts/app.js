// Client facing scripts here

$(document).ready(function() {
  // Initialize the cart
  initializeCart();

  // Set up event listeners for add to cart buttons
  setupAddToCartButtons();

  // Set up checkout button functionality
  $('#checkout-button').on('click', placeOrder);
});

let cart = [];

// Initialize the cart from localStorage
const initializeCart = function() {
  // Update the cart UI on page load
  updateCartUI(cart);
};

const placeOrder = function() {
  console.log("TBD");
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

const itemsTemplate = `
<% if (items.length > 0) { %>
  <div>cart has <%= items.length %> items</div>
<% } else { %>
  <div>cart is empty</div>
<% } %>
`;

// Update the cart UI
const updateCartUI = function(cart) {
  const $cartItems = $('#cart-items');

  // Calculate the totals
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  let subtotal = 0;
  let taxTotal = 0;

  // Clear current cart items
  $cartItems.empty();
  $cartItems.html(ejs.render(itemsTemplate, {
    items: cart
  }));

  // Add each item to the cart UI
  cart.forEach((item, index) => {
    const itemSubtotal = item.price * item.quantity;
    const itemTax = item.tax * item.quantity;
    subtotal += itemSubtotal;
    taxTotal += itemTax;

// ... in progress

  });
}
