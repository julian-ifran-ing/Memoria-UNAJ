// Configuración inicial del mapa
const MAP_CONFIG = {
    // Coordenadas del centro del sur del conurbano bonaerense
    center: [-34.7208, -58.2619], // Entre Quilmes, Berazategui y Florencio Varela
    zoom: 11,
    minZoom: 9,
    maxZoom: 18
};

// Variable global para el mapa y marcadores
let map;
let marcadores = []; // Array para almacenar todos los marcadores
let añosSeleccionados = new Set(); // Set para almacenar años seleccionados

// Datos de lugares históricos de secuestro/desaparición con información detallada
// Nota: Estos son datos ficticios para fines educativos
const datosMemoria = [
    {
        lat: -34.7235,
        lng: -58.2567,
        nombre: "María Elena Rodríguez",
        fecha: "15 de marzo de 1977",
        direccion: "Av. Calchaquí 1234, Quilmes",
        descripcion: "Estudiante de psicología de 22 años, secuestrada en su domicilio familiar. Militante estudiantil universitaria.",
        edad: "22 años",
        ocupacion: "Estudiante de Psicología",
        biografia: "María Elena era una joven brillante, segunda hija de una familia de clase trabajadora en Quilmes. Destacada estudiante de psicología en la Universidad de La Plata, participaba activamente en el centro de estudiantes y en programas de alfabetización en barrios populares. Conocida por su solidaridad y compromiso social, soñaba con trabajar en psicología comunitaria para ayudar a niños en situación vulnerable.",
        testimonio: "'Era una chica muy estudiosa, siempre ayudando a otros. Esa noche vinieron a buscarla, se la llevaron en pijama. Nunca más supimos nada', recuerda su hermana menor, Rosa. 'Mamá murió esperando que volviera. Nosotros seguimos buscando respuestas después de tantos años.'",
        contexto: "El secuestro de María Elena se produjo en el marco de la represión sistemática contra estudiantes universitarios. Quilmes fue una zona particularmente afectada, con numerosos operativos clandestinos. Su caso forma parte de las 427 denuncias por desapariciones forzadas documentadas en la zona sur del conurbano.",
        url_detalle: "#maria-elena-rodriguez"
    },
    {
        lat: -34.7089,
        lng: -58.2043,
        nombre: "Carlos Alberto Fernández",
        fecha: "8 de junio de 1976",
        direccion: "Calle 14 N° 567, Berazategui",
        descripcion: "Obrero metalúrgico de 28 años, delegado sindical. Secuestrado en su lugar de trabajo por fuerzas militares.",
        edad: "28 años",
        ocupacion: "Obrero Metalúrgico",
        biografia: "Carlos trabajaba en una fábrica metalúrgica desde los 16 años. Casado con Elena y padre de dos niños pequeños, era respetado por sus compañeros por su honestidad y dedicación. Como delegado sindical, luchaba por mejores condiciones laborales y defendía los derechos de los trabajadores. Jugaba al fútbol los domingos en el club del barrio y enseñaba carpintería a jóvenes en su tiempo libre.",
        testimonio: "'Lo vinieron a buscar a la fábrica a plena luz del día. Los compañeros no pudieron hacer nada, había muchos hombres armados', cuenta su viuda Elena. 'Mis hijos crecieron preguntando por su papá. Yo les decía que estaba en un viaje muy largo, pero ellos ya sabían la verdad.'",
        contexto: "El operativo forma parte de la represión sistemática contra dirigentes sindicales en la zona industrial de Berazategui. Entre 1976 y 1977 desaparecieron al menos 15 trabajadores de fábricas del área, parte del plan para desarticular la organización obrera.",
        url_detalle: "#carlos-alberto-fernandez"
    },
    {
        lat: -34.7456,
        lng: -58.2789,
        nombre: "Ana Isabel Morales",
        fecha: "23 de octubre de 1978",
        direccion: "Monteagudo 890, Quilmes Oeste",
        descripcion: "Maestra de escuela primaria de 26 años. Participaba en actividades comunitarias del barrio.",
        edad: "26 años",
        ocupacion: "Maestra de Escuela Primaria",
        biografia: "Ana se había recibido de maestra con honores en el Instituto de Formación Docente de Quilmes. Trabajaba en la Escuela N° 45 del barrio, donde era querida por niños y padres. Organizaba festivales escolares y coordinaba un comedor comunitario. Amante de la literatura, leía cuentos a los niños y promovía la creación de una biblioteca popular.",
        testimonio: "'Era la maestra que todos hubiéramos querido tener', dice María, madre de uno de sus alumnos. 'Se quedaba después de hora para ayudar a los chicos que tenían dificultades. Cuando se la llevaron, los niños preguntaron por meses cuándo iba a volver la señorita Ana.'",
        contexto: "La desaparición de Ana se inscribe en la persecución de educadores comprometidos con la comunidad. Durante la dictadura, numerosos maestros fueron objeto de vigilancia y represión por sus actividades sociales, consideradas 'subversivas' por el régimen militar.",
        url_detalle: "#ana-isabel-morales"
    },
    {
        lat: -34.7891,
        lng: -58.2756,
        nombre: "Roberto Luis Díaz",
        fecha: "4 de enero de 1977",
        direccion: "Bernardo de Irigoyen 445, Florencio Varela",
        descripcion: "Empleado municipal de 31 años, padre de dos hijos. Miembro de comisión vecinal.",
        edad: "31 años",
        ocupacion: "Empleado Municipal",
        biografia: "Roberto trabajaba en el área de obras públicas del municipio desde hacía 8 años. Casado con Marta y padre de Claudia (7) y Martín (5), era un hombre comprometido con su comunidad. Participaba en la comisión vecinal gestionando mejoras para el barrio: cordón cuneta, alumbrado y transporte público. Los fines de semana organizaba torneos de fútbol para los jóvenes.",
        testimonio: "'Era un hombre bueno, siempre pensando en cómo mejorar el barrio para todos', recuerda su esposa Marta. 'Esa madrugada golpearon la puerta, se lo llevaron en ropa interior. Los chicos lloraron toda la noche. Claudia aún guarda la pelota de fútbol que él le había regalado.'",
        contexto: "Roberto fue víctima de la represión contra dirigentes comunitarios en Florencio Varela. Su caso ilustra cómo la dictadura militar persiguió a ciudadanos comprometidos con la participación democrática y el desarrollo social de sus barrios.",
        url_detalle: "#roberto-luis-diaz"
    },
    {
        lat: -34.7123,
        lng: -58.2334,
        nombre: "Silvia Beatriz Martín",
        fecha: "17 de septiembre de 1979",
        direccion: "Av. Mitre 1678, Berazategui Centro",
        descripcion: "Enfermera de 24 años que trabajaba en el hospital local. Secuestrada camino a su trabajo.",
        edad: "24 años",
        ocupacion: "Enfermera",
        biografia: "Silvia se había recibido de enfermera en el Hospital Italiano y trabajaba en el turno noche del Hospital de Berazategui. Vocacional y dedicada, era reconocida por su trato cálido con los pacientes. Vivía sola en un departamento pequeño y ayudaba económicamente a sus padres jubilados. Soñaba con especializarse en pediatría.",
        testimonio: "'Silvia amaba su trabajo, decía que cuidar enfermos era su misión', cuenta su colega Mercedes. 'Esa mañana no llegó al hospital. Encontraron su cartera tirada en la parada del colectivo. Los médicos y enfermeras hicimos una carta al diario pidiendo por su aparición, pero nunca la publicaron.'",
        contexto: "El secuestro de Silvia se produjo durante una de las últimas olas represivas del régimen. Su desaparición conmovió al personal de salud de la zona, evidenciando que ningún sector de la sociedad estuvo a salvo de la violencia estatal.",
        url_detalle: "#silvia-beatriz-martin"
    },
    {
        lat: -34.7345,
        lng: -58.2445,
        nombre: "Jorge Enrique López",
        fecha: "11 de abril de 1978",
        direccion: "Alsina 234, Bernal",
        descripcion: "Periodista de 29 años que trabajaba en medios locales. Investigaba casos de violaciones a derechos humanos.",
        edad: "29 años",
        ocupacion: "Periodista",
        biografia: "Jorge se había graduado en Ciencias de la Comunicación y trabajaba como cronista en el diario local 'El Riachuelo'. Especializado en temas sociales, había comenzado a investigar denuncias de desapariciones en la zona. Soltero, vivía con su madre viuda y tenía una extensa red de contactos en organizaciones barriales y sindicatos.",
        testimonio: "'Jorge no tenía miedo de contar la verdad', recuerda su editor, Luis Martínez. 'Había empezado a recibir amenazas por teléfono, pero seguía investigando. Sus notas sobre desaparecidos las tenía guardadas en casa de su madre. Después que se lo llevaron, vinieron a buscar esos papeles.'",
        contexto: "Jorge fue uno de los numerosos periodistas desaparecidos durante la dictadura. Su caso ilustra la persecución sistemática contra la prensa independiente y quienes intentaron documentar las violaciones a los derechos humanos durante el régimen militar.",
        url_detalle: "#jorge-enrique-lopez"
    },
    {
        lat: -34.7567,
        lng: -58.2123,
        nombre: "Patricia Carmen Ruiz",
        fecha: "28 de agosto de 1976",
        direccion: "9 de Julio 789, Ezpeleta",
        descripcion: "Estudiante de medicina de 21 años, hermana de un militante político desaparecido meses antes.",
        edad: "21 años",
        ocupacion: "Estudiante de Medicina",
        biografia: "Patricia cursaba el tercer año de medicina en la Universidad de La Plata. Hermana menor de Daniel, militante desaparecido en abril del mismo año, vivía con terror permanente tras la desaparición de su hermano. Era una estudiante ejemplar, ayudaba en un dispensario del barrio y soñaba con ser pediatra en hospitales públicos.",
        testimonio: "'Patricia cambió después que se llevaron a Daniel', recuerda su prima Elena. 'Tenía miedo, pero no quería dejar los estudios. Decía que tenía que recibirse por los dos. Cuando la secuestraron, mis tíos perdieron a sus dos hijos. Mi tía nunca se recuperó, murió de tristeza.'",
        contexto: "El caso de Patricia ilustra la práctica de perseguir a familias completas. La desaparición de hermanos, padres e hijos fue una estrategia del terrorismo de Estado para generar terror en la sociedad e impedir cualquier forma de solidaridad u organización.",
        url_detalle: "#patricia-carmen-ruiz"
    },
    {
        lat: -34.7678,
        lng: -58.2890,
        nombre: "Miguel Ángel Torres",
        fecha: "3 de diciembre de 1977",
        direccion: "San Martín 567, Florencio Varela",
        descripcion: "Comerciante de 35 años, conocido en el barrio por su solidaridad con familias necesitadas.",
        edad: "35 años",
        ocupacion: "Comerciante",
        biografia: "Miguel tenía un almacén en el barrio donde vivía desde la infancia. Casado con Carmen y padre de tres hijos, era conocido por fiar mercadería a familias con dificultades económicas. Organizaba colectas para familias necesitadas y había iniciado una cooperadora para construir una sala de primeros auxilios en el barrio.",
        testimonio: "'Don Miguel era el alma del barrio', dice Doña Rosa, vecina de toda la vida. 'Cuando alguien no tenía para comer, él le daba fiado sin preguntar cuándo iba a pagar. Ayudó a muchas familias. Cuando se lo llevaron, el barrio quedó como huérfano. Su esposa tuvo que cerrar el almacén y mudarse con los chicos.'",
        contexto: "La desaparición de Miguel demuestra cómo la represión alcanzó también a ciudadanos cuyo único 'delito' era la solidaridad social. El régimen militar consideró peligrosa cualquier forma de organización comunitaria, incluso las iniciativas benéficas y de ayuda mutua.",
        url_detalle: "#miguel-angel-torres"
    }
];

