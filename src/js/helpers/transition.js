import { window } from '../globals.js';

const FALLBACK_PADDING = 50;

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

    const result = (completed) => ({
        ...data,
        completed,
        node,
    });

    if (!transitions.length) {
        return Promise.resolve(result(true));
    }

    const endTime = Math.max(...transitions.map((transition) => {
        const transitionEndTime = transition.effect?.getComputedTiming().endTime;
        return Number.isFinite(transitionEndTime) ? transitionEndTime : 0;
    }));

    let fallback;

    const settled = Promise.allSettled(
        transitions.map((transition) => transition.finished),
    ).then((results) => {
        window.clearTimeout(fallback);
        return results.every((transitionResult) => transitionResult.status === 'fulfilled');
    });

    const timedOut = new Promise((resolve) => {
        // WebKit can leave finished pending, particularly for zero-duration transitions.
        fallback = window.setTimeout(() => resolve(false), endTime + FALLBACK_PADDING);
    });

    return Promise.race([settled, timedOut]).then(result);
}
