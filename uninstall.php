<?php
/**
 * Remove the scanner's stored data: the Plugins-screen badge summary, scan job
 * transients and any per-job scan locks left behind by an interrupted request.
 */

if ( ! defined( 'ABSPATH' ) || ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

/**
 * Delete the scanner's options and transients on the current site.
 *
 * @return void
 */
function brightleaf_digital_php_checker_uninstall_site() {
	global $wpdb;

	delete_option( 'brightleaf_digital_php_checker_last_scan_results' );

	$like  = $wpdb->esc_like( 'brightleaf_digital_php_checker_job_' ) . '%';
	$names = $wpdb->get_col( // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- One-time uninstall cleanup of this plugin's own rows.
		$wpdb->prepare(
			"SELECT option_name FROM $wpdb->options WHERE option_name LIKE %s OR option_name LIKE %s OR option_name LIKE %s",
			$like,
			$wpdb->esc_like( '_transient_brightleaf_digital_php_checker_job_' ) . '%',
			$wpdb->esc_like( '_transient_timeout_brightleaf_digital_php_checker_job_' ) . '%'
		)
	);
	foreach ( $names as $name ) {
		delete_option( $name );
	}
}

if ( is_multisite() ) {
	foreach ( get_sites(
		[
			'fields' => 'ids',
			'number' => 0,
		]
	) as $brightleaf_digital_php_checker_blog_id ) {
		switch_to_blog( $brightleaf_digital_php_checker_blog_id );
		brightleaf_digital_php_checker_uninstall_site();
		restore_current_blog();
	}
} else {
	brightleaf_digital_php_checker_uninstall_site();
}
