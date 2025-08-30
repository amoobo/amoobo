document.addEventListener('DOMContentLoaded', () => {
    // Carousel Script
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    const productItems = document.querySelectorAll('.product-item');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let currentIndex = 0;
    const totalItems = productItems.length;

    // Clone first and last items for infinite loop effect
    const firstItemClone = productItems[0].cloneNode(true);
    const lastItemClone = productItems[totalItems - 1].cloneNode(true);

    carouselWrapper.appendChild(firstItemClone);
    carouselWrapper.insertBefore(lastItemClone, productItems[0]);

    // Set initial position to show the first original item
    carouselWrapper.style.transform = `translateX(-${100}%)`;

    let isTransitioning = false;

    function updateCarousel(direction) {
        if (isTransitioning) return;
        isTransitioning = true;

        if (direction === 'next') {
            currentIndex++;
        } else {
            currentIndex--;
        }

        carouselWrapper.style.transition = 'transform 0.5s ease-in-out';
        carouselWrapper.style.transform = `translateX(-${(currentIndex + 1) * 100}%)`;
    }

    nextBtn.addEventListener('click', () => {
        updateCarousel('next');
    });

    prevBtn.addEventListener('click', () => {
        updateCarousel('prev');
    });

    carouselWrapper.addEventListener('transitionend', () => {
        isTransitioning = false;

        // Handle the seamless loop
        if (currentIndex === totalItems) {
            carouselWrapper.style.transition = 'none';
            currentIndex = 0;
            carouselWrapper.style.transform = `translateX(-${(currentIndex + 1) * 100}%)`;
        }
        if (currentIndex === -1) {
            carouselWrapper.style.transition = 'none';
            currentIndex = totalItems - 1;
            carouselWrapper.style.transform = `translateX(-${(currentIndex + 1) * 100}%)`;
        }
    });

    // Cart Script
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountEl = document.querySelector('.cart-count');
    const cartTotalEl = document.getElementById('cart-total-price');

    let cart = [];

    // Open/Close Cart Modal
    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'block';
    });

    closeModalBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Add to Cart Logic
    addToCartBtns.forEach(button => {
        button.addEventListener('click', (event) => {
            const productItem = event.target.closest('.product-item');
            const productName = productItem.dataset.name;
            const productPrice = parseFloat(productItem.dataset.price);
            const productImageSrc = productItem.querySelector('.product-image-side img').src;

            const existingItem = cart.find(item => item.name === productName);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    name: productName,
                    price: productPrice,
                    quantity: 1,
                    image: productImageSrc
                });
            }

            updateCartUI();
        });
    });

    // Update Cart UI
    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            cart.forEach((item, index) => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="item-info">
                        <span>${item.name}</span>
                        <span>$${item.price.toFixed(2)} CAD</span>
                    </div>
                    <div class="item-quantity">
                        <button data-index="${index}" class="quantity-btn minus">-</button>
                        <span>${item.quantity}</span>
                        <button data-index="${index}" class="quantity-btn plus">+</button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
                total += item.price * item.quantity;
            });
        }
        
        cartTotalEl.textContent = total.toFixed(2);
        cartCountEl.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

        // Add event listeners for quantity buttons
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.dataset.index;
                if (event.target.classList.contains('plus')) {
                    cart[index].quantity++;
                } else if (event.target.classList.contains('minus')) {
                    cart[index].quantity--;
                    if (cart[index].quantity <= 0) {
                        cart.splice(index, 1);
                    }
                }
                updateCartUI();
            });
        });
    }

    updateCartUI();
});
