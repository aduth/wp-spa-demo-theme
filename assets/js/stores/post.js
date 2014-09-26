var EventEmitter = require('events').EventEmitter,
    _ = require( 'lodash' ),
    xhr = require( 'superagent' ),
    bootstrap = require( '../bootstrap' ),
    CHANGE_EVENT = 'change',
    NUM_LATEST_POSTS = 10,
    latestPosts = bootstrap.get( 'latestPosts' ),
    _posts = {};

var PostStore = module.exports = _.extend({}, EventEmitter.prototype, {
    addChangeListener: function( callback ) {
        this.on( CHANGE_EVENT, callback );
    },

    removeChangeListener: function( callback ) {
        this.removeListener( CHANGE_EVENT, callback );
    },

    addPosts: function( posts ) {
        if ( posts instanceof Array ) {
            var postsById = _.indexBy( posts, 'ID' );
            this.addPosts( postsById );
        } else if ( 'object' === typeof posts ) {
            if ( 'ID' in posts ) {
                this.addPosts([ posts ]);
            } else {
                _.extend( _posts, posts );
                this.emit( CHANGE_EVENT, _posts );
            }
        }
    },

    getLatest: function() {
        if ( 'undefined' !== typeof latestPosts ) {
            return _( _posts )
                .values()
                .sortBy( 'date' )
                .take( NUM_LATEST_POSTS )
                .value();
        }

        xhr.get( '/wp-json/posts', function( res ) {
            if ( res.ok ) {
                latestPosts = res.body;
                this.addPosts( latestPosts );
            }
        }.bind( this ) );
    },

    getById: function( id ) {
        if ( id in _posts ) {
            return _posts[ id ];
        }

        xhr.get( '/wp-json/posts/' + id, function( res ) {
            if ( res.ok ) {
                _posts[ id ] = res.body;
                this.emit( CHANGE_EVENT, _posts[ id ] );
            }
        }.bind( this ) );

        return {};
    }
});

[ 'latestPosts', 'post' ].forEach(function( bootstrapKey ) {
    var bootstrapData = bootstrap.get( bootstrapKey );

    if ( 'undefined' !== typeof bootstrapData ) {
        PostStore.addPosts( bootstrapData );
    }
});