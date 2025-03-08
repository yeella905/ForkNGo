// Cart handling functions

// Initialize the cart from DB or create empty cart
// cart.js - Client-side cart management

/**
 * Cart handling functions for food ordering application
 */

// Initialize the cart from localStorage or create empty cart
const initializeCart = () => {
  const savedCart = localStorage.getItem('foodAppCart');
  return savedCart ? JSON.parse(savedCart) : [];
};

// Save cart to localStorage
const saveCart = (cart) => {
  localStorage.setItem('foodAppCart', JSON.stringify(cart));
};

// Get current cart
const getCart = () => {
  return initializeCart();
};

// Add item to cart
const addToCart = (item) => {
  const cart = getCart();

  // Check if item already exists in cart
  const existingItemIndex = cart.findIndex(cartItem =>
    cartItem.food_items_id === item.food_items_id &&
    cartItem.special_request === item.special_request
  );

  if (existingItemIndex !== -1) {
    // Item exists, update quantity
    cart[existingItemIndex].quantity += item.quantity || 1;
  } else {
    // New item, add to cart
    cart.push({
      food_items_id: item.food_items_id,
      name: item.name,
      price: item.price,
      tax: item.tax || (item.price * 0.10), // Default 10% tax if not provided
      quantity: item.quantity || 1,
      special_request: item.special_request || ''
    });
  }

  saveCart(cart);
  updateCartUI();
  return cart;
};

// Remove item from cart
const removeFromCart = (index) => {
  const cart = getCart();
  if (index >= 0 && index < cart.length) {
    cart.splice(index, 1);
    saveCart(cart);
    updateCartUI();
  }
  return cart;
};

// Update item quantity
const updateItemQuantity = (index, quantity) => {
  const cart = getCart();
  if (index >= 0 && index < cart.length) {
    cart[index].quantity = quantity;
    if (quantity <= 0) {
      // Remove item if quantity is zero or negative
      cart.splice(index, 1);
    }
    saveCart(cart);
    updateCartUI();
  }
  return cart;
};

// Clear the entire cart
const clearCart = () => {
  localStorage.removeItem('foodAppCart');
  updateCartUI();
  return [];
};

// Calculate cart totals
const calculateCartTotals = () => {
  const cart = getCart();

  return cart.reduce((totals, item) => {
    const itemSubtotal = item.price * item.quantity;
    const itemTax = item.tax * item.quantity;

    totals.subtotal += itemSubtotal;
    totals.tax += itemTax;
    totals.total += (itemSubtotal + itemTax);
    totals.itemCount += item.quantity;

    return totals;
  }, { subtotal: 0, tax: 0, total: 0, itemCount: 0 });
};

// Update the cart UI elements
const updateCartUI = () => {
  const cartItemsElement = document.getElementById('cart-items');
  const cartTotalElement = document.getElementById('cart-total');
  const cartCountElement = document.getElementById('cart-count');
  const cartSidebarCountElement = document.getElementById('cart-sidebar-count');

  if (!cartItemsElement) return; // Skip if elements don't exist

  const cart = getCart();
  const totals = calculateCartTotals();

  // Update item count badges (both in header and sidebar)
  if (cartCountElement) {
    cartCountElement.textContent = totals.itemCount.toString();
    cartCountElement.style.display = totals.itemCount > 0 ? 'inline-block' : 'none';
  }

  if (cartSidebarCountElement) {
    cartSidebarCountElement.textContent = totals.itemCount.toString();
    cartSidebarCountElement.style.display = totals.itemCount > 0 ? 'inline-block' : 'none';
  }

  // Update cart items list
  if (cartItemsElement) {
    cartItemsElement.innerHTML = '';

    if (cart.length === 0) {
      cartItemsElement.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    } else {
      cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
          <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">$${(item.price).toFixed(2)}</div>
            ${item.special_request ? `<div class="cart-item-notes">Note: ${item.special_request}</div>` : ''}
          </div>
          <div class="cart-item-controls">
            <button class="quantity-btn decrease" data-index="${index}">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="quantity-btn increase" data-index="${index}">+</button>
            <button class="remove-btn" data-index="${index}">×</button>
          </div>
        `;
        cartItemsElement.appendChild(itemElement);
      });
    }
  }

  // Update cart totals
  if (cartTotalElement) {
    cartTotalElement.innerHTML = `
      <div class="cart-subtotal">Subtotal: $${totals.subtotal.toFixed(2)}</div>
      <div class="cart-tax">Tax: $${totals.tax.toFixed(2)}</div>
      <div class="cart-total-amount">Total: $${totals.total.toFixed(2)}</div>
    `;
  }

  // Set up event listeners for the cart UI controls
  setupCartEventListeners();
};

// Set up event listeners for cart UI elements
const setupCartEventListeners = () => {
  // Increase quantity buttons
  document.querySelectorAll('.quantity-btn.increase').forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.getAttribute('data-index'));
      const cart = getCart();
      updateItemQuantity(index, cart[index].quantity + 1);
    });
  });

  // Decrease quantity buttons
  document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.getAttribute('data-index'));
      const cart = getCart();
      updateItemQuantity(index, cart[index].quantity - 1);
    });
  });

  // Remove item buttons
  document.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.getAttribute('data-index'));
      removeFromCart(index);
    });
  });
};

// Function to set up "Add to Cart" buttons on the menu page
const setupAddToCartButtons = () => {
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', () => {
      const foodItemId = parseInt(button.getAttribute('data-food-id'));
      const foodItemName = button.getAttribute('data-food-name');
      const foodItemPrice = parseFloat(button.getAttribute('data-food-price'));
      const foodItemTax = parseFloat(button.getAttribute('data-food-tax') || (foodItemPrice * 0.10).toString());

      // Get special requests if available
      const specialRequestInput = button.closest('.food-item')?.querySelector('.special-request-input');
      const specialRequest = specialRequestInput ? specialRequestInput.value : '';

      const item = {
        food_items_id: foodItemId,
        name: foodItemName,
        price: foodItemPrice,
        tax: foodItemTax,
        quantity: 1,
        special_request: specialRequest
      };

      addToCart(item);

      // Show confirmation message
      const confirmationMessage = document.createElement('div');
      confirmationMessage.className = 'add-to-cart-confirmation';
      confirmationMessage.textContent = `${foodItemName} added to cart`;
      document.body.appendChild(confirmationMessage);

      // Remove confirmation after 2 seconds
      setTimeout(() => {
        document.body.removeChild(confirmationMessage);
      }, 2000);
    });
  });
};

// Function to handle checkout process
const checkout = () => {
  const cart = getCart();
  if (cart.length === 0) {
    alert('Your cart is empty');
    return;
  }

  // Redirect to checkout page or show checkout modal
  window.location.href = '/checkout';
};

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
  setupAddToCartButtons();

  // Setup checkout button if it exists
  const checkoutButton = document.getElementById('checkout-button');
  if (checkoutButton) {
    checkoutButton.addEventListener('click', checkout);
  }
});

// Export the cart functions
window.FoodAppCart = {
  addToCart,
  removeFromCart,
  updateItemQuantity,
  getCart,
  clearCart,
  calculateCartTotals
};
