async function crearSubmit(event) {
    event.preventDefault();

    const nuevoProducto = {
        nombre: document.querySelector('#product-title').value.trim(),
        precio: parseFloat(document.querySelector('#product-price').value),
        categoria: document.querySelector('#product-category').value.trim().toLowerCase(),
        imagen: document.querySelector('#product-image').value.trim(),
        descripcion: document.querySelector('#product-description').value.trim(),
        stock: 50,
        oferta: document.querySelector('#product-offert').checked,
        envioGratis: document.querySelector('#product-freeShipping').checked
    };

    try {
        await ProductoService.crear(nuevoProducto);
        
        Swal.fire('¡Éxito!', 'Producto creado correctamente', 'success').then(() => {
            window.location.href = 'products.html'; 
        });
    } catch (error) {
        Swal.fire('Error', 'No se pudo guardar el producto', 'error');
    }
}