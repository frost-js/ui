'use strict';

/**
 * Gets the PostCSS configuration.
 * @param {object} _ The PostCSS context.
 * @returns {object} The PostCSS configuration.
 */
export default (_) => {
    return {
        map: {
            inline: false,
            annotation: true,
            sourcesContent: true,
        },
        plugins: {
            autoprefixer: {
                cascade: false,
            },
        },
    };
};
