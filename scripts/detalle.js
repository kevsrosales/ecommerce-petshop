const API_BASE_URL = 'http://localhost:8080/api';
const API_URL = `${API_BASE_URL}/productos`;

const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

if (!productId) {
    document.querySelector('.detalle-container').innerHTML = '<p>Producto no encontrado.</p>';
} else {
    fetch(`${API_URL}/${productId}`)
        .then(response => {
            if (!response.ok) throw new Error('No se pudo encontrar el producto en MySQL');
            return response.json();
        })
        .then(product => {
            product.offert = (product.offert == true || product.offert == 1);
            product.freeShipping = (product.freeShipping == true || product.freeShipping == 1);
            
            renderProductDetails(product, productId);
        })
        .catch(error => {
            console.error('Error al obtener los detalles:', error);
            document.querySelector('.detalle-container').innerHTML = '<p>Error al cargar el producto.</p>';
        });
}

function renderProductDetails(product, id) {
    const container = document.querySelector('.detalle-container');
    if (!container) return;
    container.innerHTML = '';

    const card = document.createElement('article');
    card.classList.add('detalle-producto');

    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.title;

    const title = document.createElement('h1');
    title.textContent = product.title;

    const price = document.createElement('p');
    price.textContent = `$${product.price}`;
    price.classList.add('price');

    const description = document.createElement('p');
    description.textContent = product.description;
    description.classList.add('descripcion');

    const offerTag = document.createElement('p');
    if (product.offert) {
        offerTag.textContent = '🔥 ¡Producto en oferta!';
        offerTag.classList.add('detalle-oferta');
    }

    const shippingTag = document.createElement('p');
    if (product.freeShipping) {
        shippingTag.textContent = '🚚 Envío gratis disponible';
        shippingTag.classList.add('detalle-envio');
    }

    const btn = document.createElement('button');
    btn.textContent = 'Agregar al carrito';
    btn.classList.add('detalle-btn');
    btn.addEventListener('click', () => {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const exist = carrito.find(p => p.id === id);
        if (!exist) {
            carrito.push({
                id: id,
                title: product.title,
                price: product.price,
                image: product.image
            });
            localStorage.setItem('carrito', JSON.stringify(carrito));
            Swal.fire({
                icon: 'success',
                title: '¡Listo!',
                text: 'Producto agregado al carrito con éxito',
                confirmButtonColor: '#3085d6'
            });
        }
    });

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(price);
    card.appendChild(description);
    if (product.offert) card.appendChild(offerTag);
    if (product.freeShipping) card.appendChild(shippingTag);
    card.appendChild(btn);

    container.appendChild(card);
}