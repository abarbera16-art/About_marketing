const container = document.getElementById('speakers-container');

async function initApp() {
    try {
        // 1. Añadimos un "rompe-caché" para que siempre lea la última versión subida desde el panel
        const cacheBuster = "?t=" + new Date().getTime();
        
        // 2. Ruta a tu archivo JSON (ajustado con el cacheBuster)
        const response = await fetch('../Datos/speakers.json' + cacheBuster);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        container.innerHTML = ''; // Limpiamos el texto de "Cargando..."

        // Pintamos cada ponente del JSON
        data.forEach(ponente => {
            const card = createSpeakerCard(ponente);
            container.insertAdjacentHTML('beforeend', card);
        });

    } catch (error) {
        console.error("Error al cargar los ponentes:", error);
        container.innerHTML = `<h2 style="color: red; text-align: center; background: white; padding: 20px;">Error: No se encuentra el archivo JSON. Revisa la consola (F12).</h2>`;
    }
}

function createSpeakerCard(p) {
    // Protección anti-errores por si algún ponente no tiene etiquetas
    const etiquetas = p.etiquetas || [];
    const tagsHTML = etiquetas.map(t => `<li class="tag">${t}</li>`).join('');

    // 🚨 PROTECCIÓN ANTI-CRASH: Manejamos las redes sociales. 
    // Si el ponente viene del panel de admin (sin redes), evitamos que la web explote.
    const linkedin = (p.redes && p.redes.linkedin) ? p.redes.linkedin : '#';
    const instagram = (p.redes && p.redes.instagram) ? p.redes.instagram : '#';
    
    // Si no tiene el bloque de redes (porque lo creaste en el panel), ocultamos los botones de redes
    const mostrarRedes = p.redes ? 'block' : 'none';

    return `
        <article class="speaker-card">
            <div class="speaker-visual">
                <img src="${p.imagenFondo}" alt="${p.nombre}" class="aesthetic-img" loading="lazy" onerror="this.src='https://via.placeholder.com/300x400?text=Sin+Imagen'">
            </div>

            <div class="speaker-video">
                <div class="phone-mockup-container">
                    <video autoplay loop muted playsinline controls class="vertical-video mockup-video video-ponente">
                        <source src="${p.video}" type="video/mp4">
                    </video>
                    <img src="../Imagenes/depositphotos_166282680-stock-photo-new-modern-frameless-smartphone-mockup-removebg-preview.png" class="phone-frame" alt="Móvil">
                </div>
            </div>

            <div class="speaker-info">
                <h3 class="speaker-name">${p.nombre}</h3>
                <p class="speaker-role">${p.rol}</p>
                <ul class="speaker-tags">${tagsHTML}</ul>
                <p class="speaker-bio">${p.bio}</p>
                <div class="speaker-socials" style="display: ${mostrarRedes};">
                    <a href="${linkedin}" target="_blank" class="social-link">LinkedIn</a>
                    <a href="${instagram}" target="_blank" class="social-link">Instagram</a>
                </div>
            </div>
        </article>
    `;
}

initApp();
