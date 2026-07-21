# 🐾 Tienda de Mascotas - Frontend (Cliente & Panel de Administración)

Este repositorio contiene la interfaz de usuario (Frontend) para la aplicación web de la **Tienda de Mascotas**. Está diseñada para ofrecer una experiencia fluida e intuitiva tanto a los clientes que buscan productos para sus mascotas como al administrador de la tienda.

## 🚀 ¿Qué hace este proyecto?
* **Catálogo Dinámico:** Muestra productos categorizados de manera automática para Perros, Gatos u Ofertas.
* **Filtros Avanzados:** Permite filtrar productos en tiempo real mediante checkboxes (por Ofertas o Envíos Gratis).
* **Carrito de Compras Autónomo:** Los usuarios pueden agregar productos, modificar la cantidad, visualizar el total a pagar y eliminar artículos. El carrito persiste sus datos de manera local utilizando `localStorage`.
* **Detalles mediante Modales:** Implementa ventanas emergentes interactivas con `SweetAlert2` para ver las especificaciones de cada producto en profundidad y chequear el stock actual antes de comprar.
* **Panel de Control de Administrador (`admin/`):** Una sección privada que renderiza una tabla interactiva con todos los productos de la base de datos, permitiendo visualizar el Stock disponible y las acciones para Editar o Eliminar productos.

## 🛠️ Tecnologías Utilizadas
* **HTML5:** Estructura limpia y semántica de las distintas páginas (Inicio, Perros, Gatos, Carrito, Ofertas, Admin).
* **CSS3:** Estilos responsivos con un diseño moderno, adaptado para dispositivos móviles a través de un menú hamburguesa dinámico.
* **JavaScript (Vanilla):** Lógica nativa encargada de manipular el DOM de manera eficiente, capturar eventos, procesar arreglos e interactuar con la memoria del navegador.
* **SweetAlert2:** Librería externa integrada para mostrar notificaciones estéticas y ventanas modales interactivas (alertas de éxito, errores y confirmaciones).

## 🔄 Conexión e Integración Fullstack
Este Frontend está programado para comunicarse directamente mediante peticiones asíncronas (`fetch` / `async-await`) con la API del Backend.

### Flujos Clave de Comunicación:
1. **Peticiones GET:** Cuando el catálogo o el administrador se cargan, JavaScript solicita la lista actualizada de artículos al backend.
2. **Peticiones POST:** Al presionar "Realizar Pedido Final", el archivo `carrito.js` emite una solicitud estructurada al servidor con la lista de IDs comprados y sus cantidades respectivas para que el servidor procese el stock y calcule el total real.
3. **Peticiones DELETE:** Al eliminar un producto desde la tabla de administración, se envía el ID del artículo al backend para removerlo permanentemente de la base de datos de MySQL.

### Muestras del funcionamiento:
* https://www.youtube.com/watch?v=Nb0YaW-j9mg
* https://youtu.be/2rZ-yJ072h4
