# Global Tracker 🌍📦

**Global Tracker** is a comprehensive real-time logistics and shipment tracking solution, designed to modernize delivery management and enhance the final customer experience.

This platform allows businesses to manage their shipment flow from creation to "last-mile" delivery, providing full visibility to both administrators and customers.

---

## 📋 App Description

The application consists of two main modules:

1.  **Public Tracking Portal**: A clean, fast interface where customers can track their packages using their Waybill number, view real-time status, map location, and movement history.
2.  **Administrative Backoffice**: A secure control panel for administrators and delivery personnel. It allows for order creation, status updates, user management, and key metrics visualization.

---

## ✅ Functional Requirements

### For the Customer (Public)
- **Real-Time Tracking**: Shipment search via Waybill ID.
- **Shipment Details**: View current status, registration/update dates, and receiver details.
- **Interactive Map**: Visualization of the route (Origin -> Destination) and current package location.
- **Event History**: Timeline showing all status changes.
- **Multi-language Support**: Interface available in English and Spanish.
- **Themes**: Support for Light, Dark, and Night modes.

### For the Administrator / Operator
- **Order Management**: Create, edit, and delete (soft-delete) shipments.
- **Status Updates**: Change shipment status (Created, In Transit, Delivered, Completed, etc.).
- **User Management**:
    - Differentiated roles (Admin, Delivery, Viewer).
    - Approval flow for new registrations.
- **Dashboard**:
    - Shipment table with advanced filters and search.
    - Tabs to organize active and completed shipments.
- **Secure Authentication**: Login and Register with route protection (JWT).

---

## 🚀 Use Cases

1.  **E-commerce**: Online stores needing to provide customers with a branded tracking page without relying on generic carrier emails.
2.  **Last-Mile Logistics**: Local courier companies requiring an agile system for drivers to update statuses from mobile.
3.  **Freight Transport**: Point-to-point freight tracking with origin and destination visibility.
4.  **Delivery Services**: Managing quick deliveries with customer contact info and assigned driver.

---

## 🏭 Target Industries

- **Retail & E-commerce**: Improving post-purchase satisfaction.
- **Logistics & Transportation**: Courier, moving, or freight companies.
- **Healthcare & Pharmacy**: Traceability of home medication delivery.
- **Food & Beverage**: (With adaptations) Tracking large catering or food orders.

---

## 💻 Tech Stack

### Frontend
- **React**: Main library for the user interface.
- **Vite**: Ultra-fast bundler and development environment.
- **React Router**: Navigation and protected route handling.
- **Framer Motion**: Smooth animations for a "Premium" feel.
- **Leaflet / React-Leaflet**: OpenSource interactive maps.
- **Lucide React**: Modern and consistent iconography.
- **i18next**: Internationalization and translation management.

### Backend
- **Node.js**: Server runtime environment.
- **Express**: Web framework for the RESTful API.
- **PostgreSQL**: Robust relational database.
- **JWT (JSON Web Tokens)**: Stateless secure authentication.
- **Bcrypt**: Password hashing for security.

### Infrastructure & Tools
- **Docker** (Optional): For service containerization.
- **Git**: Version control.

