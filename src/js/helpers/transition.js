import { window } from './../globals.js';

/**
 * Waits for an element's CSS transitions to finish or be canceled.
 * @param {HTMLElement} node The transitioning node.
 * @param {string[]} [properties=[]] The transition properties to wait for.
 * @returns {Promise<{completed: boolean, node: HTMLElement}>} The transition result.
 */
export function waitForTransition(node, properties = []) {
    const transitions = node.getAnimations()
        .filter((animation) =>
            animation instanceof window.CSSTransition &&
            (!properties.length || properties.includes(animation.transitionProperty)),
        );

    return Promise.allSettled(
        transitions.map((transition) => transition.finished),
    ).then((results) => ({
        completed: results.every((result) => result.status === 'fulfilled'),
        node,
    }));
};
