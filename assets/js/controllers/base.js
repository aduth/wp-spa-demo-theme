module.exports = {
    setTitle: function( context, title ) {
        context.app.setTitle( title );
        context.router.setTitle( title );
    }
};