import { $ } from './../globals.js';

/**
 * @callback CountedStyleLock
 * @param {HTMLElement|Iterable<HTMLElement>|string} nodes The elements to update.
 * @param {Record<string, string|number>|((node: HTMLElement) => Record<string, string|number>)} styles The styles, or a factory evaluated on each element's first acquisition.
 * @returns {() => void} An idempotent function that releases this acquisition.
 * @throws {Error} If a style lock cannot be acquired. Earlier acquisitions are rolled back.
 */

/**
 * Applies temporary styles, rolling back all acquired locks if any property fails.
 * @param {HTMLElement|Iterable<HTMLElement>|string} nodes The elements to update.
 * @param {Record<string, string|number>} styles The longhand or custom properties to lock.
 * @returns {() => void} An idempotent function that releases the locks and restores the styles.
 * @throws {Error} If a style lock cannot be acquired.
 */
export function lockStyles(nodes, styles) {
    // Resolve the targets before style changes can affect the selector.
    nodes = $(nodes).get();
    const releases = [];

    const release = () => {
        while (releases.length) {
            const restore = releases.pop();
            restore();
        }
    };

    try {
        for (const [property, value] of Object.entries(styles)) {
            releases.push($.setStyleLock(nodes, property, value));
        }
    } catch (error) {
        release();
        throw error;
    }

    return release;
};

/**
 * Creates an independent style-lock counter, restoring styles after the last release.
 * @returns {CountedStyleLock} The counted locker. Existing locks retain their initial styles.
 */
export function lockStylesCounterFactory() {
    const locks = new WeakMap();

    return (nodes, styles) => {
        nodes = $._unique($(nodes).get());
        const acquired = [];

        const release = () => {
            while (acquired.length) {
                const [node, lock] = acquired.pop();

                if (--lock.count) {
                    continue;
                }

                lock.release();
                locks.delete(node);
            }
        };

        try {
            for (const node of nodes) {
                let lock = locks.get(node);

                if (!lock) {
                    const release = lockStyles(node, $._isFunction(styles) ? styles(node) : styles);
                    lock = { release, count: 0 };
                    locks.set(node, lock);
                }

                lock.count++;
                acquired.push([node, lock]);
            }
        } catch (error) {
            release();
            throw error;
        }

        return release;
    };
};
