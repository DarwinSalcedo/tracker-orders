// DOM Elements
const scrollElements = document.querySelectorAll("[data-animate]");
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const navContainer = document.querySelector(".nav-container");

// --- Mobile Menu ---
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
        navContainer.classList.toggle("mobile-open");
    });
}

// --- Internationalization (i18n) ---
const translations = {
    en: {
        nav: {
            features: "Features",
            adaptability: "Adaptability",
            pricing: "Pricing",
            login: "Login",
            get_started: "Get Started"
        },
        hero: {
            badge: "New in 2.0: Flex-Routing",
            title: "Logistics that <br><span class='highlight-text'>flows with you.</span>",
            subtitle: "Stop fighting rigid software. EnCaminar adjusts to your workflows, not the other way around. Simple, powerful, and adaptable.",
            cta_primary: "Start for Free",
            cta_secondary: "See how it works →"
        },
        adapt: {
            title: "One Platform, Any Model",
            subtitle: "From last-mile delivery to B2B freight, configure EnCaminar to fit your specific needs.",
            taxi: { title: "Taxi Networks", desc: "Give passengers real-time visibility of their route. Autonomous or fleet-managed." },
            retail: { title: "Hardware & Retail", desc: "Look professional. Send branded tracking links for every delivery, no matter the size." },
            lastmile: { title: "Last Mile Visibility", desc: "Ensure transparency in the final leg of logistics. Build trust with every drop-off." }
        },
        features: {
            title: "Simple. Powerful.",
            subtitle: "We removed the clutter so you can focus on moving things.",
            mobile: { title: "Driver App", desc: "Native iOS & Android experience." },
            analytics: { title: "Real-Time Data", desc: "Live metrics that actually matter." },
            workflow: {
                title: "Custom Workflows",
                desc: "Define your own status stages.",
                start: "Start",
                process: "Processing",
                transit: "In Transit",
                finish: "Delivered"
            }
        },
        cta: {
            title: "Ready to simplify your logistics?",
            subtitle: "Join flexible teams moving faster with EnCaminar.",
            btn: "Get Started"
        },
        landing: {
            driver_arrived: "Driver Arrived",
            order: "Order",
            order_status: "Delivered"
        }
    },
    es: {
        nav: {
            features: "Funcionalidades",
            adaptability: "Adaptabilidad",
            pricing: "Precios",
            login: "Ingresar",
            get_started: "Comenzar"
        },
        hero: {
            badge: "Nuevo en 2.0: Flex-Routing",
            title: "Logística que <br><span class='highlight-text'>fluye contigo.</span>",
            subtitle: "Deja de pelear con software rígido. EnCaminar se ajusta a tus flujos de trabajo. Simple, potente y adaptable.",
            cta_primary: "Prueba Gratis",
            cta_secondary: "Mira cómo funciona →"
        },
        adapt: {
            title: "Una Plataforma, Cualquier Modelo",
            subtitle: "Desde taxis autónomos hasta ferreterías, configura EnCaminar a tu medida.",
            taxi: { title: "Red de Taxis", desc: "Dale visibilidad en tiempo real a tus pasajeros. Autónomos o flotas." },
            retail: { title: "Ferretería y Retail", desc: "Luce más profesional. Envía links de rastreo con tu marca en cada entrega." },
            lastmile: { title: "Visibilidad Última Milla", desc: "Asegura transparencia en el tramo final. Genera confianza en cada entrega." }
        },
        features: {
            title: "Simple. Potente.",
            subtitle: "Quitamos el desorden para que te enfoques en mover cosas.",
            mobile: { title: "App de Choferes", desc: "Experiencia nativa iOS y Android." },
            analytics: { title: "Datos en Tiempo Real", desc: "Métricas en vivo que importan." },
            workflow: {
                title: "Flujos a Medida",
                desc: "Define tus propios estados.",
                start: "Comienzo",
                process: "Procesamiento",
                transit: "En Transito",
                finish: "Entregado"
            }
        },
        cta: {
            title: "¿Listo para simplificar?",
            subtitle: "Únete a equipos flexibles que se mueven más rápido.",
            btn: "Comenzar"
        },
        landing: {
            driver_arrived: "Llegó el chofer",
            order: "Pedido",
            order_status: "Entregado"
        }
    },
    pt: {
        nav: {
            features: "Funcionalidades",
            adaptability: "Adaptabilidade",
            pricing: "Preços",
            login: "Entrar",
            get_started: "Começar"
        },
        hero: {
            badge: "Novo na 2.0: Flex-Routing",
            title: "Logística que <br><span class='highlight-text'>frui com você.</span>",
            subtitle: "Pare de lutar com software rígido. EnCaminar se ajusta aos seus fluxos. Simples, poderoso e adaptável.",
            cta_primary: "Teste Grátis",
            cta_secondary: "Veja como funciona →"
        },
        adapt: {
            title: "Uma Plataforma, Qualquer Modelo",
            subtitle: "De táxis autônomos a lojas de varejo, configure o EnCaminar para suas necessidades.",
            taxi: { title: "Rede de Táxis", desc: "Dê visibilidade em tempo real aos passageiros. Autônomos ou frotas." },
            retail: { title: "Varejo e Ferramentas", desc: "Pareça profissional. Envie links de rastreio com sua marca." },
            lastmile: { title: "Visibilidade Final", desc: "Garanta transparência na etapa final da logística. Gere confiança." }
        },
        features: {
            title: "Simples. Poderoso.",
            subtitle: "Removemos a bagunça para você focar no movimento.",
            workflow: {},
            mobile: { title: "App do Motorista", desc: "Experiência nativa iOS e Android." },
            analytics: { title: "Dados em Tempo Real", desc: "Métricas ao vivo que importam." },
            workflow: {
                title: "Fluxos Personalizados",
                desc: "Defina seus próprios status.",
                start: "Comienzo",
                process: "Procesamiento",
                transit: "En Transito",
                finish: "Entregado"
            }
        },
        cta: {
            title: "Pronto para simplificar?",
            subtitle: "Junte-se a equipes flexíveis que se movem mais rápido.",
            btn: "Começar"
        },
        landing: {
            driver_arrived: "Chofer llegó",
            order: "Pedido",
            order_status: "Entregado"
        }
    },
    // Added Portuguese translations for new sections
};

const changeLanguage = (lang) => {
    localStorage.setItem('lang', lang);

    // Update Active Button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update Text
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const keys = key.split('.');
        let text = translations[lang];
        keys.forEach(k => { if (text) text = text[k]; });

        if (text) el.innerHTML = text;
    });
};

// Initialize Language
const savedLang = localStorage.getItem('lang') || 'en';
changeLanguage(savedLang);

// --- Scroll Animations ---
const elementInView = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;
    return (elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend);
};

const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
        if (elementInView(el, 1.25)) el.classList.add("scrolled"), el.style.animation = 'fadeUp 0.8s ease-out forwards';
    });
};

window.addEventListener("scroll", handleScrollAnimation);
handleScrollAnimation();
