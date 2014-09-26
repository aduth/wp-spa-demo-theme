<?php

require dirname( __FILE__ ) . '/class-wp-spa.php';
require dirname( __FILE__ ) . '/class-tgm-plugin-activation.php';

class Demo_SPA extends WP_SPA {

    protected $ignored_paths = array( '/^\/wp-json\//' );

    protected $bootstrap_routes = array(
        '/^\/?$/'               => array( __CLASS__ , 'bootstrap_latest_posts' ),
        '/^\/posts\/(\d+)\/?$/' => array( __CLASS__ , 'bootstrap_single_post' )
    );

    function __construct() {
        parent::__construct();

        if ( is_admin() ) {
            $this->register_required_plugins();
        } else if ( ! class_exists( 'WP_JSON_Posts' ) ) {
            printf(
                wp_kses( __( 'You must install the JSON REST API plugin from <a href="%s">your ' .
                    'site\'s dashboard</a>.' ), array( 'a' => array( 'href' ) ) ),
                admin_url( 'plugins.php' )
            );
            exit;
        }
    }

    function register_required_plugins() {
        $plugins = array(
            array(
                'name' => 'JSON REST API (WP API)',
                'slug' => 'json-rest-api'
            )
        );
        tgmpa( $plugins, array() );
    }

    function bootstrap_latest_posts() {
        $posts = $this->get_simulated_json_api_response( '/posts' );
        return array( 'latestPosts' => $posts );
    }

    function bootstrap_single_post( $id ) {
        $post = $this->get_simulated_json_api_response( '/posts/' . $id );
        return array( 'post' => $post );
    }

    function get_simulated_json_api_response( $path ) {
        if ( ! isset( $this->json_api_server ) ) {
            $this->json_api_server = new WP_JSON_Simulated_Server();
        }

        ob_start();
        do_action( 'wp_json_server_before_serve', $this->json_api_server );
        $this->json_api_server->serve_request( $path );
        $response = ob_get_clean();

        return json_decode( $response, true );
    }

}

class WP_JSON_Simulated_Server extends WP_JSON_Server {
    protected function send_header( $key, $value ) { }
}