/**
 * Inicializa el mapa con la configuración especificada
 */
function inicializarMapa() {
    // Crear el mapa
    map = L.map('map', {
        center: MAP_CONFIG.center,
        zoom: MAP_CONFIG.zoom,
        minZoom: MAP_CONFIG.minZoom,
        maxZoom: MAP_CONFIG.maxZoom,
        zoomControl: false // Lo agregamos manualmente después
    });

    // Agregar controles de zoom en posición personalizada
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    // Agregar capa base con estilo suave (CartoDB Positron para un look más limpio)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    // Configurar el botón de reset de vista
    configurarControles();
}

/**
 * Extrae el año de una fecha en formato "dd de mes de yyyy"
 */
function extraerAño(fechaTexto) {
    const match = fechaTexto.match(/\d{4}/);
    return match ? parseInt(match[0]) : null;
}

/**
 * Obtiene todos los años únicos de los datos
 */
function obtenerAñosUnicos() {
    const años = datosMemoria.map(dato => extraerAño(dato.fecha))
                             .filter(año => año !== null)
                             .sort();
    return [...new Set(años)];
}

/**
 * Cuenta cuántos puntos hay por año
 */
function contarPuntosPorAño() {
    const conteo = {};
    datosMemoria.forEach(dato => {
        const año = extraerAño(dato.fecha);
        if (año) {
            conteo[año] = (conteo[año] || 0) + 1;
        }
    });
    return conteo;
}

