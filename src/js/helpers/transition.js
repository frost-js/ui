import { window } from './../globals.js';

/**
 * Waits for an element's CSS transitions to finish or be canceled.
 * @param {HTMLElement} node The transitioning node.
 * @param {string[]} [properties=[]] The transition properties to wait for.
 * @returns {Promise<boolean>} Whether every transition finished.
 */
export function waitForTransition(node, properties = []) {
    const transitions = node.getAnimations()
        .filter((animation) =>
            animation instanceof window.CSSTransition &&
            (!properties.length || properties.includes(animation.transitionProperty)),
        );

    return Promise.allSettled(
        transitions.map((transition) => transition.finished),
    ).then((results) =>
        results.every((result) => result.status === 'fulfilled'),
    );
};
