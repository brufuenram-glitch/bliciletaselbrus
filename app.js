/**
 * Motos y Bicis El Brus - E-commerce Landing Page Logic
 * Contains: Sticky Header, Mobile Menu, Cart State & Drawer, Smooth Scroll, and Contact Form
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // STICKY HEADER
  // ==========================================
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ==========================================
  // MOBILE MENU TOGGLE
  // ==========================================
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu when clicking navigation links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // ==========================================
  // SHOPPING CART STATE & BEHAVIOR
  // ==========================================
  let cart = [];

  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartCounter = document.getElementById('cart-counter');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartTotalPrice = document.getElementById('cart-total-price');
  const cartEmptyMsg = document.getElementById('cart-empty-msg');
  const cartCheckoutBtn = document.getElementById('cart-checkout-btn');

  // Toggle Cart Drawer
  function toggleCart() {
    cartDrawer.classList.toggle('active');
    cartOverlay.classList.toggle('active');
  }

  cartToggleBtn.addEventListener('click', toggleCart);
  cartCloseBtn.addEventListener('click', toggleCart);
  cartOverlay.addEventListener('click', toggleCart);

  // Add Item to Cart
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  addToCartButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Find closest button even if clicking svg child
      const targetBtn = e.target.closest('.add-to-cart-btn');
      const id = targetBtn.getAttribute('data-id');
      const name = targetBtn.getAttribute('data-name');
      const price = parseFloat(targetBtn.getAttribute('data-price'));
      const img = targetBtn.getAttribute('data-img');

      addItemToCart(id, name, price, img);
      
      // Open cart drawer so customer sees their selection
      if (!cartDrawer.classList.contains('active')) {
        toggleCart();
      }
    });
  });

  function addItemToCart(id, name, price, img) {
    // Check if item already exists
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ id, name, price, img, quantity: 1 });
    }

    updateCartUI();
  }

  // Remove Item from Cart
  function removeItemFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
  }

  // Update Cart interface
  function updateCartUI() {
    // 1. Update Counter
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCounter.textContent = totalItems;

    // 2. Clear except empty message
    const items = cartItemsContainer.querySelectorAll('.cart-item');
    items.forEach(el => el.remove());

    if (cart.length === 0) {
      cartEmptyMsg.style.display = 'block';
      cartTotalPrice.textContent = '$0.00 MXN';
    } else {
      cartEmptyMsg.style.display = 'none';

      let total = 0;

      // 3. Populate Cart Items
      cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItemHTML = `
          <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-img-container">
              <img src="${item.img}" alt="${item.name}" class="cart-item-img">
            </div>
            <div class="cart-item-info">
              <h4 class="cart-item-name">${item.name}</h4>
              <p class="cart-item-price">${item.quantity}x - $${item.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</p>
            </div>
            <button class="cart-item-remove" aria-label="Eliminar ${item.name} del carrito">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </button>
          </div>
        `;
        cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
      });

      // Bind remove buttons
      const removeButtons = cartItemsContainer.querySelectorAll('.cart-item-remove');
      removeButtons.forEach(removeBtn => {
        removeBtn.addEventListener('click', (e) => {
          const cartItem = e.target.closest('.cart-item');
          const id = cartItem.getAttribute('data-id');
          removeItemFromCart(id);
        });
      });

      // 4. Update Total Price
      cartTotalPrice.textContent = `$${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`;
    }
  }

  // Checkout redirect via WhatsApp
  cartCheckoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Tu carrito está vacío. Agrega un producto para iniciar tu compra.');
      return;
    }

    let message = '¡Hola! Me gustaría iniciar una compra en Motos y Bicis El Brus de los siguientes productos:\n\n';
    let total = 0;
    
    cart.forEach(item => {
      const itemSubtotal = item.price * item.quantity;
      total += itemSubtotal;
      message += `• ${item.name} (Cant: ${item.quantity}) - $${itemSubtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN\n`;
    });

    message += `\n*Total a pagar: $${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN*\n\n`;
    message += '¿Cuáles son los pasos para concretar la compra y coordinar la entrega?';

    // Encode URL text
    const waUrl = `https://wa.me/525512345678?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  });

  // ==========================================
  // CONTACT FORM SIMULATION & FEEDBACK
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback-message');
  const submitBtn = contactForm.querySelector('.form-submit-btn');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !message) {
      formFeedback.textContent = 'Por favor, llena todos los campos obligatorios.';
      formFeedback.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
      formFeedback.style.color = '#EF4444';
      formFeedback.style.display = 'block';
      return;
    }

    // Change button state
    submitBtn.textContent = 'ENVIANDO...';
    submitBtn.disabled = true;

    // Simulate sending (1.2 seconds delay)
    setTimeout(() => {
      // Success feedback
      formFeedback.textContent = '¡Gracias por escribirnos! Tu mensaje ha sido enviado con éxito. Nos pondremos en contacto contigo pronto.';
      formFeedback.className = 'form-message success';
      
      // Reset Form fields
      contactForm.reset();
      
      // Reset button
      submitBtn.textContent = 'ENVIAR';
      submitBtn.disabled = false;

      // Hide message after 5 seconds
      setTimeout(() => {
        formFeedback.style.display = 'none';
        formFeedback.className = 'form-message';
      }, 5000);

    }, 1200);
  });

  // ==========================================
  // SMOOTH SCROLL FOR NAVEGACIÓN
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      
      // Verify it's a internal target
      if (targetId.startsWith('#') && targetId.length > 1) {
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          e.preventDefault();
          
          // Smooth scroll to the target
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  });

});