/**
 * Genera los filtros de años en la interfaz
 */
function generarFiltrosAños() {
    const contenedor = document.getElementById('year-filters');
    const años = obtenerAñosUnicos();
    const conteoAños = contarPuntosPorAño();
    
    contenedor.innerHTML = '';
    
    años.forEach(año => {
        const filtroDiv = document.createElement('div');
        filtroDiv.className = 'year-filter active'; // Activos por defecto
        filtroDiv.dataset.year = año;
        
        filtroDiv.innerHTML = `
            <div class="year-filter-checkbox"></div>
            <span class="year-filter-label">${año}</span>
            <span class="year-filter-count">${conteoAños[año]}</span>
        `;
        
        filtroDiv.addEventListener('click', () => toggleAño(año));
        contenedor.appendChild(filtroDiv);
        
        // Agregar año a seleccionados por defecto
        añosSeleccionados.add(año);
    });
}

/**
 * Alterna la selección de un año
 */
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

/**
 * Actualiza la visibilidad de los marcadores según filtros
 */
function actualizarVisibilidadMarcadores() {
    marcadores.forEach((marcador, index) => {
        const dato = datosMemoria[index];
        const año = extraerAño(dato.fecha);
        
        if (añosSeleccionados.has(año)) {
            if (!map.hasLayer(marcador)) {
                map.addLayer(marcador);
            }
        } else {
            if (map.hasLayer(marcador)) {
                map.removeLayer(marcador);
            }
        }
    });
}

