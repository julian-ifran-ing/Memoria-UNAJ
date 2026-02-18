// Configuración inicial del mapa
const MAP_CONFIG = {
    center: [-34.7800, -58.2650],
    zoom: 12,
    minZoom: 9,
    maxZoom: 18
};

let map;
let marcadores = [];
let añosSeleccionados = new Set();

/**
 * Inicializa el mapa
 */
function inicializarMapa() {
    map = L.map('map', {
        center: MAP_CONFIG.center,
        zoom: MAP_CONFIG.zoom,
        minZoom: MAP_CONFIG.minZoom,
        maxZoom: MAP_CONFIG.maxZoom,
        zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    configurarControles();
}

/**
 * Extrae el año de la fecha (busca 4 dígitos seguidos)
 */
function extraerAño(fechaTexto) {
    const match = fechaTexto.match(/\d{4}/);
    return match ? parseInt(match[0]) : null;
}

function obtenerAñosUnicos() {
    const años = datosMemoria.map(d => extraerAño(d.fecha)).filter(a => a !== null).sort();
    return [...new Set(años)];
}

function contarPuntosPorAño() {
    const conteo = {};
    datosMemoria.forEach(d => {
        const año = extraerAño(d.fecha);
        if (año) conteo[año] = (conteo[año] || 0) + 1;
    });
    return conteo;
}

function generarFiltrosAños() {
    const contenedor = document.getElementById('year-filters');
    const años = obtenerAñosUnicos();
    const conteo = contarPuntosPorAño();
    contenedor.innerHTML = '';

    años.forEach(año => {
        const div = document.createElement('div');
        div.className = 'year-filter active';
        div.dataset.year = año;
        div.innerHTML = `
            <div class="year-filter-checkbox"></div>
            <span class="year-filter-label">${año}</span>
            <span class="year-filter-count">${conteo[año]}</span>
        `;
        div.addEventListener('click', () => toggleAño(año));
        contenedor.appendChild(div);
        añosSeleccionados.add(año);
    });
}

function toggleAño(año) {
    const filtro = document.querySelector(`[data-year="${año}"]`);
    if (añosSeleccionados.has(año)) {
        añosSeleccionados.delete(año);
        filtro.classList.remove('active');
    } else {
        añosSeleccionados.add(año);
        filtro.classList.add('active');
    }
    actualizarVisibilidadMarcadores();
    actualizarContadores();
}

function actualizarVisibilidadMarcadores() {
    marcadores.forEach((marcador, i) => {
        const año = extraerAño(datosMemoria[i].fecha);
        if (añosSeleccionados.has(año)) {
            if (!map.hasLayer(marcador)) map.addLayer(marcador);
        } else {
            if (map.hasLayer(marcador)) map.removeLayer(marcador);
        }
    });
}

function resetearFiltros() {
    obtenerAñosUnicos().forEach(año => añosSeleccionados.add(año));
    document.querySelectorAll('.year-filter').forEach(f => f.classList.add('active'));
    actualizarVisibilidadMarcadores();
    actualizarContadores();
}

function crearIconoPersonalizado() {
    const svg = `
        <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
                </filter>
            </defs>
            <circle cx="10" cy="10" r="8" fill="#d4b896" fill-opacity="0.9" stroke="#b8936d" stroke-width="1.5" filter="url(#shadow)"/>
            <circle cx="10" cy="10" r="4" fill="#b8936d" fill-opacity="0.8"/>
            <circle cx="10" cy="10" r="1.5" fill="#a0855b" fill-opacity="1"/>
        </svg>`;
    return L.divIcon({
        html: svg,
        className: 'custom-marker-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
    });
}

/**
 * Popup: muestra nombre, fecha y lugar
 */
function generarContenidoPopup(dato, index) {
    return `
        <div class="popup-content">
            <div class="popup-title">${dato.nombre}</div>
            <div class="popup-date">${dato.fecha}</div>
            <div class="popup-address">${dato.lugar}</div>
            <button onclick="abrirModalPorIndice(${index})" class="popup-link">Ver ficha completa</button>
        </div>
    `;
}

function abrirModalPorIndice(index) {
    const dato = datosMemoria[index];
    if (dato) abrirModal(dato);
}

function agregarMarcadores() {
    const icon = crearIconoPersonalizado();
    marcadores = [];

    datosMemoria.forEach((dato, index) => {
        const marker = L.marker([dato.lat, dato.lng], { icon: icon });
        marker.bindPopup(generarContenidoPopup(dato, index), {
            maxWidth: 300,
            className: 'custom-popup'
        });
        marcadores.push(marker);
        marker.addTo(map);
    });

    generarFiltrosAños();
    actualizarContadores();
}

function configurarControles() {
    document.getElementById('reset-view').addEventListener('click', function() {
        map.setView(MAP_CONFIG.center, MAP_CONFIG.zoom);
    });
    document.getElementById('reset-filters').addEventListener('click', resetearFiltros);
}

/**
 * Modal: muestra los datos reales de la ficha
 */
function abrirModal(dato) {
    const modal = document.getElementById('person-modal');

    document.getElementById('modal-name').textContent = dato.nombre;
    document.getElementById('modal-basic-info').textContent = dato.profesion;

    document.getElementById('modal-apodo').textContent = dato.apodo;
    document.getElementById('modal-dni').textContent = dato.dni;
    document.getElementById('modal-fecha').textContent = dato.fecha;
    document.getElementById('modal-nacionalidad').textContent = dato.nacionalidad || 'Sin datos';
    document.getElementById('modal-profesion').textContent = dato.profesion;

    document.getElementById('modal-lugar').textContent = dato.lugar;

    // Historia: solo mostrar si tiene contenido
    const historiaSection = document.getElementById('modal-historia-section');
    const historiaText = document.getElementById('modal-historia');
    if (dato.historia && dato.historia.trim() !== '') {
        historiaText.innerHTML = dato.historia.replace(/\n/g, '<br>');
        historiaSection.style.display = 'block';
    } else {
        historiaSection.style.display = 'none';
    }

    // Imagen: mostrar si tiene ruta, ocultar si no existe o falla la carga
    const foto = document.getElementById('modal-photo');
    if (dato.imagen && dato.imagen.trim() !== '') {
        foto.src = dato.imagen;
        foto.alt = dato.nombre;
        foto.style.display = 'block';
        foto.onerror = function() {
            this.style.display = 'none';
            this.src = '';
        };
    } else {
        foto.src = '';
        foto.style.display = 'none';
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function cerrarModal() {
    document.getElementById('person-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function configurarModal() {
    const modal = document.getElementById('person-modal');
    document.getElementById('modal-close').addEventListener('click', cerrarModal);
    document.getElementById('modal-close-footer').addEventListener('click', cerrarModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) cerrarModal();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) cerrarModal();
    });
}

function actualizarContadores() {
    const total = document.getElementById('total-points');
    const visible = document.getElementById('visible-points');
    if (total) total.textContent = datosMemoria.length;
    if (visible) visible.textContent = marcadores.filter(m => map.hasLayer(m)).length;
}

/**
 * Inicialización
 */
document.addEventListener('DOMContentLoaded', function() {
    try {
        if (typeof L === 'undefined') throw new Error('Leaflet no disponible');
        if (typeof datosMemoria === 'undefined') throw new Error('datos.js no cargado');

        inicializarMapa();
        configurarModal();
        agregarMarcadores();

    } catch (error) {
        console.error('Error:', error);
        const mapDiv = document.getElementById('map');
        if (mapDiv) {
            mapDiv.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#666;text-align:center;padding:20px;"><div><h3>Error al cargar el mapa</h3><p>Verificá tu conexión y recargá la página.</p></div></div>';
        }
    }
});
