<?php

class WP_SPA {

    protected $bootstrap_routes = array();

    protected $ignored_paths = array();

    protected $entry_point;

    protected $termination_action = 'template_redirect';

    function __construct( $entry_point = null ) {
        if ( is_null( $entry_point ) && ! isset( $this->entry_point ) ) {
            $this->entry_point = get_template_directory() . '/index.php';
        } else {
            $this->entry_point = $entry_point;
        }

        add_action( $this->termination_action, array( $this, 'maybe_exit_early' ) );
    }

    function maybe_exit_early() {
        if (
            ! is_admin() &&
            ! in_array( $GLOBALS['pagenow'], array( 'wp-login.php', 'wp-register.php' ) ) &&
            ! $this->is_ignored_path()
        ) {
            $bootstrap_data = $this->get_bootstrap_data();
            include $this->entry_point;
            exit;
        }
    }

    function is_ignored_path() {
        foreach( $this->ignored_paths as $path_pattern ) {
            if ( preg_match( $path_pattern, $_SERVER['REQUEST_URI'] ) ) {
                return true;
            }
        }

        return false;
    }

    function get_bootstrap_data() {
        $bootstrap_data = array();

        foreach( $this->bootstrap_routes as $path_pattern => $handler ) {
            if ( preg_match_all( $path_pattern, $_SERVER['REQUEST_URI'], $path_matches ) ) {
                $path_args = count( $path_matches ) > 1 ? $path_matches[1] : array();
                $handled_data = call_user_func_array( $handler, $path_args );

                if ( is_null( $handled_data ) ) {
                    $handled_data = array();
                }

                $bootstrap_data = array_merge( $bootstrap_data, $handled_data );
            }
        }

        return $bootstrap_data;
    }

}