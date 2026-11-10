<?php
/**
 * Prune development-only files from vendor/ after Composer installs or updates.
 *
 * The scanner ships the full PHPCS / PHPCompatibility / WPCS stack, whose tests,
 * docs, examples and CLI binaries are large and never used at runtime. The shared
 * release workflow only removes shell scripts, so the pruning lives here and runs
 * on every install. Symlinks are never followed or deleted through, so the local
 * path-repository link to gravityops/core is left untouched, and Composer's own
 * metadata and the Strauss-prefixed copy are skipped entirely.
 *
 * Run by Composer (post-install-cmd / post-update-cmd); not shipped in the plugin.
 */

if ( 'cli' !== PHP_SAPI ) {
	exit( 1 );
}

$vendor = dirname( __DIR__ ) . '/vendor';
if ( ! is_dir( $vendor ) || is_link( $vendor ) ) {
	exit( 0 );
}

// Top-level vendor entries that are never pruned.
$skip_vendors = [ 'composer', 'gravityops', 'GOPCS', 'autoload.php' ];
// Directory names removed wherever they appear inside a pruned package.
$prune_dirs = [ 'tests', 'Tests', 'docs', 'Docs', 'examples', 'example', 'bin', '.github', '.git' ];
// File names (exact or by suffix) removed inside a pruned package.
$prune_files    = [ '.gitattributes', '.gitignore', '.editorconfig', 'phpunit.xml', 'phpunit.xml.dist' ];
$prune_suffixes = [ '.sh', '.bat', '.cmd', '.ps1' ];

/**
 * Delete a directory tree without following symlinks.
 *
 * @param string $path Directory to remove.
 * @return void
 */
function gopcs_cleanup_remove_tree( $path ) {
	if ( is_link( $path ) || ! is_dir( $path ) ) {
		@unlink( $path ); // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged, WordPress.WP.AlternativeFunctions.unlink_unlink -- Composer-time CLI cleanup; WordPress is not loaded.
		return;
	}
	foreach ( scandir( $path ) as $entry ) {
		if ( '.' === $entry || '..' === $entry ) {
			continue;
		}
		gopcs_cleanup_remove_tree( $path . '/' . $entry );
	}
	@rmdir( $path ); // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged, WordPress.WP.AlternativeFunctions.file_system_operations_rmdir -- Composer-time CLI cleanup; WordPress is not loaded.
}

/**
 * Walk one package directory, pruning matching entries; never descends into links.
 *
 * @param string $path Directory to walk.
 * @return void
 */
function gopcs_cleanup_walk( $path ) {
	global $prune_dirs, $prune_files, $prune_suffixes;
	foreach ( scandir( $path ) as $entry ) {
		if ( '.' === $entry || '..' === $entry ) {
			continue;
		}
		$full = $path . '/' . $entry;
		if ( is_link( $full ) ) {
			continue;
		}
		if ( is_dir( $full ) ) {
			if ( in_array( $entry, $prune_dirs, true ) ) {
				gopcs_cleanup_remove_tree( $full );
			} else {
				gopcs_cleanup_walk( $full );
			}
			continue;
		}
		$matches_suffix = false;
		foreach ( $prune_suffixes as $suffix ) {
			if ( substr( $entry, -strlen( $suffix ) ) === $suffix ) {
				$matches_suffix = true;
				break;
			}
		}
		if ( $matches_suffix || in_array( $entry, $prune_files, true ) ) {
			@unlink( $full ); // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged, WordPress.WP.AlternativeFunctions.unlink_unlink -- Composer-time CLI cleanup; WordPress is not loaded.
		}
	}
}

foreach ( scandir( $vendor ) as $entry ) {
	if ( '.' === $entry || '..' === $entry || in_array( $entry, $skip_vendors, true ) ) {
		continue;
	}
	$full = $vendor . '/' . $entry;
	if ( is_link( $full ) ) {
		continue;
	}
	if ( 'bin' === $entry ) {
		gopcs_cleanup_remove_tree( $full );
		continue;
	}
	if ( is_dir( $full ) ) {
		gopcs_cleanup_walk( $full );
	}
}
