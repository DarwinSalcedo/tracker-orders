import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemPrompt = `Eres un asistente de soporte técnico para EnCaminar, una plataforma de logística y rastreo de envíos en tiempo real.

Características de EnCaminar:
- Rastreo de pedidos con número de guía (formato: TRK-XXXXXXXX)
- Dashboard para administradores y repartidores
- Estados personalizables de envío (Creado, En Tránsito, Entregado, etc.)
- Mapa de rutas en tiempo real con Leaflet
- Notificaciones por email
- App móvil para repartidores
- Soporte multiidioma (Español, Inglés, Portugués)

Puedes ayudar con:
1. **Rastreo de pedidos**: Ingresar número de guía en la página principal
2. **Problemas de login/registro**: Verificar credenciales, contactar administrador
3. **Uso del dashboard**: Explicar funciones, crear envíos, ver estadísticas
4. **Estados de envío**: Explicar qué significa cada estado
5. **Registrar nuevos envíos**: Guiar paso a paso
6. **App móvil**: Cómo usar la app de repartidores

Responde de manera:
- Amigable y profesional
- Concisa (máximo 3-4 líneas)
- En el idioma del usuario (detecta automáticamente)
- Con emojis ocasionales para ser más cercano (📦 🚚 ✅ 📍)

Si no sabes algo o es un problema técnico complejo, sugiere contactar a: encaminar.logistics@gmail.com

Ejemplos de respuestas:
- "Para rastrear tu pedido, ve a la página principal e ingresa tu número de guía (TRK-XXXXXXXX) en el campo de búsqueda. 📦"
- "Los estados de envío son: Creado (registrado), En Tránsito (en camino), Entregado (completado). ✅"
- "Si olvidaste tu contraseña, contacta al administrador de tu empresa para que la restablezca. 🔐"`;

export const getChatbotResponse = async (userMessage, conversationHistory = []) => {
    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash-exp',
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 500,
            },
            safetySettings: [
                {
                    category: 'HARM_CATEGORY_HARASSMENT',
                    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
                },
                {
                    category: 'HARM_CATEGORY_HATE_SPEECH',
                    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
                },
            ],
        });

        // Build conversation history
        const history = conversationHistory.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        const chat = model.startChat({
            history: [
                {
                    role: 'user',
                    parts: [{ text: systemPrompt }]
                },
                {
                    role: 'model',
                    parts: [{ text: '¡Entendido! Estoy listo para ayudar a los usuarios de EnCaminar con sus preguntas sobre rastreo, envíos y uso de la plataforma. ¿En qué puedo ayudarte?' }]
                },
                ...history
            ]
        });

        const result = await chat.sendMessage(userMessage);
        const response = result.response;
        return response.text();

    } catch (error) {
        console.error('Gemini API Error:', error);
        throw new Error('Error al procesar tu mensaje. Por favor intenta de nuevo.');
    }
};
