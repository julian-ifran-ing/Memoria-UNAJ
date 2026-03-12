<?php
/**
 * Template Name: Mapa de la Memoria
 * 
 * Usa header/footer de Astra + contenido fullwidth del mapa
 */

get_header(); ?>

<style>
    /* Toda la cadena de contenedores de Astra debe ocupar 100% */
    .page-template-page-mapa #page {
        display: flex !important;
        flex-direction: column !important;
        min-height: 100vh !important;
    }
    .page-template-page-mapa #content {
        flex: 1 !important;
        display: flex !important;
        flex-direction: column !important;
        padding: 0 !important;
        margin: 0 !important;
    }
    .page-template-page-mapa .ast-container {
        flex: 1 !important;
        display: flex !important;
        flex-direction: column !important;
        width: 100% !important;
        max-width: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
    }
    .page-template-page-mapa #primary {
        flex: 1 !important;
        display: flex !important;
        flex-direction: column !important;
        width: 100% !important;
        max-width: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
    }
    .page-template-page-mapa main.site-main {
        flex: 1 !important;
        display: flex !important;
        flex-direction: column !important;
        padding: 0 !important;
        margin: 0 !important;
    }
    .page-template-page-mapa article {
        flex: 1 !important;
        display: flex !important;
        flex-direction: column !important;
        width: 100% !important;
        max-width: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
        float: none !important;
    }
    .page-template-page-mapa .entry-content {
        flex: 1 !important;
        display: flex !important;
        flex-direction: column !important;
        width: 100% !important;
        max-width: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
    }
    .page-template-page-mapa .ast-row {
        flex: 1 !important;
        display: flex !important;
        flex-direction: column !important;
        width: 100% !important;
        max-width: 100% !important;
    }

    /* El contenedor del mapa ocupa todo el espacio restante */
    .page-template-page-mapa .main-container {
        flex: 1 !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        display: flex !important;
        overflow: hidden !important;
    }
    .page-template-page-mapa .info-panel {
        flex: 0 0 240px !important;
        overflow-y: auto !important;
    }
    .page-template-page-mapa .map-container {
        flex: 1 1 auto !important;
        position: relative !important;
        height: unset !important;
    }
    .page-template-page-mapa #map {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        height: auto !important;
    }

    /* Ocultar elementos innecesarios */
    .page-template-page-mapa .entry-header,
    .page-template-page-mapa .page-header,
    .page-template-page-mapa .ast-breadcrumbs-wrapper {
        display: none !important;
    }
    /* Ajustar alto del mapa restando header custom */
    .page-template-page-mapa .main-container {
        flex: 1 !important;
    }
</style>

    <!-- Encabezado personalizado -->
    <header class="header">
        <div class="container">
            <h1 class="title">Mapa de la Memoria</h1>
            <p class="subtitle">Lugares de secuestro y desaparición durante la última dictadura militar (1976-1983)</p>
            <p class="location">Florencio Varela, Berazategui y Quilmes</p>
        </div>
    </header>

    <!-- Contenedor principal -->
    <main class="main-container">
        <!-- Panel de información -->
        <aside class="info-panel">
            <div class="panel-content">
                <!-- Filtro por años -->
                <div class="filter-section">
                    <h3>Filtrar por año</h3>
                    <div id="year-filters" class="year-filters"></div>
                    <button id="reset-filters" class="reset-btn">Mostrar todos</button>
                </div>
                
                <div class="stats">
                    <div class="stat-item">
                        <span class="stat-number" id="total-points">0</span>
                        <span class="stat-label">Lugares marcados</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number" id="visible-points">0</span>
                        <span class="stat-label">Actualmente visibles</span>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Contenedor del mapa -->
        <div class="map-container">
            <div id="map"></div>
            <div class="map-controls">
                <button id="reset-view" class="control-btn" title="Volver a la vista inicial">
                    ⌂ Vista inicial
                </button>
            </div>
        </div>
    </main>

    <!-- Galería con buscador -->
    <section class="gallery-section">
        <div class="container">
            <h2 class="gallery-title">Presentes... Ahora y siempre</h2>
            <div class="search-container">
                <input type="text" id="search-name" class="search-input" placeholder="Buscar por nombre..." autocomplete="off">
            </div>
            <div id="gallery-grid" class="gallery-grid">
                <!-- Cards generadas dinámicamente -->
            </div>
            <div class="gallery-pagination">
                <button id="gallery-prev" class="btn-page" title="Anterior">&larr;</button>
                <span id="gallery-page-info" class="page-info"></span>
                <button id="gallery-next" class="btn-page" title="Siguiente">&rarr;</button>
            </div>
            <p id="gallery-no-results" class="gallery-no-results" style="display:none;">No se encontraron resultados.</p>
        </div>
    </section>

    <!-- Modal -->
    <div id="person-modal" class="modal-overlay">
        <div class="modal-container">
            <div class="modal-header">
                <button class="modal-close" id="modal-close">&times;</button>
                <img id="modal-photo" class="modal-photo" src="" alt="" style="display: none;">
                <div class="modal-header-content">
                    <div class="modal-title-section">
                        <h2 id="modal-name" class="modal-name"></h2>
                        <p id="modal-basic-info" class="modal-basic-info"></p>
                    </div>
                </div>
            </div>
            <div class="modal-body">
                <div class="modal-section">
                    <h3><i class="icon-person"></i> Datos del detenido/desaparecido</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Apodo:</span>
                            <span id="modal-apodo" class="info-value"></span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">DNI:</span>
                            <span id="modal-dni" class="info-value"></span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Fecha de secuestro:</span>
                            <span id="modal-fecha" class="info-value"></span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Nacionalidad:</span>
                            <span id="modal-nacionalidad" class="info-value"></span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Profesión:</span>
                            <span id="modal-profesion" class="info-value"></span>
                        </div>
                    </div>
                </div>
                <div class="modal-section">
                    <h3><i class="icon-info"></i> Lugar / Zona de secuestro</h3>
                    <p id="modal-lugar" class="modal-text"></p>
                </div>
                <div class="modal-section" id="modal-historia-section">
                    <h3><i class="icon-heart"></i> Su historia</h3>
                    <p id="modal-historia" class="modal-text"></p>
                </div>
            </div>
            <div class="modal-footer">
                <div class="modal-actions">
                    <button class="btn-secondary" id="modal-close-footer">Cerrar</button>
                    <a href="#" class="btn-primary" id="modal-link-profile" target="_blank" rel="noopener">Ver perfil completo</a>
                </div>
            </div>
        </div>
    </div>

    <?php get_footer(); ?>
