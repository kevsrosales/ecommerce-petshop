document.addEventListener('DOMContentLoaded', cargarProductosAdmin);

async function cargarProductosAdmin() {
    try {
        const productos = await ProductoService.obtenerTodos();
        mostrarTablaProductos(productos);
    } catch (error) {
        console.error("Error al cargar la tabla de administrador", error);
    }
}

function mostrarTablaProductos(productos) {
    const tbody = document.getElementById('product-list'); 
    
    if (!tbody) return;
    tbody.innerHTML = ''; 

    productos.forEach(producto => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${producto.id}</td>
            <td>
                <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 50px; height: 50px; object-fit: cover;">
            </td>
            <td>${producto.nombre}</td>
            <td>$${producto.precio}</td>
            <td>${producto.categoria}</td>
            <td>${producto.stock !== null && producto.stock !== undefined ? producto.stock : 0} u.</td>
            <td>
                <button onclick="editarProducto(${producto.id})" class="btn-editar">Editar</button>
                <button onclick="eliminarProducto(${producto.id})" class="btn-eliminar">Eliminar</button>
            </td>
        `;
        tbody.appendChild(fila);
    });
}

function editarProducto(id) {
    window.location.href = `edit-product.html?id=${id}`;
}

async function eliminarProducto(id) {
    const confirmacion = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (confirmacion.isConfirmed) {
        try {
            await ProductoService.eliminar(id);
            Swal.fire('¡Eliminado!', 'El producto ha sido eliminado.', 'success');
            cargarProductosAdmin(); 
        } catch (error) {
            Swal.fire('Error', 'Hubo un problema al eliminar.', 'error');
        }
    }
}