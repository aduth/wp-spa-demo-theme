<!DOCTYPE html>
<title></title>
<link rel="stylesheet" href="<?php printf( '%s/%s', get_template_directory_uri(), Asset_Utility::get_asset_revision( Asset_Utility::get_environment_asset( 'assets/css/main.css', 'assets/css/main.min.css' ), get_template_directory() . '/assets/rev-manifest.json' ) ); ?>">
<div id="app" class="container"></div>
<?php if ( ! empty( $bootstrap_data ) ): ?>
<script>window.bootstrap = <?php echo json_encode( $bootstrap_data ); ?>;</script>
<?php endif; ?>
<script src="<?php echo Asset_Utility::get_environment_asset( 'http://fb.me/react-0.11.1.js', 'http://fb.me/react-0.11.1.min.js' ); ?>"></script>
<script src="<?php printf( '%s/%s', get_template_directory_uri(), Asset_Utility::get_asset_revision( Asset_Utility::get_environment_asset(  'assets/js/bundle.js', 'assets/js/bundle.min.js' ), get_template_directory() . '/assets/rev-manifest.json' ) ); ?>"></script>