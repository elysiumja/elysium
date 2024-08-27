/* AÑADIR AL CARRITO */
document.addEventListener('DOMContentLoaded', () => {
    const cartButton = document.getElementById('cartButton');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeBtn = document.querySelector('.close');
    const addToCartButtons = document.querySelectorAll('.add-cart-button');
    const cartItemsContainer = document.getElementById('cartItems');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const cartCount = document.getElementById('cartCount');
    const cartItemCount = document.getElementById('cartItemCount');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Delegación de eventos para añadir al carrito
    document.querySelector('.product-grid').addEventListener('click', (event) => {
        if (event.target.classList.contains('add-cart-button')) {
            const productCard = event.target.closest('.product-card');
            const productId = productCard.getAttribute('data-id');
            const productName = productCard.getAttribute('data-name');
            const productPrice = parseFloat(productCard.getAttribute('data-price'));
            const productImage = productCard.getAttribute('data-image');
            const quantityInput = productCard.querySelector('.quantity');
            const quantity = parseInt(quantityInput.value, 10);
            const discountPercent = parseFloat(productCard.getAttribute('data-discount')) || 0;
            const discount = discountPercent / 100;
            const discountedPrice = productPrice - (productPrice * discount);

            addProductToCart(productId, productName, discountedPrice, productImage, quantity, productCard.getAttribute('data-category'));
            updateCart();
            saveCart();
        }
    });

    function addProductToCart(id, name, price, image, quantity, category) {
        const existingProduct = cart.find(item => item.id === id);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.push({ id, name, image, quantity, price, category });
        }
    }

    function updateCart() {
        cartItemsContainer.innerHTML = '';

        let subtotal = 0;
        let itemCount = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            itemCount += item.quantity;

            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <span class="nameq">${item.name}</span>
                <div class="quantity-controls">
                    <button class="decrease" data-id="${item.id}">-</button>
                    <input type="text" value="${item.quantity}" readonly>
                    <button class="increase" data-id="${item.id}">+</button>
                </div>
                <span class="precioq">$${itemTotal.toFixed(2)}</span>
                <button class="fa-solid fa-trash" id="remove" data-id="${item.id}"></button>

                <style>
                    .cart-item {
                        display: flex;
                        align-items: center;
                        gap: 3px;
                        font-size: 12px; 
                    }

                    .cart-item img {
                        width: 30px;
                        height: auto;
                    }

                    .nameq {
                        flex: 1;
                        font-size: 12px;
                    }

                    .quantity-controls {
                        display: flex;
                        align-items: center;
                    }

                    .quantity-controls input {
                        width: 30px;
                        text-align: center;
                        margin: 0 3px;
                        font-size: 12px;
                        min-width: 45px;
                        width: auto;
                    }

                    .increase,
                    .decrease {
                        border-radius: 50%;
                        width: 20px;
                        height: 20px;
                        font-size: 12px;
                    }

                    .increase {
                        margin-right: 10px;
                    }

                    .precioq {
                        font-size: 12px;
                        margin-left: auto;
                    }

                    #remove {
                        color: black;
                        background: none;
                        border: none;
                        padding: 3px 5px;
                        cursor: pointer;
                        font-size: 12px;
                        margin-left: 3px;
                    }
                </style>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        // Aplicar promociones y actualizar el subtotal
        applyPromotions(subtotal);

        cartCount.textContent = itemCount;
        cartItemCount.textContent = itemCount;


        const increaseButtons = document.querySelectorAll('.increase');
        const decreaseButtons = document.querySelectorAll('.decrease');
        const removeButtons = document.querySelectorAll('#remove');

        // Activar/desactivar el botón de "Iniciar compra"
        proceedButton.disabled = cart.length === 0;

        increaseButtons.forEach(button => {
        button.addEventListener('click', (event) => {
        const productId = event.target.getAttribute('data-id');
        const product = cart.find(item => item.id === productId);
        product.quantity += 1;
        updateCart();
        saveCart();
            });
        });

        increaseButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.getAttribute('data-id');
                const product = cart.find(item => item.id === productId);
                product.quantity += 1;
                updateCart();
                saveCart();
            });
        });

        decreaseButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.getAttribute('data-id');
                const product = cart.find(item => item.id === productId);
                if (product.quantity > 1) {
                    product.quantity -= 1;
                } else {
                    cart = cart.filter(item => item.id !== productId);
                }
                updateCart();
                saveCart();
            });
        });

        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.getAttribute('data-id');
                cart = cart.filter(item => item.id !== productId);
                updateCart();
                saveCart();
            });
        });
    }

    function applyPromotions(subtotal) {
        let discount = 0;
    
        // Contar sahumerios y portasahumerios en el carrito
        const sahumeriosCount = cart.filter(item => item.category === 'sahumerios').reduce((acc, item) => acc + item.quantity, 0);
        const portasahumeriosCount = cart.filter(item => item.category === 'portasahumerios').reduce((acc, item) => acc + item.quantity, 0);
    
        // Verificar promociones
        if (sahumeriosCount >= 3 && portasahumeriosCount >= 1) {
            discount = 0.20; // 20% de descuento
        }

        if (sahumeriosCount >= 6) {
            discount = 0.30; // 30% de descuento
        }
    
        const total = subtotal * (1 - discount);
    
        // Mostrar subtotal, descuento y total
        subtotalElement.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
        totalElement.textContent = `Total: $${total.toFixed(2)}`;
    
        const discountElement = document.getElementById('discount-applied');
        if (discount > 0) {
            discountElement.innerHTML = `Descuento aplicado: <span id="discount">-${(discount * 100).toFixed(0)}%</span>`;
        } else {
            discountElement.innerHTML = '';
        }
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    cartButton.addEventListener('click', () => {
        cartSidebar.classList.toggle('open');
        updateCart();
    });

    closeBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });

    // Cargar el carrito al inicio
    updateCart();
});



