let todosLosProductos = [];

document.addEventListener('DOMContentLoaded', async () => {
    await cargarProductos();
    configurarCheckboxes();
});

async function cargarProductos() {
    try {
        todosLosProductos = await ProductoService.obtenerTodos();
        filtrarYMostrar();
    } catch (error) {
        console.error("Fallo al cargar catálogo", error);
    }
}

function filtrarYMostrar() {
    const contenedor = document.getElementById('product-list');
    if (!contenedor) return;

    const urlActual = window.location.pathname.toLowerCase();
    let productosFiltrados = todosLosProductos;

    if (urlActual.includes('perros')) {
        productosFiltrados = productosFiltrados.filter(p => p.categoria && p.categoria.toLowerCase().includes('perro'));
    } else if (urlActual.includes('gatos')) {
        productosFiltrados = productosFiltrados.filter(p => p.categoria && p.categoria.toLowerCase().includes('gato'));
    } else if (urlActual.includes('ofertas')) {
        productosFiltrados = productosFiltrados.filter(p => p.oferta === true);
    }

    const chkOfertas = document.getElementById('ofertas-checkbox');
    const chkEnvios = document.getElementById('envios-checkbox');

    if (chkOfertas && chkOfertas.checked) {
        productosFiltrados = productosFiltrados.filter(p => p.oferta === true);
    }
    if (chkEnvios && chkEnvios.checked) {
        productosFiltrados = productosFiltrados.filter(p => p.envioGratis === true);
    }

    contenedor.innerHTML = '';

    if (productosFiltrados.length === 0) {
        contenedor.innerHTML = '<p class="sin-productos">No se encontraron productos en esta sección.</p>';
        return;
    }

    productosFiltrados.forEach(producto => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'product-card';
        tarjeta.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>$${producto.precio}</p>
            <p>Categoría: ${producto.categoria}</p>
            ${producto.oferta ? '<span class="badge oferta">¡En Oferta!</span>' : ''}
            ${producto.envioGratis ? '<span class="badge envio">Envío Gratis</span>' : ''}
            
            <img src="${producto.imagen}" alt="${producto.nombre}" style="cursor: pointer;" onclick="verDetallesProducto(${producto.id})">
            
            <button class="btn-detalles" onclick="verDetallesProducto(${producto.id})" style="margin-bottom: 5px; background-color: #6c757d; color: white;">👁️ Ver Detalles</button>
            
            <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id})">🛒 Agregar al carrito</button>
        `;
        contenedor.appendChild(tarjeta);
    });
}

function configurarCheckboxes() {
    const chkOfertas = document.getElementById('ofertas-checkbox');
    const chkEnvios = document.getElementById('envios-checkbox');

    if (chkOfertas) chkOfertas.addEventListener('change', filtrarYMostrar);
    if (chkEnvios) chkEnvios.addEventListener('change', filtrarYMostrar);
}

function agregarAlCarrito(idProducto) {
    const producto = todosLosProductos.find(p => p.id === idProducto);
    if (!producto) return;

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const index = carrito.findIndex(item => item.id === idProducto);

    if (index !== -1) {
        carrito[index].cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));

    Swal.fire({
        title: '¡Agregado!',
        text: `${producto.nombre} se sumó a tu carrito.`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
    });
}

async function verDetallesProducto(idProducto) {
    try {
        const producto = await ProductoService.obtenerPorId(idProducto);

        Swal.fire({
            title: `<strong>${producto.nombre}</strong>`,
            html: `
                <div style="text-align: left;">
                    <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 100%; max-height: 250px; object-fit: contain; margin-bottom: 15px; border-radius: 8px;">
                    <p><strong>Precio:</strong> $${producto.precio}</p>
                    <p><strong>Categoría:</strong> ${producto.categoria}</p>
                    <p><strong>Stock disponible:</strong> ${producto.stock || 0} unidades</p>
                    <p><em>Ideal para consentir a tu mascota con la mejor calidad del mercado.</em></p>
                </div>
            `,
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: '🛒 Agregar al carrito',
            cancelButtonText: 'Cerrar',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33'
        }).then((result) => {
            if (result.isConfirmed) {
                agregarAlCarrito(producto.id);
            }
        });
    } catch (error) {
        console.error("No se pudieron cargar los detalles del producto", error);
        Swal.fire('Error', 'No se pudo cargar la información del producto', 'error');
    }
}