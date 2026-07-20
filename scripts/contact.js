function enviarConsulta(event) {
    event.preventDefault();

    const form = event.target;

    fetch('https://formspree.io/f/xanbqqqj', {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        },
        body: new FormData(form)
    })
    .then(response => {
        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Consulta enviada',
                text: 'Gracias por contactarnos, te responderemos pronto.',
                confirmButtonColor: '#3085d6'
            });
            form.reset();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un problema al enviar tu mensaje. Intenta más tarde.',
                confirmButtonColor: '#d33'
            });
        }
    })
    .catch(() => {
        Swal.fire({
            icon: 'error',
            title: 'Error de red',
            text: 'No se pudo enviar tu mensaje por un problema de conexión.',
            confirmButtonColor: '#d33'
        });
    });
}
