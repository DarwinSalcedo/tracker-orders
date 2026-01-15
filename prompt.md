 proyecto: Track-as-a-Service
🧠 Idea general

Proyecto de portafolio llamado Track-as-a-Service.
Es una aplicación web donde el usuario ingresa:

📦 Order Tracking ID

📧 Correo electrónico

Y la app muestra:

🗺️ Un mapa con la ubicación del paquete

📋 Un cuadro / timeline de estados del pedido (order placed, in transit, delivered, etc.)

Los datos pueden ser mock/simulados (MVP), no tiempo real.

🧱 Arquitectura elegida

Repositorio monorepo en GitHub:

track-as-a-service/
├── backend/        → API
├── frontend/       → UI
└── README.md

🔧 Backend

Lenguaje: Node.js

Framework: Express

Endpoints principales:

GET /health

POST /api/track

Usa datos mock de tracking

Lee el puerto desde process.env.PORT

Pensado para desplegarse en Render (Free Tier)

📌 Importante:

package.json está dentro de /backend

En Render se debe configurar:

Language: Node

Root Directory: backend

Build command: npm install

Start command: npm run start

🎨 Frontend

Stack: React + Vite

Formulario simple para tracking + email

Consume la API del backend

Se planea agregar:

Mapa (Leaflet + OpenStreetMap)

Timeline de estados

Se desplegará como Render Static Site

🌍 Deployment (Render)

Backend → Web Service (Node)

Frontend → Static Site

Error encontrado y resuelto:

❌ “Couldn't find a package.json file”

✅ Solución: configurar Root Directory = backend

🔐 Variables de entorno (backend)

NODE_ENV=production

FRONTEND_URL=...

PORT → lo inyecta Render automáticamente

Opcionales:

MAPBOX_API_KEY

Variables de email (futuro)

Frontend:

VITE_API_URL=... (solo variables públicas)

🚀 Estado actual

Repo creado en GitHub

Backend básico funcionando

Error de Render identificado y solucionado

Proyecto listo para:

Desplegar correctamente

Agregar mapa

Mejorar UI

Documentar README

Cuando vuelvas, puedes decir algo como:

“Quiero continuar con el proyecto Track-as-a-Service”
o
“Sigamos desde el despliegue / el mapa / el frontend”




--------------------------------

Walkthrough - Logistics Rebranding & Shipment Manifest
I have transformed the application from a generic "Order Tracker" into a professional "Logistics Command Center" focused on shipments and deliveries.

Changes Made
1. Shipment Branding & Vocabulary
I've updated all user-facing labels across the application:

"Order" → "Shipment"
"Tracking ID" → "Waybill Number"
"History" → "Shipment Manifest"
"Dashboard" → "Logistics Command Center"
"Customer" → "Client"
2. Visual Logistics Enhancements
Updated icons and UI elements to reflect a logistics focus:

Replaced general package icons with Trucks, Boxes, and Manifest (Clipboard) icons.
Updated the "Waybill" display in details to look more like a shipping label header.
Enhanced the "Status Manifest" and "Routing Matrix" labels in details.
3. Functional Actions (Update & Soft Delete)
Track Shipment: Quick navigation from manifest to real-time tracking.
Update Manifest: Dropdown to change shipment status directly.
Archive Shipment: Trash icon to "soft delete" (hide) shipments from the manifest.

-------------------------------

That error happens because this is a Single Page Application (SPA).

When you navigate within the app, React handles the routing. But when you refresh the page, the browser asks the Render server for a file at /backoffice/dashboard, which doesn't exist (only index.html exists).

The Fix:
You need to tell Render to redirect all requests to index.html.

