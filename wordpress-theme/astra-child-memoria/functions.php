<?php
/**
 * Astra Child - Mapa de la Memoria
 * functions.php
 */

// Armar URL completa de foto a partir de nombre de archivo o ruta relativa
function memoria_get_foto_url($valor) {
    // Imagen por defecto si no tiene foto
    $upload_dir = wp_get_upload_dir();
    $base = set_url_scheme(trailingslashit($upload_dir['baseurl']), 'https');
    $default = $base . '2026/03/bandera-desaparecidos.jpg';

    if (empty($valor)) {
        return $default;
    }
    // Si ya es una URL completa, devolverla tal cual
    if (strpos($valor, 'http://') === 0 || strpos($valor, 'https://') === 0) {
        return $valor;
    }
    // Si no, anteponer la URL de uploads (forzando https)
    return $base . ltrim($valor, '/');
}

// Desactivar Gutenberg para el post type 'desaparecido' (usar editor clásico + ACF)
add_filter('use_block_editor_for_post_type', 'memoria_disable_gutenberg_desaparecido', 10, 2);
function memoria_disable_gutenberg_desaparecido($use, $post_type) {
    if ($post_type === 'desaparecido') {
        return false;
    }
    return $use;
}

// Encolar estilos del tema padre
add_action('wp_enqueue_scripts', 'astra_child_enqueue_styles');
function astra_child_enqueue_styles() {
    wp_enqueue_style('astra-parent-style', get_template_directory_uri() . '/style.css');
}

// Forzar layout full-width sin sidebar en la página del mapa
add_filter('astra_page_layout', 'memoria_force_fullwidth');
function memoria_force_fullwidth($layout) {
    if (is_page_template('page-mapa.php')) {
        return 'no-sidebar';
    }
    return $layout;
}

add_filter('astra_get_content_layout', 'memoria_force_content_fullwidth');
function memoria_force_content_fullwidth($layout) {
    if (is_page_template('page-mapa.php')) {
        return 'page-builder';
    }
    return $layout;
}

// Encolar Leaflet + estilos y scripts del mapa SOLO en la página del mapa
add_action('wp_enqueue_scripts', 'memoria_enqueue_mapa_assets');
function memoria_enqueue_mapa_assets() {
    if (is_page_template('page-mapa.php')) {
        // Leaflet CSS
        wp_enqueue_style('leaflet-css', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', array(), '1.9.4');
        
        // CSS original del mapa (styles.css del proyecto original)
        wp_enqueue_style('mapa-memoria-css', get_stylesheet_directory_uri() . '/assets/css/styles.css', array('leaflet-css'), '1.1.0');
        
        // Leaflet JS
        wp_enqueue_script('leaflet-js', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', array(), '1.9.4', true);
        
        // Script original del mapa
        wp_enqueue_script('mapa-memoria-js', get_stylesheet_directory_uri() . '/assets/js/script.js', array('leaflet-js'), '1.1.0', true);
        
        // Pasar los datos de desaparecidos al JS
        $datos_json = wp_json_encode(memoria_obtener_datos_desaparecidos());
        wp_add_inline_script('mapa-memoria-js', 'var datosMemoria = ' . $datos_json . ';', 'before');
    }
}

/**
 * Obtiene todos los desaparecidos desde WordPress y los devuelve como array
 */
function memoria_obtener_datos_desaparecidos() {
    $args = array(
        'post_type'      => 'desaparecido',
        'posts_per_page' => -1,
        'post_status'    => 'publish',
        'orderby'        => 'title',
        'order'          => 'ASC',
    );
    
    $query = new WP_Query($args);
    $datos = array();
    
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $post_id = get_the_ID();
            
            $datos[] = array(
                'lat'          => floatval(get_field('latitud', $post_id)),
                'lng'          => floatval(get_field('longitud', $post_id)),
                'nombre'       => get_the_title(),
                'apodo'        => get_field('apodo', $post_id) ?: 'Sin datos',
                'fecha'        => get_field('fecha_secuestro', $post_id) ?: 'Sin datos',
                'dni'          => get_field('dni', $post_id) ?: 'Sin datos',
                'nacionalidad' => get_field('nacionalidad', $post_id) ?: 'Sin datos',
                'lugar'        => get_field('lugar_secuestro', $post_id) ?: 'Sin datos',
                'profesion'    => get_field('profesion', $post_id) ?: 'Sin datos',
                'historia'     => get_field('historia', $post_id) ?: '',
                'imagen'       => memoria_get_foto_url(get_field('foto', $post_id)),
                'url'          => get_permalink($post_id),
            );
        }
        wp_reset_postdata();
    }
    
    return $datos;
}
