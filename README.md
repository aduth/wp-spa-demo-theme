# WordPress SPA Demo Theme

A proof-of-concept single-page application built on WordPress using the official JSON API

## Requirements

- [JSON REST API plugin](https://wordpress.org/plugins/json-rest-api/)
- [Node.js](http://nodejs.org/)
- [Bower](http://bower.io/)
- [gulp.js](http://gulpjs.com/)

## Installation

First, clone the repository to your themes directory:

```bash
$ git clone git://github.com/aduth/wp-spa-demo-theme.git spa-demo
```

Then, install the required Node.js and Bower dependencies:

```bash
$ cd wp-spa-demo
$ npm install
$ bower install
```

Finally, compile JavaScript and style bundles:

```bash
$ gulp all
```

## License

Released under the MIT license (see LICENSE.md).