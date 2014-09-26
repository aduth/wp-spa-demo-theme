var React = require( 'react' ),
    page = require( 'page' ),
    App = require( './components/app' ),
    Router = require( './router' );

var app = React.renderComponent(
  <App />,
  document.getElementById( 'app' )
);

var router = new Router();

router.injectIntoContext({
    app: app,
    router: router,
    elements: {
        main: document.getElementById( 'main' )
    }
});

router.start();