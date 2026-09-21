let products = [];
let orders = [
  { id: '#1024', item: 'Luna Accent Chair', status: 'Delivered', details: '2 days ago • Express shipping' },
  { id: '#1028', item: 'Echo Wireless Earbuds', status: 'Shipped', details: '5 days ago • In transit' },
  { id: '#1031', item: 'Nova Ceramic Set', status: 'Processing', details: 'Today • Packaged soon' }
];

const productGrid = document.getElementById('productGrid');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');
const cartPanel = document.querySelector('.cart-panel');
const cartButton = document.querySelector('.cart-button');
const closeCart = document.querySelector('.close-cart');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckout = document.getElementById('closeCheckout');
const checkoutForm = document.getElementById('checkoutForm');
const toast = document.getElementById('toast');
const orderList = document.getElementById('orderList');
const filterButtons = document.querySelectorAll('.filter');
const paymentOptions = document.querySelectorAll('.payment-option');
const paymentFields = document.getElementById('paymentFields');
const videoModal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const openVideoButton = document.querySelector('.video-open-button');
const closeVideo = document.getElementById('closeVideo');

let currentFilter = 'all';
let cart = [];
let visibleCount = 10;

function formatPrice(value) {
  return `$${Number(value).toFixed(2)}`;
}

function getFilteredProducts() {
  return currentFilter === 'all'
    ? products
    : products.filter((product) => product.category === currentFilter);
}

function getCartSubtotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderOrders() {
  orderList.innerHTML = orders
    .map(
      (order) => `
        <article class="order-item">
          <div class="order-top">
            <span class="order-id">${order.id}</span>
            <span class="order-status">${order.status}</span>
          </div>
          <h4>${order.item}</h4>
          <p>${order.details}</p>
        </article>
      `
    )
    .join('');
}

function updateCheckoutSummary() {
  const subtotal = getCartSubtotal();
  const shipping = subtotal > 0 ? 12 : 0;
  const total = subtotal + shipping;

  const checkoutSubtotal = document.getElementById('checkoutSubtotal');
  const checkoutShipping = document.getElementById('checkoutShipping');
  const checkoutTotal = document.getElementById('checkoutTotal');

  checkoutSubtotal.textContent = formatPrice(subtotal);
  checkoutShipping.textContent = formatPrice(shipping);
  checkoutTotal.textContent = formatPrice(total);
}

async function loadProducts() {
  try {
    const timestamp = Date.now();
    let response = await fetch(`api/products.json?t=${timestamp}`);

    if (!response.ok) {
      response = await fetch(`products.json?t=${timestamp}`);
    }

    if (!response.ok) {
      throw new Error('Failed to load products');
    }

    products = await response.json();
    renderProducts();
  } catch (error) {
    productGrid.innerHTML = '<p class="empty-cart">Unable to load products right now.</p>';
    console.error(error);
  }
}

function renderProducts() {
  const filteredProducts = getFilteredProducts();
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  productGrid.innerHTML = visibleProducts
    .map(
      (product) => `
        <article class="product-card" data-category="${product.category}">
          <div class="product-media" style="background: linear-gradient(135deg, rgba(255,255,255,.7), ${product.color});">
            <img src="${product.image}" alt="${product.name}" />
            <span class="product-tag">${product.tag}</span>
          </div>
          <div class="product-info">
            <div class="product-meta">
              <span>${Number(product.rating).toFixed(1)} ★</span>
              <span>${product.category}</span>
            </div>
            <h3>${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-row">
              <div>
                <span class="price">${formatPrice(product.price)}</span>
                <span class="old-price">${formatPrice(product.oldPrice)}</span>
              </div>
              <button class="add-btn" data-id="${product.id}">Add to cart</button>
            </div>
          </div>
        </article>
      `
    )
    .join('');

  if (filteredProducts.length > visibleProducts.length) {
    const moreWrap = document.createElement('div');
    moreWrap.className = 'load-more-wrap';
    moreWrap.innerHTML = `
      <button class="see-more-btn" type="button">
        See more (${filteredProducts.length - visibleProducts.length} more)
      </button>
    `;

    moreWrap.querySelector('.see-more-btn').addEventListener('click', () => {
      visibleCount = Math.min(visibleCount + 10, filteredProducts.length);
      renderProducts();
    });

    productGrid.appendChild(moreWrap);
  }

  const status = document.createElement('p');
  status.className = 'product-status';
  status.textContent = `Showing ${visibleProducts.length} of ${filteredProducts.length} products`;
  productGrid.appendChild(status);

  attachAddButtons();
}

