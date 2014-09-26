module.exports.get = function( key, defaultValue ) {
    if (
        'undefined' === typeof window.bootstrap ||
        'undefined' === typeof window.bootstrap[ key ]
    ) {
        return defaultValue;
    }

    return window.bootstrap[ key ];
};