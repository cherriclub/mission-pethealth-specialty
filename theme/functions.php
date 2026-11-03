<?php
/**
 * Mission Specialty theme setup.
 *
 * The landing page is fully self-contained (inline CSS/JS), so this file only
 * keeps WordPress from injecting front-end assets the page doesn't use.
 */

defined( 'ABSPATH' ) || exit;

add_action( 'after_setup_theme', function () {
	add_theme_support( 'html5', array( 'script', 'style' ) );
} );

// Drop block-editor styles and emoji scripts on the front end; the page doesn't use them.
add_action( 'wp_enqueue_scripts', function () {
	wp_dequeue_style( 'wp-block-library' );
	wp_dequeue_style( 'wp-block-library-theme' );
	wp_dequeue_style( 'global-styles' );
	wp_dequeue_style( 'classic-theme-styles' );
}, 100 );

remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );
