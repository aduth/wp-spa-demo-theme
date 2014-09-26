<?php

/**
 * A utility class to assist provide a means to using different asset URIs based on the current
 * app environment with support for asset revisions
 */
class Asset_Utility {

    /**
     * An array of individual manifest file names where a manifest is an array of expected asset
     * paths mapped to the actual file location
     *
     * @var array
     */
    static $revision_manifests = array();

    /**
     * Returns the asset path using a manifest array to map expected path to actual path
     *
     * @param  mixed  $revision_manifest A file name to be parsed as JSON or an array of revision
     *                                   redirects
     * @return string                    The actual asset path calculated using asset manifest
     */
    public static function get_asset_revision( $asset_uri, $revision_manifest = array() ) {
        $revision_manifest = static::get_revision_manifest( $revision_manifest );
        if ( array_key_exists( $asset_uri, $revision_manifest ) ) {
            $asset_uri = $revision_manifest[ $asset_uri ];
        }

        return $asset_uri;
    }

    /**
     * Returns either the specified development URI or production URI based on the current app
     * environment
     *
     * @param  string $development_uri   The URI to use in a development environment
     * @param  string $production_uri    The URI to use in a production environment
     * @return string                    The asset URI corresponding to the current app environment
     */
    public static function get_environment_asset( $development_uri, $production_uri ) {
        return static::is_development() ? $development_uri : $production_uri;
    }

    /**
     * Returns a revision manifest array using a provided array or by parsing the contents of a
     * file as JSON
     *
     * @param  mixed  $revision_manifest A file name to be parsed as JSON or an array of revision
     *                                   redirects
     * @return array                     An array of revision redirects
     */
    public static function get_revision_manifest( $revision_manifest = array() ) {
        // Shortcut if manifest is not specified
        if ( is_array( $revision_manifest ) ) {
            return $revision_manifest;
        }

        // Find file by string
        if ( is_string( $revision_manifest ) ) {
            if ( ! array_key_exists( $revision_manifest, static::$revision_manifests ) ) {
                $manifest_source = $revision_manifest;
                if ( file_exists( $manifest_source ) ) {
                    // Parse file contents as JSON
                    $manifest_contents = file_get_contents( $manifest_source );
                    static::$revision_manifests[ $revision_manifest ] = json_decode( $manifest_contents, true );
                }
            }

            return static::$revision_manifests[ $revision_manifest ];
        }

        return array();
    }

    /**
     * Returns true if the current app environment is detected to be a development environment, or
     * false otherwise. An app environment is considered to be a development environment if the
     * host is 'localhost' or '127.0.0.1', the domain TLD is '.dev', and an 'APP_ENV' environmental
     * variable does not exist with the value of 'production'.
     *
     * @return boolean True if the current environment is detected to be a development environment
     */
    public static function is_development() {
        static $is_development;

        if ( ! isset( $is_development ) ) {
            $is_development = 'production' !== getenv( 'APP_ENV' ) && (
                'localhost' === $_SERVER['HTTP_HOST'] ||
                '127.0.0.1' === $_SERVER['HTTP_HOST'] ||
                'dev' === static::get_current_domain_tld()
            );
        }

        return $is_development;
    }

    /**
     * Returns the domain TLD for the current request
     *
     * @return string The domain TLD for the current request
     */
    public static function get_current_domain_tld() {
        $host = $_SERVER['HTTP_HOST'];
        $host_parts = split( '\.', $host );
        return strtolower( array_pop( $host_parts ) );
    }

}