/**
 * Resetea todos los filtros
 */
function resetearFiltros() {
    const años = obtenerAñosUnicos();
    añosSeleccionados.clear();
    
    // Seleccionar todos los años
    años.forEach(año => añosSeleccionados.add(año));
    
    // Actualizar interfaz
    document.querySelectorAll('.year-filter').forEach(filtro => {
        filtro.classList.add('active');
    });
    
    actualizarVisibilidadMarcadores();
    actualizarContadores();
}
function crearIconoPersonalizado() {
    // Crear SVG personalizado con diseño más suave y moderno
    const svgIcon = `
        <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
                </filter>
            </defs>
            <circle cx="10" cy="10" r="8" fill="#d4b896" fill-opacity="0.9" stroke="#b8936d" stroke-width="1.5" filter="url(#shadow)"/>
            <circle cx="10" cy="10" r="4" fill="#b8936d" fill-opacity="0.8"/>
            <circle cx="10" cy="10" r="1.5" fill="#a0855b" fill-opacity="1"/>
        </svg>
    `;

    return L.divIcon({
        html: svgIcon,
        className: 'custom-marker-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
    });
}

/**
 * Genera el contenido HTML para un popup
 */
function generarContenidoPopup(datos) {
    return `
        <div class="popup-content">
            <div class="popup-title">${datos.nombre}</div>
            <div class="popup-date">${datos.fecha}</div>
            <div class="popup-address">${datos.direccion}</div>
            <div class="popup-description">${datos.descripcion}</div>
            <button onclick="abrirModalPorNombre('${datos.nombre}')" class="popup-link">Ver más</button>
        </div>
    `;
}

