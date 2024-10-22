// Fetch cart data from the JSON API
fetch('https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889')
    .then(response => response.json())
    .then(data => {
        const cartItemsContainer = document.getElementById('cart-items');
        let subtotal = 0;

        // Populate the cart with items
        data.items.forEach(item => {
            // Create a new row for each cart item
            const cartItem = document.createElement('tr');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <td class="product">
                    <img src="${item.image}" alt="${item.title}" style="width: 50px; height: auto;">
                    <span>${item.title}</span>
                </td>
                <td class="price">₹${(item.price / 100).toFixed(2)}</td>
                <td class="quantity">
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input">
                </td>
                <td class="subtotal">₹${(item.line_price / 100).toFixed(2)}</td>
                <td class="remove">
                    <button class="remove-item" aria-label="Remove item">🗑️</button>
                </td>
            `;

            // Append the item to the cart table
            cartItemsContainer.appendChild(cartItem);

            // Update subtotal
            subtotal += item.line_price / 100;

            // Handle quantity changes
            const quantityInput = cartItem.querySelector('.quantity-input');
            quantityInput.addEventListener('change', (e) => {
                const newQuantity = parseInt(e.target.value);
                if (newQuantity < 1) {
                    e.target.value = 1; // Prevent setting quantity below 1
                    return;
                }

                // Update the item's subtotal
                const updatedSubtotal = newQuantity * (item.price / 100);
                cartItem.querySelector('.subtotal').innerText = `₹${updatedSubtotal.toFixed(2)}`;

                // Update the total cart amount
                updateCartTotal();
            });

            // Handle item removal
            cartItem.querySelector('.remove-item').addEventListener('click', () => {
                cartItemsContainer.removeChild(cartItem); // Remove the item from the DOM
                updateCartTotal(); // Update the total after item removal
            });
        });

        // Set the initial totals
        document.getElementById('cartSubtotal').innerText = `Subtotal: ₹${subtotal.toFixed(2)}`;
        document.getElementById('cartTotal').innerText = `Total: ₹${subtotal.toFixed(2)}`;

        // Show message if cart is empty
        if (data.items.length === 0) {
            document.getElementById('cart-empty-message').style.display = 'block';
        }

    })
    .catch(err => console.error('Error fetching cart data:', err));

// Update the total price when quantities change or items are removed
function updateCartTotal() {
    const cartItems = document.querySelectorAll('.cart-item');
    let newTotal = 0;

    cartItems.forEach(item => {
        const itemSubtotal = parseFloat(item.querySelector('.subtotal').innerText.replace('₹', ''));
        newTotal += itemSubtotal;
    });

    // Update the subtotal and total elements
    document.getElementById('cartSubtotal').innerText = `Subtotal: ₹${newTotal.toFixed(2)}`;
    document.getElementById('cartTotal').innerText = `Total: ₹${newTotal.toFixed(2)}`;

    // Show message if cart is empty
    if (cartItems.length === 0) {
        document.getElementById('cart-empty-message').style.display = 'block';
    } else {
        document.getElementById('cart-empty-message').style.display = 'none';
    }
}

// Checkout button event
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (document.querySelectorAll('.cart-item').length === 0) {
        alert('Your cart is empty! Please add items before proceeding to checkout.');
    } else {
        alert('Proceeding to checkout...');
        // Redirect to the checkout page or execute checkout logic
        // window.location.href = 'checkout.html'; // Uncomment this line for redirection
    }
});
