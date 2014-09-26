var React = require( 'react' ),
    page = require( 'page' ),
    _ = require( 'lodash' ),
    BaseController = require( './base' ),
    PostsList = require( '../components/posts-list' ),
    Post = require( '../components/post' );

module.exports = _.extend({}, BaseController, {
    index: function( context ) {
        this.setTitle( context, 'Latest Posts' );

        React.renderComponent(
            <PostsList />
        , context.elements.main );
    },

    show: function( context ) {
        var postId = context.params.id;

        React.renderComponent(
            <Post id={ postId } onTitleChange={ this.setTitle.bind( this, context ) } />
        , context.elements.main );
    }
});