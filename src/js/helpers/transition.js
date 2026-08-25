import { window } from './../globals.js';

/**
 * Waits for an element's CSS transitions to finish or be canceled.
 * @template {Record<string, *>} [Data=Record<string, *>]
 * @param {HTMLElement} node The transitioning node.
 * @param {string[]} [properties=[]] The transition properties to wait for.
 * @param {Data} [data={}] Additional data to include in the transition result.
 * @returns {Promise<Data & {completed: boolean, node: HTMLElement}>} The transition result.
 */
export function waitForTransition(node, properties = [], data = {}) {
    const transitions = node.getAnimations()
        .filter((animation) =>
            animation instanceof window.CSSTransition &&
            (!properties.length || properties.includes(animation.transitionProperty)),
        );

    return Promise.allSettled(
        transitions.map((transition) => transition.finished),
    ).then((results) => ({
        ...data,
        completed: results.every((result) => result.status === 'fulfilled'),
        node,
    }));
};