Go to your Static Site settings in the Render Dashboard.
Navigate to the Redirects/Rewrites tab.
Add a new rule:
Source: /*
Destination: /index.html
Action: Rewrite
Once you save this, refreshing any page will work perfectly! I've also added these instructions to the 

-----------------------------------
Implementation Plan - Expanding Shipment Fields
Enhance the shipment registration process with more flexible field requirements and additional delivery information.

Proposed Changes
Database
[MODIFY] 
init_db.sql
Add delivery_person (VARCHAR) and delivery_instructions (TEXT) columns to the orders table.
Backend
[MODIFY] 
orders.routes.js
Update POST /orders to accept and store delivery_person and delivery_instructions.
Update GET /orders to include these fields in the response.
Frontend
[MODIFY] 
CreateOrder.jsx
Add "Delivery Person" and "Delivery Instructions" inputs to the form (marked as optional).
Remove the required validation from Pickup and Dropoff coordinate fields.
Ensure the payload sent to the API includes the new fields.
[MODIFY] 
OrderDetails.jsx
Update the "Shipment Logistics" section to display the delivery person and instructions if they are provided.
Verification Plan
Manual Verification
Register Shipment:
Try creating a shipment without entering coordinates.
Add a "Delivery Person" and "Instructions".
Verify registration is successful.
View Manifest:
Check if the new shipment appears correctly.
Track Shipment:
Verify that the delivery person and instructions are visible on the tracking details page.
-----------------------------------
# Implementation Plan - Leaflet Map Integration
Visualize shipment progress with an interactive Leaflet map using OpenStreetMap data.
## Proposed Changes
### Dependencies
- Install `leaflet` and `react-leaflet`.
- Add Leaflet CSS to `index.html` or `main.jsx`.
### Components
#### [NEW] [ShipmentMap.jsx](file:///Users/darwinsalcedo/Documents/dev/tracker-order/tracker-orders/frontend/src/components/ShipmentMap.jsx)
- Interactive map component using `react-leaflet`.
- Displays markers for:
    - **Pickup** (Blue icon)
    - **Destination** (Green icon)
    - **Current Location** (Red pulsating/truck icon)
- Draws a polyline between points to show the route.
- Automatically fits bounds to show all markers.
#### [MODIFY] [OrderDetails.jsx](file:///Users/darwinsalcedo/Documents/dev/tracker-order/tracker-orders/frontend/src/pages/Tracker/OrderDetails.jsx)
- Replace the "Map Visualization Placeholder" with the new `ShipmentMap` component.
- Pass shipment coordinates (`pickup`, `dropoff`, `currentLocation`) as props.
### Styles
- Ensure map container has a defined height/width (at least 400px height).
- Fix Leaflet marker icon path issues common in Vite/React.
## Verification Plan
### Manual Verification
1. **View Shipment Details**:
    - Open tracking for a shipment with coordinates.
    - Verify the map loads and centers correctly.
    - Check if markers for origin and destination are visible.
    - Verify the polyline connecting the points.
2. **Handle Optional Locations**:
    - Track a shipment with no coordinates.
    - Verify the map shows a "No location data" message or a default empty state gracefully.
-----------------------------------
mplementation Plan - Real Auth and RBAC
This plan outlines the steps to replace the mocked authentication with a robust JWT-based system and implement Role-Based Access Control (RBAC) with two roles: Admin and Delivery.

User Review Required
IMPORTANT

The database will be updated with a new users table. Existing mocked credentials (admin/password123) in the frontend will be removed.

NOTE

Admin will have full access to all order management features. Delivery will be restricted to only updating the status and location of an order.

Proposed Changes
Backend
Dependency Updates
Install bcryptjs for password hashing.
Install jsonwebtoken for token-based authentication.
Database
Modify 
init_db.sql
 (or create a migration) to include the users table:
id
 (serial pk)
username (unique)
password_hash
role (Admin, Delivery)
[NEW] src/controllers/auth.controller.js
register: Hash password and save new user.
login
: Verify password and issue JWT token.
[NEW] src/routes/auth.routes.js
POST /api/auth/register
POST /api/auth/login
[NEW] src/middleware/auth.middleware.js
verifyToken: Middleware to protect routes.
authorize(roles): Middleware to restrict access based on user role.
[MODIFY] 
src/index.js
Register auth routes.
Add error handling for auth-related issues.
[MODIFY] 
src/routes/orders.routes.js
Apply verifyToken to all routes.
Apply role restrictions:
GET /, POST /, DELETE /: Admin only.
PATCH /:id: Admin or Delivery.
Frontend
[MODIFY] 
src/services/authService.js
Update to call real backend endpoints.
Store JWT in localStorage or HttpOnly cookie (using localStorage for simplicity in this proto).
[MODIFY] 
src/context/AuthContext.jsx
Handle persistence of user role and token.
Update loading states.
[NEW] src/pages/Backoffice/Register.jsx
Form for user registration.
[MODIFY] 
src/App.jsx
Add register route.
Enhance 
ProtectedRoute
 to accept allowedRoles prop.
[MODIFY] src/pages/Backoffice/Dashboard.jsx
Filter actions or views based on the current user's role.
Verification Plan
Automated Tests
Postman or manual curl tests for:
Invalid login.
Valid login returns JWT.
Restricted route returns 403 for Delivery role.
Restricted route returns 200 for Admin role.
Manual Verification
Register a new Admin.
Register a new Delivery user.
Log in as Admin -> Verify full dashboard access.
Log in as Delivery -> Verify restricted access (cannot see "Create Order" or "Delete" if applicable).



# Track-as-a-Service

Mock order tracking application with a Node.js backend and React frontend.

## Architecture
- **Backend**: Node.js, Express, PostgreSQL
- **Frontend**: React, Vite
- **Deployment**: Render

## Backend Setup

### Prerequisites
- Node.js
- PostgreSQL (or use a remote instance)

### Installation
```bash
cd backend
npm install
```

### Environment Variables
Create a `.env` file in the `backend` directory:
```env
PORT=3000
DATABASE_URL=postgresql://user:password@host:port/dbname
```

### Database Setup
Run the setup script to create tables and seed default statuses:
```bash
node src/scripts/setup.js
```

### Running Locally
```bash
npm start
```

## API Endpoints

### Public
- `GET /health`: Health check.
- `POST /api/track`: Track an order.
    - Body: `{ "trackingId": "TRK-123", "email": "user@example.com" }`

### Backoffice (Admin)
- `GET /api/statuses`: List available order statuses.
- `POST /api/orders`: Create a new order.
    - Body: 
      ```json
      { 
        "trackingId": "TRK-123", 
        "email": "user@example.com",
        "pickup": { "lat": 40.71, "lng": -74.00 },
        "dropoff": { "lat": 34.05, "lng": -118.24 }
      }
      ```
- `PATCH /api/orders/:id`: Update an order.
    - Body: `{ "statusCode": "in_transit", "lat": 19.43, "lng": -99.13 }`

## Deployment (Render)

1. **Service Type**: Web Service
2. **Root Directory**: `backend`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. **Environment Variables**:
    - `DATABASE_URL`: Connection string from your PostgreSQL database.
    - `NODE_ENV`: `production`

## Database
The application uses `pg` to connect to PostgreSQL.
**Schema**:
- `orders`: Stores simplified order details.
- `order_statuses`: Lookup table for statuses (created, in_transit, delivered).
- `order_history`: Audit trail of status/location changes.
------------------------------------


Implementation Plan - Delivery Mobile App
This plan describes the creation of a React Native (Expo) mobile application for delivery personnel to view and manage their assigned shipments.

User Review Required
NOTE

I will initialize a new Expo project in tracker-orders-mobile (adjacent to frontend/backend). Tech Stack: React Native, Expo, React Navigation, Axios, Expo Location.

Proposed Changes
Project Structure
[NEW] [mobile/] (New Directory)
Initialize using npx create-expo-app@latest.
Install dependencies: react-navigation, axios, expo-secure-store (for JWT), expo-location.
Screens & Logic
1. Authentication
Login Screen: Minimalist UI.
Inputs: Username/Password.
Action: POST /api/auth/login.
Storage: Save JWT in SecureStore.
Auth Flow: Check token on launch. If valid -> Dashboard; else -> Login.
2. Dashboard (Orders List)
Home Screen:
Fetch orders from GET /api/orders (Backend automatically filters for the logged-in user).
Display standard list cards (ID, Status, From/To Address).
Pull-to-refresh to update.
3. Order Details
Detail Screen:
Show full logistics info (Map, Phone, Instructions).
Status Actions: Buttons to change status (e.g., "Start Delivery", "Arrived", "Delivered").
Map Integration: Use react-native-maps to show the route (Pickup -> Dropoff).
4. Location Tracking (MVP Phase 1)
Feature: When the user opens the Order Detail screen, get current GPS position.
Action: Call PATCH /api/orders/:id with { lat, lng } to update the real-time location on the web dashboard.
Note: True background location service requires more configuration; for this MVP, we update while the app is open/active.
Verification
Run: npx expo start.
Login: Use a delivery user account.
View: Confirm only assigned orders appear.
Update: Change status to "In Transit" from phone.
Check Web: Verify status and location update on the Backoffice dashboard.


-----------------------------------

Google Gemini Chatbot Implementation Plan
Overview
Implement a technical support chatbot using Google Gemini AI to assist EnCaminar users with common questions about tracking, orders, and platform usage.

Why Google Gemini?
✅ Free tier: 60 requests/minute
✅ Multilingual: Supports ES/EN/PT natively
✅ Context-aware: Can maintain conversation history
✅ Fast: Low latency responses
✅ Easy integration: Official SDK available
Proposed Changes
Backend
[NEW] 
chatbotService.js
Create Gemini service to handle chat requests:

Initialize Gemini AI client
Define system prompt with EnCaminar context
Handle conversation history
Generate responses with safety settings
Key Features:

Multilingual support (auto-detects language)
Context about EnCaminar features
Safety filters enabled
Temperature: 0.7 for balanced responses
[NEW] 
chatbot.routes.js
API endpoint for chat:

POST /api/chatbot/chat - Send message, get response
Request body: { message, history }
Response: { response, conversationId }
Security:

No authentication required (public support)
Rate limiting recommended
Input validation
[MODIFY] 
index.js
Register chatbot routes:

import chatbotRoutes from './routes/chatbot.routes.js';
app.use('/api/chatbot', chatbotRoutes);
Frontend
[NEW] 
ChatWidget.jsx
Floating chat widget component:

Floating button (bottom-right)
Expandable chat window
Message history display
Input field with send button
Loading states
Responsive design
Features:

Framer Motion animations
Auto-scroll to latest message
Enter key to send
Typing indicator
Error handling
[MODIFY] 
App.jsx
Add ChatWidget to main app:

import ChatWidget from './components/ChatWidget';
// In return, after routes
<ChatWidget />
Configuration
[MODIFY] 
.env
Add Gemini API key:

GEMINI_API_KEY=your_api_key_here
How to get API key:

Go to https://makersuite.google.com/app/apikey
Create new API key
Copy and paste to .env
Translations
[MODIFY] Locale Files
Add chatbot translations:

{
  "chatbot": {
    "title": "Soporte EnCaminar",
    "placeholder": "Escribe tu mensaje...",
    "initial_message": "¡Hola! ¿En qué puedo ayudarte?",
    "typing": "Escribiendo...",
    "error": "Lo siento, hubo un error. Intenta de nuevo."
  }
}
System Prompt
The chatbot will be configured with this context:

Eres un asistente de soporte técnico para EnCaminar, una plataforma de 
logística y rastreo de envíos en tiempo real.
Características de EnCaminar:
- Rastreo de pedidos con número de guía
- Dashboard para administradores y repartidores
- Estados personalizables de envío
- Mapa de rutas en tiempo real
- Notificaciones por email
- App móvil para repartidores
Puedes ayudar con:
1. Rastreo de pedidos (ingresar número de guía en la página principal)
2. Problemas de login/registro
3. Cómo usar el dashboard
4. Explicar estados de envío
5. Cómo registrar nuevos envíos
6. Preguntas sobre la app móvil
Responde de manera:
- Amigable y profesional
- Concisa (máximo 3-4 líneas)
- En el idioma del usuario
- Con emojis ocasionales para ser más cercano
Si no sabes algo, sugiere contactar a: encaminar.logistics@gmail.com
Installation Steps
1. Install Dependencies
cd backend
npm install @google/generative-ai
2. Get API Key
Visit: https://makersuite.google.com/app/apikey
Create new project (if needed)
Generate API key
Copy to .env
3. Test API Key
# Test in backend
node -e "import('@google/generative-ai').then(m => console.log('✅ SDK installed'))"
Testing Plan
Manual Testing
Open application
Click chat button (bottom-right)
Send test messages:
"Hola"
"¿Cómo rastro mi pedido?"
"No puedo iniciar sesión"
"¿Qué significa 'En Tránsito'?"
Verify responses are relevant
Test in different languages
Edge Cases
Empty messages
Very long messages
Special characters
Network errors
API rate limits
Deployment Considerations
Environment Variables
Add GEMINI_API_KEY to Render environment variables
Keep key secret, never commit to git
Rate Limiting
Free tier limits:

60 requests/minute
1,500 requests/day
Consider adding rate limiting if needed.

Monitoring
Log chatbot usage
Track common questions
Monitor API costs (if upgraded)
Summary
✅ Backend: Gemini service + API route
✅ Frontend: Floating chat widget
✅ Multilingual: Auto-detects ES/EN/PT
✅ Free: Uses Gemini free tier
✅ Context-aware: Knows about EnCaminar features

Ready to implement! 🚀