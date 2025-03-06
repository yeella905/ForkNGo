// Client facing scripts here

document.addEventListener("DOMContentLoaded", function() {
  // Get modal and food items
  const modal = document.getElementById('cartModal');
  const closeBtn = document.querySelector('.close-btn');
  const confirmBtn = document.getElementById('confirm-add-to-cart');
  const cancelBtn = document.getElementById('cancel-add-to-cart');
  const cartItemName = document.getElementById('cart-item-name');
  const cartItemPrice = document.getElementById('cart-item-price');

  let cart = [];

  // Open the modal and set the selected food item details
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', function (event) {
      // Get the food item's details from data attributes
      const foodItem = event.target.closest('.food-item');
      const foodName = foodItem.getAttribute('data-name');
      const foodPrice = foodItem.getAttribute('data-price');
      const foodId = foodItem.getAttribute('data-id');

      // Populate the modal with item details
      cartItemName.textContent = `Item: ${foodName}`;
      cartItemPrice.textContent = `Price: $${foodPrice}`;

      // Show the modal
      modal.style.display = "block";

      // Handle adding the item to the cart
      confirmBtn.onclick = () => {
        cart.push({ id: foodId, name: foodName, price: foodPrice });
        console.log('Current Cart:', cart);  // For debugging, you can log it to the console
        modal.style.display = "none";
      };

      // Handle canceling the action (close modal)
      cancelBtn.onclick = () => {
        modal.style.display = "none";
      };
    });
  });

  // Close the modal when the close button is clicked
  closeBtn.onclick = () => {
    modal.style.display = "none";
  };

  // Close the modal if the user clicks outside the modal
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
});

