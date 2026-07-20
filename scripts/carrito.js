// Leemos el carrito de la memoria
const carritoProducts = JSON.parse(localStorage.getItem('carrito')) || [];

function createProductCarritoCard(product, index) {
    const card = document.createElement('article');
    card.classList.add('product-card');
    card.style.cursor = 'pointer';

    card.addEventListener('click', async (e) => {
        if (e.target.tagName.toLowerCase() === 'button') return; 
        
        try {
            
            const prodReal = await ProductoService.obtenerPorId(product.id);
            
            Swal.fire({
                title: `<strong>${prodReal.nombre}</strong>`,
                html: `
                    <div style="text-align: left;">
                        <img src="${prodReal.imagen}" style="width: 100%; max-height: 250px; object-fit: contain; margin-bottom: 15px; border-radius: 8px;">
                        <p><strong>Precio:</strong> $${prodReal.precio}</p>
                        <p><strong>Categoría:</strong> ${prodReal.categoria}</p>
                        <p><strong>Stock disponible:</strong> ${prodReal.stock || 0} unidades</p>
                    </div>
                `,
                showCloseButton: true,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar los detalles', 'error');
        }
    });

    const title = document.createElement('h3');
    title.textContent = product.nombre;

    const price = document.createElement('p');
    price.textContent = `$${product.precio}`;

    const quantity = document.createElement('p');
    quantity.textContent = `Cantidad: ${product.cantidad || 1}`;
    quantity.style.fontWeight = 'bold';

    const img = document.createElement('img');
    img.src = product.imagen;
    img.alt = product.nombre;

    const button = document.createElement('button');
    button.textContent = '❌ Eliminar';
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        carritoProducts.splice(index, 1);
        localStorage.setItem('carrito', JSON.stringify(carritoProducts));
        renderCarritoProducts(carritoProducts);
        
        Swal.fire({
            icon: 'warning',
            title: '¡Eliminado!',
            text: 'Quitaste el producto del carrito',
            timer: 1500,
            showConfirmButton: false
        });
    });

    card.appendChild(title);
    card.appendChild(price);
    card.appendChild(quantity);
    card.appendChild(img);
    card.appendChild(button);

    return card;
}

function renderCarritoProducts(list) {
    const carritoGrid = document.querySelector('.carrito-grid');
    if (!carritoGrid) return;
    carritoGrid.innerHTML = '';

    if (list.length === 0) {
        carritoGrid.innerHTML = '<h3 style="grid-column: 1/-1; text-align:center;">No hay productos en el carrito.</h3>';
        return;
    }

    list.forEach((product, index) => {
        const card = createProductCarritoCard(product, index);
        carritoGrid.appendChild(card);
    });

    const totalCarrito = list.reduce((acc, prod) => acc + (prod.precio * (prod.cantidad || 1)), 0);

    const totalDiv = document.createElement('h3');
    totalDiv.style.gridColumn = '1 / -1';
    totalDiv.style.textAlign = 'right';
    totalDiv.textContent = `Total a pagar: $${totalCarrito.toFixed(2)}`;
    carritoGrid.appendChild(totalDiv);

    const btnComprar = document.createElement('button');
    btnComprar.textContent = '🛒 Realizar Pedido Final';
    btnComprar.classList.add('btn-checkout');
    btnComprar.style.marginTop = '20px';
    btnComprar.style.padding = '10px 20px';
    btnComprar.addEventListener('click', realizarPedido);
    
    const btnContainer = document.createElement('div');
    btnContainer.style.gridColumn = '1 / -1';
    btnContainer.style.textAlign = 'right';
    btnContainer.appendChild(btnComprar);
    
    carritoGrid.appendChild(btnContainer);
}

async function realizarPedido() {
    if (carritoProducts.length === 0) return;

    for (let prod of carritoProducts) {
        if ((prod.cantidad || 1) > (prod.stock || 0)) {
            Swal.fire('Atención', `No hay stock suficiente de ${prod.nombre}. (Quedan ${prod.stock || 0})`, 'warning');
            return;
        }
    }

    const pedidoPayload = {
        lineas: carritoProducts.map(prod => ({
            producto: { id: parseInt(prod.id) },
            cantidad: prod.cantidad || 1
        }))
    };

    try {
        const response = await fetch('http://localhost:8080/api/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedidoPayload)
        });

        const data = await response.json();

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: '¡Pedido Realizado!',
                text: `Tu orden se procesó con éxito.`,
                confirmButtonColor: '#3085d6'
            }).then(() => {
                localStorage.removeItem('carrito');
                window.location.reload();
            });
        } else {
            throw new Error(data.message || 'Error al procesar stock en el servidor.');
        }

    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: 'error',
            title: 'No se pudo realizar el pedido',
            text: error.message,
            confirmButtonColor: '#d33'
        });
    }
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

renderCarritoProducts(carritoProducts);