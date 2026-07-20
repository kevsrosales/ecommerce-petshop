document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form') || document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', iniciarSesion);
    } else {
        console.warn("No se encontró ninguna etiqueta <form> en login.html");
    }
});

async function iniciarSesion(event) {
    event.preventDefault();
    
    const userIngresado = document.getElementById('username').value;
    const passIngresada = document.getElementById('password').value;

    try {
        const usuarios = await UsuarioService.obtenerTodos();
        let usuarioValido = null;

        usuarios.forEach(credenciales => {
            if (credenciales.usuario === userIngresado && credenciales.password === passIngresada) {
                usuarioValido = credenciales;
            }
        });

        if (usuarioValido) {
            localStorage.setItem('user', JSON.stringify(usuarioValido));
            localStorage.setItem('userRole', usuarioValido.role);
            
            window.location.href = usuarioValido.role === 'admin' ? 'admin/products.html' : 'index.html';
        } else {
            Swal.fire('Error', 'Usuario o contraseña incorrectos', 'error');
        }
    } catch (error) {
        Swal.fire('Error', 'Fallo la conexión con el servidor de usuarios', 'error');
    }
}