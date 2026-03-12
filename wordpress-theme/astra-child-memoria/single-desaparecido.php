<?php
/**
 * Template para mostrar un desaparecido individual
 */

get_header(); ?>

<?php if (have_posts()) : the_post(); 
    $post_id = get_the_ID();
    $apodo        = get_field('apodo', $post_id) ?: '';
    $fecha        = get_field('fecha_secuestro', $post_id) ?: '';
    $dni          = get_field('dni', $post_id) ?: '';
    $nacionalidad = get_field('nacionalidad', $post_id) ?: '';
    $lugar        = get_field('lugar_secuestro', $post_id) ?: '';
    $profesion    = get_field('profesion', $post_id) ?: '';
    $historia     = get_field('historia', $post_id) ?: '';
    $foto_url     = memoria_get_foto_url(get_field('foto', $post_id));
    $nombre       = get_the_title();
?>

<style>
    /* Ocultar elementos de Astra innecesarios */
    .single-desaparecido .entry-header,
    .single-desaparecido .entry-meta,
    .single-desaparecido .post-navigation,
    .single-desaparecido .nav-links {
        display: none !important;
    }

    .perfil-desaparecido {
        max-width: 850px;
        margin: 0 auto;
        padding: 40px 20px;
        font-family: 'Georgia', 'Times New Roman', serif;
        color: #2d3748;
    }

    /* Encabezado del perfil */
    .perfil-header {
        text-align: center;
        margin-bottom: 40px;
    }

    .perfil-foto {
        width: 180px;
        height: 180px;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid #d4b896;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
        margin-bottom: 20px;
    }

    .perfil-nombre {
        font-size: 2rem;
        font-weight: 400;
        color: #2d3748;
        margin: 0 0 8px;
        letter-spacing: 1px;
    }

    .perfil-profesion {
        font-size: 1.1rem;
        color: #718096;
        font-style: italic;
        margin: 0;
    }

    /* Datos personales */
    .perfil-section {
        background: white;
        border-radius: 12px;
        padding: 30px;
        margin-bottom: 25px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        border: 1px solid #e2e8f0;
    }

    .perfil-section h3 {
        font-size: 1.15rem;
        font-weight: 600;
        color: #4a5568;
        margin: 0 0 20px;
        padding-bottom: 10px;
        border-bottom: 2px solid #d4b896;
    }

    .perfil-datos-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 18px;
    }

    .perfil-dato {
        background: #f7fafc;
        border-radius: 8px;
        padding: 14px 18px;
        border-left: 3px solid #d4b896;
    }

    .perfil-dato-label {
        display: block;
        font-size: 0.8rem;
        font-weight: 700;
        color: #4a5568;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 4px;
    }

    .perfil-dato-value {
        display: block;
        font-size: 1rem;
        color: #2d3748;
    }

    /* Historia */
    .perfil-historia p {
        line-height: 1.8;
        font-size: 1.05rem;
        color: #4a5568;
        margin: 0;
    }

    /* Botón volver */
    .perfil-volver {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 22px;
        background: #4a5568;
        color: white;
        text-decoration: none;
        border-radius: 6px;
        font-size: 0.95rem;
        transition: background 0.3s ease;
        margin-top: 10px;
    }

    .perfil-volver:hover {
        background: #718096;
        color: white;
        text-decoration: none;
    }

    /* Sin foto */
    .perfil-sin-foto {
        width: 180px;
        height: 180px;
        border-radius: 50%;
        background: #e2e8f0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 3.5rem;
        color: #a0aec0;
        margin-bottom: 20px;
        border: 4px solid #d4b896;
    }

    /* Contenido del editor de WordPress */
    .perfil-wp-content p {
        line-height: 1.8;
        font-size: 1.05rem;
        color: #4a5568;
        margin-bottom: 15px;
    }
    .perfil-wp-content img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        margin: 15px 0;
    }
    .perfil-wp-content iframe,
    .perfil-wp-content .wp-block-embed__wrapper {
        max-width: 100%;
        margin: 15px 0;
    }
    .perfil-wp-content h2,
    .perfil-wp-content h3,
    .perfil-wp-content h4 {
        color: #2d3748;
        margin: 20px 0 10px;
    }
    .perfil-wp-content ul,
    .perfil-wp-content ol {
        padding-left: 25px;
        margin-bottom: 15px;
        color: #4a5568;
    }
    .perfil-wp-content figure {
        margin: 15px 0;
    }
    .perfil-wp-content figcaption {
        font-size: 0.85rem;
        color: #718096;
        font-style: italic;
        text-align: center;
    }

    /* Responsive */
    @media (max-width: 600px) {
        .perfil-datos-grid {
            grid-template-columns: 1fr;
        }
        .perfil-nombre {
            font-size: 1.5rem;
        }
    }
