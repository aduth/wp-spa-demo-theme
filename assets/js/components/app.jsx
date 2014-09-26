var react = require( 'react' );

module.exports = React.createClass({
    getInitialState: function() {
        return {
            title: null
        };
    },

    setTitle: function( title ) {
        this.setState({
            title: title
        });
    },

    render: function() {
        return (
            <div>
                <h1>{ this.state.title }</h1>
                <div id="main"></div>
            </div>
        );
    }
});