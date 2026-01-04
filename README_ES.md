# Global Tracker 🌍📦

**Global Tracker** es una solución integral de logística y seguimiento de envíos en tiempo real, diseñada para modernizar la gestión de entregas y mejorar la experiencia del cliente final.

Esta plataforma permite a las empresas gestionar su flujo de envíos desde la creación hasta la entrega ("last-mile"), proporcionando visibilidad total tanto a los administradores como a los clientes.

---

## 📋 Descripción de la Aplicación

La aplicación consta de dos módulos principales:

1.  **Portal de Seguimiento Público**: Una interfaz limpia y rápida donde los clientes pueden rastrear sus paquetes utilizando su número de guía (Waybill), ver el estado en tiempo real, la ubicación en el mapa y el historial de movimientos.
2.  **Backoffice Administrativo**: Un panel de control seguro para administradores y personal de reparto. Permite la creación de órdenes, actualización de estados, gestión de usuarios y visualización de métricas clave.

---

## ✅ Requerimientos Funcionales

### Para el Cliente (Público)
- **Rastreo en Tiempo Real**: Búsqueda de envíos mediante ID de seguimiento (Waybill).
- **Detalle de Envío**: Visualización de estado actual, fechas de registro y actualización, y detalles del receptor.
- **Mapa Interactivo**: Visualización de la ruta (Origen -> Destino) y ubicación actual del paquete.
- **Historial de Eventos**: Línea de tiempo con todos los cambios de estado.
- **Soporte Multi-idioma**: Interfaz disponible en Inglés y Español.
- **Temas**: Soporte para Modo Claro, Oscuro y Nocturno.

### Para el Administrador / Operador
- **Gestión de Órdenes**: Crear, editar y eliminar (soft-delete) envíos.
- **Actualización de Estado**: Cambiar el estado del envío (Creado, En Tránsito, En Reparto, Entregado, Completado).
- **Gestión de Usuarios**:
    - Roles diferenciados (Admin, Delivery, Viewer).
    - Flujo de aprobación para nuevos registros.
- **Panel de Control (Dashboard)**:
    - Tabla de envíos con filtros y búsqueda avanzada.
    - Pestañas para organizar envíos activos y completados.
- **Autenticación Segura**: Login y Registro con protección de rutas (JWT).

---

## 🚀 Casos de Uso

1.  **E-commerce**: Tiendas online que necesitan brindar a sus clientes una página de seguimiento personalizada sin depender de correos genéricos.
2.  **Logística de Última Milla**: Empresas de mensajería local que requieren un sistema ágil para que sus repartidores actualicen estados desde el móvil.
3.  **Transporte de Carga**: Seguimiento de fletes punto a punto con visibilidad de origen y destino.
4.  **Servicios de Delivery**: Gestión de entregas rápidas con información de contacto del cliente y chofer asignado.

---

## 🏭 Industrias Objetivo

- **Retail y Comercio Electrónico**: Para mejorar la satisfacción post-venta.
- **Logística y Transporte**: Empresas de paquetería, mudanzas o fletes.
- **Salud y Farmacia**: Trazabilidad de entrega de medicamentos a domicilio.
- **Gastronomía**: (Con adaptaciones) Seguimiento de pedidos de comida grandes o catering.

---

## 💻 Tecnologías Usadas

### Frontend
- **React**: Biblioteca principal para la interfaz de usuario.
- **Vite**: Empaquetador y entorno de desarrollo ultrarrápido.
- **React Router**: Manejo de navegación y rutas protegidas.
- **Framer Motion**: Animaciones fluidas para una experiencia "Premium".
- **Leaflet / React-Leaflet**: Mapas interactivos OpenSource.
- **Lucide React**: Iconografía moderna y consistente.
- **i18next**: Internacionalización y gestión de traducciones.

### Backend
- **Node.js**: Entorno de ejecución para el servidor.
- **Express**: Framework web para la API RESTful.
- **PostgreSQL**: Base de datos relacional robusta.
- **JWT (JSON Web Tokens)**: Autenticación segura sin estado.
- **Bcrypt**: Hashed de contraseñas para seguridad.

### Infraestructura y Herramientas
- **Docker** (Opcional): Para contenerización de servicios.
- **Git**: Control de versiones.