function attachAddButtons() {
  document.querySelectorAll('.add-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = Number(button.dataset.id);
      const selectedProduct = products.find((product) => product.id === productId);

      if (!selectedProduct) return;

      const itemInCart = cart.find((item) => item.id === productId);

      if (itemInCart) {
        itemInCart.quantity += 1;
      } else {
        cart.push({ ...selectedProduct, quantity: 1 });
      }

      updateCart();
      cartPanel.classList.add('open');
    });
  });
}

function updateCart() {
  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    cartTotal.textContent = '$0.00';
    cartCount.textContent = '0';
    updateCheckoutSummary();
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <div class="cart-item-info">
            <div class="cart-thumb" style="background: linear-gradient(135deg, rgba(255,255,255,.7), ${item.color});"></div>
            <div>
              <strong>${item.name}</strong>
              <small>${item.quantity} x ${formatPrice(item.price)}</small>
            </div>
          </div>
          <button class="remove-item" data-id="${item.id}" aria-label="Remove ${item.name}">×</button>
        </div>
      `
    )
    .join('');

  const total = getCartSubtotal();
  cartTotal.textContent = formatPrice(total);
  cartCount.textContent = String(cart.reduce((sum, item) => sum + item.quantity, 0));
  updateCheckoutSummary();

  document.querySelectorAll('.remove-item').forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = Number(button.dataset.id);
      cart = cart.filter((item) => item.id !== targetId);
      updateCart();
    });
  });
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    currentFilter = button.dataset.filter;
    visibleCount = 10;
    renderProducts();
  });
});

cartButton.addEventListener('click', () => {
  cartPanel.classList.add('open');
});

closeCart.addEventListener('click', () => {
  cartPanel.classList.remove('open');
});

checkoutBtn.addEventListener('click', () => {
  if (!cart.length) {
    showToast('Your cart is empty. Add products first.');
    return;
  }

  cartPanel.classList.remove('open');
  checkoutModal.classList.remove('hidden');
  updateCheckoutSummary();
});

closeCheckout.addEventListener('click', () => {
  checkoutModal.classList.add('hidden');
});

function closeVideoModal() {
  modalVideo.pause();
  modalVideo.currentTime = 0;
  videoModal.classList.add('hidden');
}

openVideoButton.addEventListener('click', () => {
  videoModal.classList.remove('hidden');
  modalVideo.currentTime = 0;
  modalVideo.play().catch(() => {});
});

closeVideo.addEventListener('click', closeVideoModal);

videoModal.addEventListener('click', (event) => {
  if (event.target === videoModal) closeVideoModal();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !videoModal.classList.contains('hidden')) {
    closeVideoModal();
  }
});

paymentOptions.forEach((option) => {
  option.addEventListener('click', () => {
    paymentOptions.forEach((item) => item.classList.toggle('active', item === option));
    const selected = option.querySelector('input').value;
    const hasCardFields = selected === 'card';
    paymentFields.classList.toggle('hidden', !hasCardFields);
  });
});

checkoutForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(checkoutForm);
  const name = formData.get('name');
  const paymentMethod = formData.get('paymentMethod');

  const nextOrderId = `#${1000 + orders.length + 1}`;
  const firstItemName = cart[0]?.name || 'Product';

  orders.unshift({
    id: nextOrderId,
    item: firstItemName,
    status: 'Processing',
    details: `${paymentMethod.toUpperCase()} • ${cart.length} item(s) • Confirmed today`
  });

  renderOrders();
  cart = [];
  updateCart();
  checkoutForm.reset();
  checkoutModal.classList.add('hidden');
  showToast(`Order ${nextOrderId} placed successfully!`);
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.add('hidden');
  }, 2600);
}

loadProducts();
renderOrders();
updateCart();
