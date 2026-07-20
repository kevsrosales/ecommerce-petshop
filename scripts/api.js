const API_BASE_URL = 'http://localhost:8080/api';

async function fetchAPI(endpoint, opciones = {}) {
    try {
        const respuesta = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...opciones,
            headers: {
                'Content-Type': 'application/json',
                ...(opciones.headers || {})
            }
        });

        if (!respuesta.ok) {
            throw new Error(`Error en el servidor: ${respuesta.status}`);
        }

        if (respuesta.status === 204 || respuesta.status === 200 && respuesta.headers.get("content-length") === "0") {
            return null;
        }

        return await respuesta.json();
    } catch (error) {
        console.error(`Error conectando a ${endpoint}:`, error);
        throw error;
    }
}

const ProductoService = {
    obtenerTodos: () => fetchAPI('/productos'),
    obtenerPorId: (id) => fetchAPI(`/productos/${id}`),
    crear: (producto) => fetchAPI('/productos', { method: 'POST', body: JSON.stringify(producto) }),
    actualizar: (id, producto) => fetchAPI(`/productos/${id}`, { method: 'PUT', body: JSON.stringify(producto) }),

    eliminar: async (id) => {
        const respuesta = await fetch(`http://localhost:8080/api/productos/${id}`, { 
            method: 'DELETE' 
        });
        if (!respuesta.ok) throw new Error('Fallo al eliminar');
        return true;
    }
};

const UsuarioService = {
    obtenerTodos: () => fetchAPI('/usuarios')
};

document.addEventListener('DOMContentLoaded', () => {
    const navLeft = document.querySelector('.nav-left');
    if (!navLeft) return;

    const usuarioString = localStorage.getItem('user');
    const userRole = localStorage.getItem('userRole');

    if (usuarioString) {
        const enAdmin = window.location.pathname.includes('/admin/');
        const prefijoRuta = enAdmin ? '../' : '';

        navLeft.innerHTML = '';

        if (userRole === 'admin') {
            const rutaPanel = enAdmin ? 'products.html' : 'admin/products.html';
            navLeft.innerHTML += `<a href="${rutaPanel}" class="nav-panel-btn">⚙️ Panel</a>`;
        }

        navLeft.innerHTML += `<a href="${prefijoRuta}carrito.html">Carrito</a>`;

        const btnSalir = document.createElement('a');
        btnSalir.href = '#';
        btnSalir.textContent = 'Salir';
        btnSalir.style.cursor = 'pointer';
        
        btnSalir.addEventListener('click', async (e) => {
            e.preventDefault();

            const confirmacion = await Swal.fire({
                title: '¿Cerrar sesión?',
                text: "Vas a salir de tu cuenta",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, salir',
                cancelButtonText: 'Cancelar'
            });

            if (confirmacion.isConfirmed) {
                localStorage.clear();
                window.location.href = enAdmin ? '../index.html' : 'index.html';
            }
        });

        navLeft.appendChild(btnSalir);
    }
});