</style>

<div class="perfil-desaparecido">

    <!-- Encabezado -->
    <div class="perfil-header">
        <img src="<?php echo esc_url($foto_url); ?>" alt="<?php echo esc_attr($nombre); ?>" class="perfil-foto">
        <h1 class="perfil-nombre"><?php echo esc_html($nombre); ?></h1>
        <?php if ($profesion && $profesion !== 'Sin datos') : ?>
            <p class="perfil-profesion"><?php echo esc_html($profesion); ?></p>
        <?php endif; ?>
    </div>

    <!-- Datos personales -->
    <div class="perfil-section">
        <h3>Datos del detenido/desaparecido</h3>
        <div class="perfil-datos-grid">
            <?php if ($apodo && $apodo !== 'Sin datos') : ?>
            <div class="perfil-dato">
                <span class="perfil-dato-label">Apodo</span>
                <span class="perfil-dato-value"><?php echo esc_html($apodo); ?></span>
            </div>
            <?php endif; ?>

            <?php if ($dni && $dni !== 'Sin datos') : ?>
            <div class="perfil-dato">
                <span class="perfil-dato-label">DNI</span>
                <span class="perfil-dato-value"><?php echo esc_html($dni); ?></span>
            </div>
            <?php endif; ?>

            <?php if ($fecha && $fecha !== 'Sin datos') : ?>
            <div class="perfil-dato">
                <span class="perfil-dato-label">Fecha de secuestro</span>
                <span class="perfil-dato-value"><?php echo esc_html($fecha); ?></span>
            </div>
            <?php endif; ?>

            <?php if ($nacionalidad && $nacionalidad !== 'Sin datos') : ?>
            <div class="perfil-dato">
                <span class="perfil-dato-label">Nacionalidad</span>
                <span class="perfil-dato-value"><?php echo esc_html($nacionalidad); ?></span>
            </div>
            <?php endif; ?>

            <?php if ($profesion && $profesion !== 'Sin datos') : ?>
            <div class="perfil-dato">
                <span class="perfil-dato-label">Profesión</span>
                <span class="perfil-dato-value"><?php echo esc_html($profesion); ?></span>
            </div>
            <?php endif; ?>
        </div>
    </div>

    <!-- Lugar de secuestro -->
    <?php if ($lugar && $lugar !== 'Sin datos') : ?>
    <div class="perfil-section">
        <h3>Lugar / Zona de secuestro</h3>
        <p style="margin:0; font-size:1.05rem; color:#4a5568;"><?php echo esc_html($lugar); ?></p>
    </div>
    <?php endif; ?>

    <!-- Historia -->
    <?php if ($historia) : ?>
    <div class="perfil-section perfil-historia">
        <h3>Su historia</h3>
        <p><?php echo nl2br(esc_html($historia)); ?></p>
    </div>
    <?php endif; ?>

    <!-- Contenido adicional del editor de WordPress -->
    <?php 
    $contenido = get_the_content();
    if ($contenido && trim($contenido) !== '') : ?>
    <div class="perfil-section perfil-contenido-extra">
        <h3>Más información</h3>
        <div class="perfil-wp-content">
            <?php the_content(); ?>
        </div>
    </div>
    <?php endif; ?>

    <!-- Volver al mapa -->
    <a href="<?php echo esc_url(get_permalink(get_page_by_path('mapa-de-la-memoria'))); ?>" class="perfil-volver">
        ← Volver al mapa
    </a>

</div>

<?php endif; ?>

<?php get_footer(); ?>
