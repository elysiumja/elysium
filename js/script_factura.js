document.addEventListener('DOMContentLoaded', () => {
    const invoiceContainer = document.getElementById('invoice');
    const subtotalElement = document.getElementById('invoice-subtotal');
    const discountElement = document.getElementById('invoice-discount');
    const totalElement = document.getElementById('invoice-total');

    // Recuperar el carrito del localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal = 0;
    let discountApplied = 0;

    // Mostrar los productos en la factura
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        // Crear elementos para cada producto
        const invoiceItem = document.createElement('div');
        invoiceItem.classList.add('invoice-item');
        invoiceItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="product-info">
                <p><strong>${item.name}</strong></p>
                <p>Cantidad: ${item.quantity}</p>
                <p>Precio: $${item.price.toFixed(2)}</p>
            </div>
        `;
        invoiceContainer.appendChild(invoiceItem);
    });

    // Aplicar descuentos y mostrar resumen
    discountApplied = calculateDiscount(subtotal); // Implementa tu función de descuento
    const total = subtotal - discountApplied;

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    discountElement.textContent = discountApplied > 0 ? `-$${discountApplied.toFixed(2)}` : '-$0';
    totalElement.textContent = `$${total.toFixed(2)}`;
});

function calculateDiscount(subtotal) {
    let discount = 0;

    // Contar sahumerios y portasahumerios en el carrito
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const sahumeriosCount = cart.filter(item => item.category === 'sahumerios').reduce((acc, item) => acc + item.quantity, 0);
    const portasahumeriosCount = cart.filter(item => item.category === 'portasahumerios').reduce((acc, item) => acc + item.quantity, 0);

    // Verificar promociones
    if (sahumeriosCount >= 3 && portasahumeriosCount >= 1) {
        discount = 0.20; // 20% de descuento
    }

    if (sahumeriosCount >= 6) {
        discount = 0.30; // 30% de descuento
    }

    return subtotal * discount;
}

// GENERAR FACTURA

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('customer-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Evita el envío del formulario por defecto

        // Obtener valores del formulario
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;

        // Actualizar los campos de la factura con los datos del formulario
        document.getElementById('invoice-first-name').textContent = firstName;
        document.getElementById('invoice-last-name').textContent = lastName;
        document.getElementById('invoice-phone').textContent = phone;
        document.getElementById('invoice-email').textContent = email;
    });
});


// SELECCIÓN FECHA Y HORA

document.addEventListener('DOMContentLoaded', function () {
    const dateInput = document.getElementById('appointment-date');
    const timeInput = document.getElementById('appointment-time');

    // Configurar las opciones de hora según el día seleccionado
    function configureTimeOptions(dayOfWeek) {
        const allOptions = Array.from(timeInput.options);

        // Mostrar solo las opciones válidas
        allOptions.forEach(option => {
        option.style.display = (option.value <= maxTime) ? 'block' : 'none';
        });
    }

    // Controlar el cambio en la fecha
    dateInput.addEventListener('change', function () {
        const selectedDate = new Date(this.value);
        const dayOfWeek = selectedDate.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado

        if (dayOfWeek === 5 || dayOfWeek === 6) {
            // Si es sábado o domingo, mostrar un mensaje y limpiar el campo
            alert('Selecciona un día de Lunes a Viernes');
            this.value = ''; // Limpiar el campo de fecha
            configureTimeOptions(dayOfWeek); // Configurar opciones de hora
        } else {
            // Configurar las opciones de hora según el día de la semana
            configureTimeOptions(dayOfWeek);
        }
    });
});


// MOSTRAR EN FACTURA LOS DATOS

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('customer-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Evita el envío del formulario por defecto

        // Obtener valores del formulario
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const phone = document.getElementById('document-number').value;
        const email = document.getElementById('email').value;
        const appointmentDate = document.getElementById('appointment-date').value;
        const appointmentTime = document.getElementById('appointment-time').value;

        // Formatear la fecha a dd-mm-yyyy
        const formattedDate = appointmentDate.split('-').reverse().join('-');

        // Actualizar los campos de la factura con los datos del formulario
        document.getElementById('invoice-first-name').textContent = firstName;
        document.getElementById('invoice-last-name').textContent = lastName;
        document.getElementById('invoice-document').textContent = phone;
        document.getElementById('invoice-email').textContent = email;
        document.getElementById('invoice-retirar').textContent = appointmentDate ? formattedDate : 'No disponible';
        document.getElementById('invoice-horario').textContent = appointmentTime ? appointmentTime : 'No disponible';

        // Opcional: limpiar el formulario después de enviar
        form.reset();

    });
});


// FECHA Y NRO DE PEDIDO

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('customer-form');
    const invoiceDateElement = document.getElementById('invoice-date');
    const invoiceOrderNumberElement = document.getElementById('invoice-order-number');

    // Generar número de pedido aleatorio
    function generateOrderNumber() {
        return Math.floor(Math.random() * 1000000); // Número aleatorio entre 0 y 999999
    }

    // Mostrar la fecha actual
    function setCurrentDate() {
        const today = new Date();
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        invoiceDateElement.textContent = today.toLocaleDateString('es-ES', options);
    }

    // Configurar el número de pedido y la fecha al cargar la página
    function initializeInvoice() {
        setCurrentDate();
        invoiceOrderNumberElement.textContent = generateOrderNumber();
    }

    initializeInvoice();
});


// SOLO NUMEROS DNI

document.getElementById('document-number').addEventListener('input', function (e) {
    // Eliminar cualquier carácter que no sea número
    let value = e.target.value.replace(/\D/g, '');
    
    // Asignar el valor formateado de nuevo al campo
    e.target.value = value;
});


// PDF

document.getElementById('customer-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional
    
    // Muestra el contenedor de la factura y el botón de descarga
    document.querySelector('.invoice-container').classList.remove('hidden');
    document.getElementById('download-pdf').classList.remove('hidden');
});

document.getElementById('download-pdf').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const invoiceElement = document.querySelector('.invoice-container');
    const invoiceClone = document.getElementById('invoice-clone');

    // Clona el contenido de la factura
    invoiceClone.innerHTML = invoiceElement.innerHTML;

    // Aplica un tamaño fijo al clon de la factura
    invoiceClone.style.width = '800px';  // Ancho fijo en píxeles
    invoiceClone.style.height = 'auto';  // Altura automática según el contenido
    invoiceClone.style.display = 'block';  // Asegúrate de que esté visible durante la captura

    html2canvas(invoiceClone, {
        scale: 2  // Aumenta la escala para mejor calidad
    }).then(function(canvas) {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 190; // Ancho de la imagen en el PDF
        const pageHeight = 290; // Altura de la página en el PDF
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 10;

        doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        // Descarga el PDF con un nombre único
        doc.save('factura_elysium_' + Math.floor(Math.random() * 1000000) + '.pdf');

        // Vuelve a ocultar el clon después de la generación
        invoiceClone.style.display = 'none';
    });
});


// INDICADOR DE CARGA

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('customer-form');
    const loadingOverlay = document.getElementById('loading-overlay');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional

        // Muestra el indicador de carga
        loadingOverlay.style.display = 'flex'; // Usa 'flex' o 'block', dependiendo de cómo lo hayas configurado en CSS

        // Simula un retraso para mostrar el indicador de carga (puedes eliminar esto si tu proceso es rápido)
        setTimeout(() => {
            
            // Oculta el indicador de carga
            loadingOverlay.style.display = 'none';
        }, 2000); // Ajusta el tiempo si es necesario
    });
});

