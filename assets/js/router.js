var page = require( 'page' ),
    _ = require( 'lodash' ),
    _injected = {};

var Router = module.exports = function() { };

Router.prototype.start = function() {
    page( '*', function( context, next ) {
        _.extend( context, _injected );
        next();
    });

    var PostController = require( './controllers/post' );
    page( '/', PostController.index.bind( PostController ) );
    page( '/posts/:id', PostController.show.bind( PostController ) );

    page();
};

Router.prototype.injectIntoContext = function( key, val ) {
    if ( typeof key === 'object' ) {
        _.extend( _injected, key );
    } else {
        _injected[ key ] = val;
    }
};

Router.prototype.redirectTo = function( path ) {
    setTimeout(function() {
        page( path );
    }, 0);
};

Router.prototype.setTitle = function( title ) {
    document.title = title;
};