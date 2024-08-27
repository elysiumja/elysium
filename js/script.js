const carousel = document.getElementById('carousel');
const next = document.getElementById('next');
const prev = document.getElementById('prev');
let currentIndex = 0;
let interval;
const imageCount = carousel.children.length;
const autoCarouselDelay = 3000; // Tiempo entre cambios automáticos
const manualOverrideDelay = 5000; // Tiempo antes de reiniciar el carrusel automático después de usar los botones

// Función para cambiar la imagen
function changeImage(index) {
    carousel.style.marginLeft = `-${index * 100}%`;
    currentIndex = index;
}

// Función para la siguiente imagen
function nextImage() {
    currentIndex = (currentIndex + 1) % imageCount;
    changeImage(currentIndex);
}

// Función para la imagen anterior
function prevImage() {
    currentIndex = (currentIndex - 1 + imageCount) % imageCount;
    changeImage(currentIndex);
}

// Iniciar el carrusel automático
function startAutoCarousel() {
    stopAutoCarousel(); // Asegúrate de detener cualquier intervalo anterior
    interval = setInterval(nextImage, autoCarouselDelay);
}

// Detener el carrusel automático
function stopAutoCarousel() {
    clearInterval(interval);
}

// Event listeners para los botones
next.addEventListener('click', () => {
    stopAutoCarousel();
    nextImage();
    setTimeout(startAutoCarousel, manualOverrideDelay); // Reiniciar el carrusel automático después de 5 segundos
});

prev.addEventListener('click', () => {
    stopAutoCarousel();
    prevImage();
    setTimeout(startAutoCarousel, manualOverrideDelay); // Reiniciar el carrusel automático después de 5 segundos
});

// Iniciar el carrusel automáticamente al cargar la página
startAutoCarousel();



// NUESTROS AROMAS

const colorAromas = document.querySelectorAll('.color-aroma');
const tarjetaAromas = document.getElementById('tarjeta_aromas');

// Variable para almacenar el aroma seleccionado
let selectedAroma = null;

colorAromas.forEach(element => {
    element.addEventListener('click', function() {
        const aroma = this.getAttribute('data-aroma');
        
        if (selectedAroma === aroma) {
            // Deselect if the same aroma is clicked again
            this.classList.remove('selected');
            tarjetaAromas.src = '/resources/tarjeta_aromas.png'; // Set to the default image
            selectedAroma = null;
        } else {
            // Remove 'selected' class from all elements
            colorAromas.forEach(el => el.classList.remove('selected'));
            
            // Add 'selected' class to the clicked element
            this.classList.add('selected');
            
            // Update the image source
            tarjetaAromas.src = `/resources/tarjeta_aromas_${aroma}.png`;
            selectedAroma = aroma;
        }
    });
});


// Obtén el botón de scroll-to-top
const backToTopButton = document.querySelector('.back-to-top');

// Función para mostrar o ocultar el botón
function toggleBackToTopButton() {
    if (window.scrollY > 300) { // Cambia 300 por el valor que desees
        backToTopButton.style.display = 'inline-flex';
    } else {
        backToTopButton.style.display = 'none';
    }
}

// Llama a la función cuando la página se desplaza
window.addEventListener('scroll', toggleBackToTopButton);

// Añade el evento de clic al botón para volver al inicio
backToTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
