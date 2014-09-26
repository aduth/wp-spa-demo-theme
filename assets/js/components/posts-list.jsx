var PostStore = require( '../stores/post' ),
    _ = require( 'lodash' );

var getPostsState = function() {
    return {
        posts: PostStore.getLatest()
    };
};

module.exports = React.createClass({
    getInitialState: function() {
        return getPostsState();
    },

    componentWillMount: function() {
        PostStore.addChangeListener( this.updatePosts );
    },

    componentWillUnmount: function() {
        PostStore.removeChangeListener( this.updatePosts );
    },

    updatePosts: function() {
        this.setState( getPostsState() );
    },

    componentWillReceiveProps: function( nextProps ) {
        this.setState( getPostsState() );
    },

    render: function() {
        var postsList = _.map( this.state.posts, function( post ) {
            return (
                <li>
                    <a href={ '/posts/' + post.ID } key={ post.ID }>{ post.title }</a>
                </li>
            );
        }.bind( this ) );

        return (
            <ul>
                { postsList }
            </ul>
        );
    }
});