// FILTROS

// Variable para rastrear los filtros activos
let activeFilters = {
    discount: false,
    intensity: [],
    sort: null,
    category: null // Añadir filtro de categoría
};

// Almacenar el orden original de los productos
let originalOrder = [];

// Función para inicializar el orden original de los productos
function storeOriginalOrder() {
    const productCards = Array.from(document.querySelectorAll('.product-card'));
    originalOrder = productCards.map(card => card.outerHTML);
}

// Función para restaurar el orden original de los productos
function restoreOriginalOrder() {
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = originalOrder.join('');
}

// Función para alternar la visibilidad de los filtros
function toggleFilters() {
    const filters = document.getElementById('filters');
    filters.style.display = filters.style.display === 'none' ? 'flex' : 'none';
}

// Función para ordenar los productos
function sortProducts(order) {
    if (order === activeFilters.sort) {
        // Si el mismo orden se selecciona de nuevo, se desactiva el orden
        activeFilters.sort = null;
    } else {
        activeFilters.sort = order;
    }
    applyFilters();
}

// Función para aplicar el orden de productos
function applySort(productCards) {
    if (!activeFilters.sort) return productCards; // No ordenar si no hay orden activo

    return productCards.sort(function(a, b) {
        const priceA = parseFloat(a.dataset.price);
        const priceB = parseFloat(b.dataset.price);

        if (activeFilters.sort === 'priceAsc') {
            return priceA - priceB;
        } else if (activeFilters.sort === 'priceDesc') {
            return priceB - priceA;
        }
    });
}

// Función para filtrar productos con descuento
function filterDiscount() {
    activeFilters.discount = !activeFilters.discount;
    applyFilters();
}

// Función para filtrar productos por intensidad
function toggleFilterByIntensity(intensity) {
    const index = activeFilters.intensity.indexOf(intensity);
    if (index > -1) {
        // Intensidad ya está en los filtros, se elimina
        activeFilters.intensity.splice(index, 1);
    } else {
        // Intensidad no está en los filtros, se agrega
        activeFilters.intensity.push(intensity);
    }
    applyFilters();
}

// Función para filtrar por categoría de productos
function filterPortasahumerios(category) {
    if (category === activeFilters.category) {
        // Si el mismo filtro de categoría se selecciona de nuevo, se desactiva el filtro
        activeFilters.category = null;
    } else {
        activeFilters.category = category;
    }
    applyFilters();
}

// Función para aplicar filtros a los productos
function applyFilters() {
    // Restaurar el orden original para aplicar filtros y orden
    restoreOriginalOrder();

    let productCards = Array.from(document.querySelectorAll('.product-card'));

    // Filtrar por categoría
    if (activeFilters.category) {
        productCards = productCards.filter(card => card.dataset.category === activeFilters.category);
    } else {
        // Si no hay filtro de categoría aplicado, oculta los productos de "Portasahumerios"
        productCards = productCards.filter(card => card.dataset.category !== 'portasahumerios');
    }

    // Filtrar por descuento
    if (activeFilters.discount) {
        productCards = productCards.filter(card => card.dataset.discount === 'true');
    }

    // Filtrar por intensidad
    if (activeFilters.intensity.length > 0) {
        productCards = productCards.filter(card => {
            const intensity = parseInt(card.dataset.intensity, 10);
            return activeFilters.intensity.includes(intensity);
        });
    }

    // Aplicar el orden
    productCards = applySort(productCards);

    // Actualizar la grilla de productos
    updateProductGrid(productCards);
}

// Función para actualizar la grilla de productos
function updateProductGrid(productCards) {
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = ''; // Limpiar la grilla

    productCards.forEach(card => {
        productGrid.appendChild(card);
    });
}

// Función para aplicar filtros al cargar la página
function applyInitialFilters() {
    // Establecer el estado inicial del filtro de categoría (puede ser null o el valor por defecto)
    activeFilters.category = null; // O puedes establecerlo en un valor específico si deseas filtrar por defecto

    // Aplicar filtros iniciales
    applyFilters();
}

// Al cargar la página, almacenar el orden original de los productos y aplicar filtros iniciales
document.addEventListener('DOMContentLoaded', () => {
    storeOriginalOrder();
    applyInitialFilters();
});