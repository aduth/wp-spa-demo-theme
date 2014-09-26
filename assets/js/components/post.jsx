var PostStore = require( '../stores/post' ),
    _ = require( 'lodash' );

var getPostState = function( id ) {
    return {
        post: PostStore.getById( id )
    };
};

module.exports = React.createClass({
    getInitialState: function() {
        return getPostState( this.props.id );
    },

    componentWillMount: function() {
        PostStore.addChangeListener( this.updatePost );
    },

    componentWillUnmount: function() {
        PostStore.removeChangeListener( this.updatePost );
    },

    updatePost: function() {
        this.setState( getPostState( this.props.id ) );
    },

    render: function() {
        this.props.onTitleChange( this.state.post.title );

        return (
            <div>
                <div dangerouslySetInnerHTML={{ __html: this.state.post.content }}></div>
                <p><a href="/">Return Home</a></p>
            </div>
        );
    }
});