/**
 * Abre el modal por nombre de persona (helper para onclick)
 */
function abrirModalPorNombre(nombre) {
    const datos = datosMemoria.find(d => d.nombre === nombre);
    if (datos) {
        abrirModal(datos);
    }
}

/**
 * Agrega todos los marcadores al mapa
 */
function agregarMarcadores() {
    const icon = crearIconoPersonalizado();
    
    // Limpiar marcadores previos
    marcadores = [];
    
    datosMemoria.forEach((dato, index) => {
        // Crear marcador con ícono personalizado
        const marker = L.marker([dato.lat, dato.lng], { icon: icon });
        
        // Configurar popup
        const popupContent = generarContenidoPopup(dato);
        marker.bindPopup(popupContent, {
            maxWidth: 300,
            className: 'custom-popup'
        });
        
        // Agregar evento para logging
        marker.on('click', function(e) {
            console.log(`Marcador clickeado: ${dato.nombre}`);
        });
        
        // Almacenar marcador
        marcadores.push(marker);
        
        // Agregar al mapa (inicialmente todos visibles)
        marker.addTo(map);
    });
    
    // Generar filtros de años
    generarFiltrosAños();
    
    // Actualizar contadores
    actualizarContadores();
}

/**
 * Configura los controles personalizados del mapa
 */
function configurarControles() {
    const resetButton = document.getElementById('reset-view');
    const resetFiltersButton = document.getElementById('reset-filters');
    
    resetButton.addEventListener('click', function() {
        // Volver a la vista inicial
        map.setView(MAP_CONFIG.center, MAP_CONFIG.zoom);
        console.log('Vista reiniciada a posición inicial');
    });
    
    resetFiltersButton.addEventListener('click', resetearFiltros);
}

/**
 * Abre el modal con información detallada de una persona
 */
function abrirModal(datos) {
    const modal = document.getElementById('person-modal');
    
    // Llenar información básica
    document.getElementById('modal-name').textContent = datos.nombre;
    document.getElementById('modal-basic-info').textContent = `${datos.ocupacion} • ${datos.edad}`;
    document.getElementById('modal-age').textContent = datos.edad;
    document.getElementById('modal-occupation').textContent = datos.ocupacion;
    document.getElementById('modal-date').textContent = datos.fecha;
    document.getElementById('modal-address').textContent = datos.direccion;
    
    // Llenar secciones detalladas
    document.getElementById('modal-biography').textContent = datos.biografia;
    document.getElementById('modal-testimony').textContent = datos.testimonio;
    document.getElementById('modal-context').textContent = datos.contexto;
    
    // Mostrar modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    
    console.log(`Modal abierto para: ${datos.nombre}`);
}

/**
 * Cierra el modal
 */
