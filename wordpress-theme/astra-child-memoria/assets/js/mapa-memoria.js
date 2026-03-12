/**
 * Mapa de la Memoria - Script principal para WordPress
 * Los datos se reciben via wp_localize_script como variable global "datosMemoria"
 */

(function() {
    'use strict';

    const MAP_CONFIG = {
        center: [-34.7800, -58.2650],
        zoom: 12,
        minZoom: 9,
        maxZoom: 18
    };

    let map;
    let marcadores = [];
    let añosSeleccionados = new Set();

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
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);

        configurarControles();
    }

    function extraerAño(fechaTexto) {
        if (!fechaTexto) return null;
        var match = fechaTexto.match(/\d{4}/);
        return match ? parseInt(match[0]) : null;
    }

    function obtenerAñosUnicos() {
        var años = datosMemoria.map(function(d) { return extraerAño(d.fecha); })
            .filter(function(a) { return a !== null; })
            .sort();
        return años.filter(function(v, i, a) { return a.indexOf(v) === i; });
    }

    function contarPuntosPorAño() {
        var conteo = {};
        datosMemoria.forEach(function(d) {
            var año = extraerAño(d.fecha);
            if (año) conteo[año] = (conteo[año] || 0) + 1;
        });
        return conteo;
    }

    function generarFiltrosAños() {
        var contenedor = document.getElementById('year-filters');
        if (!contenedor) return;
        var años = obtenerAñosUnicos();
        var conteo = contarPuntosPorAño();
        contenedor.innerHTML = '';

        años.forEach(function(año) {
            var div = document.createElement('div');
            div.className = 'memoria-year-filter active';
            div.dataset.year = año;
            div.innerHTML =
                '<div class="memoria-year-filter-checkbox"></div>' +
                '<span class="memoria-year-filter-label">' + año + '</span>' +
                '<span class="memoria-year-filter-count">' + conteo[año] + '</span>';
            div.addEventListener('click', function() { toggleAño(año); });
            contenedor.appendChild(div);
            añosSeleccionados.add(año);
        });
    }

    function toggleAño(año) {
        var filtro = document.querySelector('[data-year="' + año + '"]');
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
        marcadores.forEach(function(marcador, i) {
            var año = extraerAño(datosMemoria[i].fecha);
            if (añosSeleccionados.has(año)) {
                if (!map.hasLayer(marcador)) map.addLayer(marcador);
            } else {
                if (map.hasLayer(marcador)) map.removeLayer(marcador);
            }
        });
    }

    function resetearFiltros() {
        obtenerAñosUnicos().forEach(function(año) { añosSeleccionados.add(año); });
        document.querySelectorAll('.memoria-year-filter').forEach(function(f) { f.classList.add('active'); });
        actualizarVisibilidadMarcadores();
        actualizarContadores();
    }

    function crearIconoPersonalizado() {
        var svg =
            '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">' +
            '<defs><filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">' +
            '<feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/></filter></defs>' +
            '<circle cx="10" cy="10" r="8" fill="#d4b896" fill-opacity="0.9" stroke="#b8936d" stroke-width="1.5" filter="url(#shadow)"/>' +
            '<circle cx="10" cy="10" r="4" fill="#b8936d" fill-opacity="0.8"/>' +
            '<circle cx="10" cy="10" r="1.5" fill="#a0855b" fill-opacity="1"/></svg>';
        return L.divIcon({
            html: svg,
            className: 'custom-marker-icon',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            popupAnchor: [0, -10]
        });
    }

    function generarContenidoPopup(dato, index) {
        return '<div class="memoria-popup-content">' +
            '<div class="memoria-popup-title">' + dato.nombre + '</div>' +
            '<div class="memoria-popup-date">' + dato.fecha + '</div>' +
            '<div class="memoria-popup-address">' + dato.lugar + '</div>' +
            '<button onclick="memoriaAbrirModal(' + index + ')" class="memoria-popup-link">Ver ficha completa</button>' +
            '</div>';
    }

    function agregarMarcadores() {
        var icon = crearIconoPersonalizado();
        marcadores = [];

        datosMemoria.forEach(function(dato, index) {
            var marker = L.marker([dato.lat, dato.lng], { icon: icon });
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
        var resetView = document.getElementById('reset-view');
        if (resetView) {
            resetView.addEventListener('click', function() {
                map.setView(MAP_CONFIG.center, MAP_CONFIG.zoom);
            });
        }
        var resetFilters = document.getElementById('reset-filters');
        if (resetFilters) {
            resetFilters.addEventListener('click', resetearFiltros);
        }
    }

    function abrirModal(dato) {
        var modal = document.getElementById('person-modal');
        if (!modal) return;

        document.getElementById('modal-name').textContent = dato.nombre;
        document.getElementById('modal-basic-info').textContent = dato.profesion;
        document.getElementById('modal-apodo').textContent = dato.apodo;
        document.getElementById('modal-dni').textContent = dato.dni;
        document.getElementById('modal-fecha').textContent = dato.fecha;
        document.getElementById('modal-nacionalidad').textContent = dato.nacionalidad || 'Sin datos';
        document.getElementById('modal-profesion').textContent = dato.profesion;
        document.getElementById('modal-lugar').textContent = dato.lugar;

        var historiaSection = document.getElementById('modal-historia-section');
        var historiaText = document.getElementById('modal-historia');
        if (dato.historia && dato.historia.trim() !== '') {
            historiaText.innerHTML = dato.historia.replace(/\n/g, '<br>');
            historiaSection.style.display = 'block';
        } else {
            historiaSection.style.display = 'none';
        }

        var foto = document.getElementById('modal-photo');
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
        var modal = document.getElementById('person-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    function configurarModal() {
        var modal = document.getElementById('person-modal');
        if (!modal) return;

        var closeBtn = document.getElementById('modal-close');
        if (closeBtn) closeBtn.addEventListener('click', cerrarModal);

        var closeFooter = document.getElementById('modal-close-footer');
        if (closeFooter) closeFooter.addEventListener('click', cerrarModal);

        modal.addEventListener('click', function(e) {
            if (e.target === modal) cerrarModal();
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) cerrarModal();
        });
    }

    function actualizarContadores() {
        var total = document.getElementById('total-points');
        var visible = document.getElementById('visible-points');
        if (total) total.textContent = datosMemoria.length;
        if (visible) visible.textContent = marcadores.filter(function(m) { return map.hasLayer(m); }).length;
    }

    // Función global para que los popups puedan llamarla
    window.memoriaAbrirModal = function(index) {
        var dato = datosMemoria[index];
        if (dato) abrirModal(dato);
    };

    // Inicialización
    document.addEventListener('DOMContentLoaded', function() {
        // Verificar que exista el contenedor del mapa
        if (!document.getElementById('map')) return;

        try {
            if (typeof L === 'undefined') throw new Error('Leaflet no disponible');
            // Si datosMemoria no existe, inicializar como array vacío
            if (typeof datosMemoria === 'undefined') {
                window.datosMemoria = [];
            }

            inicializarMapa();
            configurarModal();
            if (datosMemoria.length) {
                agregarMarcadores();
            }
            actualizarContadores();

            // Forzar recálculo del tamaño del mapa (necesario cuando Astra modifica layout)
            setTimeout(function() {
                map.invalidateSize();
            }, 300);

        } catch (error) {
            console.error('Mapa de la Memoria - Error:', error);
            var mapDiv = document.getElementById('map');
            if (mapDiv) {
                mapDiv.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#666;text-align:center;padding:20px;">' +
                    '<div><h3>Error al cargar el mapa</h3><p>Verificá tu conexión y recargá la página.</p></div></div>';
            }
        }
    });

})();
