const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

document.addEventListener('DOMContentLoaded', async () => {
    if (!productId) return;
    
    try {
        const producto = await ProductoService.obtenerPorId(productId);
        
        document.querySelector('#product-title').value = producto.nombre || '';
        document.querySelector('#product-price').value = producto.precio || '';
        document.querySelector('#product-category').value = producto.categoria || '';
        document.querySelector('#product-image').value = producto.imagen || '';
        document.querySelector('#product-description').value = producto.descripcion || '';
        document.querySelector('#product-offert').checked = producto.oferta || false;
        document.querySelector('#product-freeShipping').checked = producto.envioGratis || false;

    } catch (error) {
        Swal.fire('Error', 'No se encontró el producto', 'error');
    }
});

async function updateSubmit(event) {
    event.preventDefault();

    const productoActualizado = {
        nombre: document.querySelector('#product-title').value.trim(),
        precio: parseFloat(document.querySelector('#product-price').value),
        categoria: document.querySelector('#product-category').value.trim().toLowerCase(),
        imagen: document.querySelector('#product-image').value.trim(),
        descripcion: document.querySelector('#product-description').value.trim(),
        stock: parseInt(document.getElementById('stock-input').value),
        oferta: document.querySelector('#product-offert').checked,
        envioGratis: document.querySelector('#product-freeShipping').checked
    };

    try {
        await ProductoService.actualizar(productId, productoActualizado);
        Swal.fire('¡Actualizado!', 'Producto modificado con éxito', 'success').then(() => {
            window.location.href = './products.html';
        });
    } catch (error) {
        Swal.fire('Error', 'No se pudieron guardar los cambios', 'error');
    }
}