function cerrarModal() {
    const modal = document.getElementById('person-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restaurar scroll del body
    console.log('Modal cerrado');
}

/**
 * Configura los eventos del modal
 */
function configurarModal() {
    const modal = document.getElementById('person-modal');
    const closeBtn = document.getElementById('modal-close');
    const closeFooterBtn = document.getElementById('modal-close-footer');
    
    // Cerrar con botones
    closeBtn.addEventListener('click', cerrarModal);
    closeFooterBtn.addEventListener('click', cerrarModal);
    
    // Cerrar al hacer click en el overlay
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            cerrarModal();
        }
    });
    
    // Cerrar con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            cerrarModal();
        }
    });
}
/**
 * Actualiza los contadores en la interfaz
 */
function actualizarContadores() {
    const totalElement = document.getElementById('total-points');
    const visibleElement = document.getElementById('visible-points');
    
    if (totalElement) {
        totalElement.textContent = datosMemoria.length;
    }
    
    if (visibleElement) {
        const visibles = marcadores.filter(marcador => map.hasLayer(marcador)).length;
        visibleElement.textContent = visibles;
    }
}

/**
 * Maneja errores de carga del mapa
 */
function manejarErroresMapa() {
    map.on('tileerror', function(error) {
        console.warn('Error al cargar tiles del mapa:', error);
    });
    
    map.on('locationerror', function(error) {
        console.warn('Error de geolocalización:', error);
    });
}

/**
 * Configura eventos adicionales del mapa
 */
function configurarEventos() {
    // Evento cuando el mapa termina de cargar
    map.whenReady(function() {
        console.log('Mapa cargado correctamente');
        
        // Agregar indicador visual de que el mapa está listo
        document.body.classList.add('map-loaded');
    });
    
    // Evento de cambio de zoom
    map.on('zoomend', function(e) {
        const currentZoom = map.getZoom();
        console.log(`Zoom actual: ${currentZoom}`);
        
        // Opcional: ajustar tamaño de íconos según zoom
        if (currentZoom < 12) {
            document.body.classList.add('zoom-out');
        } else {
            document.body.classList.remove('zoom-out');
        }
    });
    
    // Manejar errores
    manejarErroresMapa();
}

/**
 * Función principal de inicialización
 */
function inicializar() {
    try {
        // Verificar que Leaflet esté disponible
        if (typeof L === 'undefined') {
            throw new Error('Leaflet no está disponible');
        }
        
        // Inicializar mapa
        inicializarMapa();
        
        // Configurar eventos
        configurarEventos();
        
        // Configurar modal
        configurarModal();
        
        // Agregar marcadores después de un breve delay para asegurar que el mapa esté listo
        setTimeout(() => {
            agregarMarcadores();
        }, 100);
        
        console.log('Mapa de la memoria inicializado correctamente');
        
    } catch (error) {
        console.error('Error al inicializar el mapa:', error);
        
        // Mostrar mensaje de error al usuario
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f8f9fa; color: #666; text-align: center; padding: 20px;">
                    <div>
                        <h3>Error al cargar el mapa</h3>
                        <p>Por favor, verifica tu conexión a internet y recarga la página.</p>
                        <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #2c3e50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            Recargar página
                        </button>
                    </div>
                </div>
            `;
        }
    }
}

/**
 * Función para exportar datos (opcional para debugging)
 */
function exportarDatos() {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "lat,lng,nombre,fecha,direccion,descripcion,url_detalle\n"
        + datosMemoria.map(d => 
            `${d.lat},${d.lng},"${d.nombre}","${d.fecha}","${d.direccion}","${d.descripcion}","${d.url_detalle}"`
        ).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "datos_memoria.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializar);

// Opcional: hacer funciones disponibles globalmente para debugging
window.mapMemoria = {
    map: () => map,
    datos: datosMemoria,
    exportar: exportarDatos,
    reset: () => map.setView(MAP_CONFIG.center, MAP_CONFIG.zoom)
};