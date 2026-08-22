import { expect } from '@playwright/test';

/**
 * @typedef {'top'|'right'|'bottom'|'left'} PopperPlacement
 * @typedef {'start'|'center'|'end'} PopperPosition
 */

/**
 * Assert that a popper is placed and aligned relative to its reference node.
 *
 * The assertion uses the rendered boxes instead of absolute document
 * coordinates so it remains valid when browsers render text at slightly
 * different dimensions.
 *
 * @param {import('@playwright/test').Page} page The Playwright page.
 * @param {object} expectation The expected position.
 * @param {string} expectation.popper The popper selector.
 * @param {string} expectation.reference The reference selector.
 * @param {PopperPlacement} expectation.placement The expected placement.
 * @param {PopperPosition} [expectation.position] The expected alignment.
 * @param {number} [expectation.spacing] The expected spacing between nodes.
 * @param {string} [expectation.boundary] The boundary element selector.
 * @param {PopperPlacement} [expectation.boundaryEdge] The expected clamped edge.
 * @param {number} [expectation.minContact] The minimum reference overlap.
 * @param {boolean} [expectation.referencePlacement] Whether to assert the reference attribute.
 * @returns {Promise<void>} The promise.
 */
export async function expectPopperPosition(page, {
    popper,
    reference,
    placement,
    position,
    spacing = 0,
    boundary,
    boundaryEdge,
    minContact,
    referencePlacement = true,
}) {
    const popperLocator = page.locator(popper);
    const referenceLocator = page.locator(reference);

    await expect(popperLocator).toHaveAttribute('data-ui-placement', placement);
    if (referencePlacement) {
        await expect(referenceLocator).toHaveAttribute('data-ui-placement', placement);
    }

    const [popperBox, referenceBox] = await Promise.all([
        popperLocator.boundingBox(),
        referenceLocator.boundingBox(),
    ]);

    expect(popperBox, `Bounding box for ${popper}`).not.toBeNull();
    expect(referenceBox, `Bounding box for ${reference}`).not.toBeNull();

    const popperRight = popperBox.x + popperBox.width;
    const popperBottom = popperBox.y + popperBox.height;
    const referenceRight = referenceBox.x + referenceBox.width;
    const referenceBottom = referenceBox.y + referenceBox.height;

    if (placement === 'top') {
        expectCoordinate(popperBottom, referenceBox.y - spacing, `${popper} bottom`);
    } else if (placement === 'right') {
        expectCoordinate(popperBox.x, referenceRight + spacing, `${popper} left`);
    } else if (placement === 'bottom') {
        expectCoordinate(popperBox.y, referenceBottom + spacing, `${popper} top`);
    } else {
        expectCoordinate(popperRight, referenceBox.x - spacing, `${popper} right`);
    }

    if (position && ['top', 'bottom'].includes(placement)) {
        if (position === 'start') {
            expectCoordinate(popperBox.x, referenceBox.x, `${popper} left alignment`);
        } else if (position === 'center') {
            expectCoordinate(
                popperBox.x + popperBox.width / 2,
                referenceBox.x + referenceBox.width / 2,
                `${popper} horizontal center`,
            );
        } else {
            expectCoordinate(popperRight, referenceRight, `${popper} right alignment`);
        }
    } else if (position === 'start') {
        expectCoordinate(popperBox.y, referenceBox.y, `${popper} top alignment`);
    } else if (position === 'center') {
        expectCoordinate(
            popperBox.y + popperBox.height / 2,
            referenceBox.y + referenceBox.height / 2,
            `${popper} vertical center`,
        );
    } else if (position === 'end') {
        expectCoordinate(popperBottom, referenceBottom, `${popper} bottom alignment`);
    }

    if (boundaryEdge) {
        const boundaryBox = await getBoundaryBox(page, boundary);
        const popperEdges = {
            top: popperBox.y,
            right: popperRight,
            bottom: popperBottom,
            left: popperBox.x,
        };

        expectCoordinate(
            popperEdges[boundaryEdge],
            boundaryBox[boundaryEdge],
            `${popper} ${boundaryEdge} boundary`,
        );
    }

    if (minContact !== undefined) {
        const overlap = ['top', 'bottom'].includes(placement) ?
            Math.min(popperRight, referenceRight) - Math.max(popperBox.x, referenceBox.x) :
            Math.min(popperBottom, referenceBottom) - Math.max(popperBox.y, referenceBox.y);

        expect(overlap, `${popper} reference contact`).toBeGreaterThanOrEqual(minContact - 1);
    }
}

/**
 * Get a viewport-relative boundary box.
 * @param {import('@playwright/test').Page} page The Playwright page.
 * @param {string} [selector] The boundary selector.
 * @returns {Promise<{top: number, right: number, bottom: number, left: number}>} The box.
 */
async function getBoundaryBox(page, selector) {
    return page.evaluate((selector) => {
        if (!selector) {
            return {
                top: 0,
                right: document.documentElement.clientWidth,
                bottom: document.documentElement.clientHeight,
                left: 0,
            };
        }

        const node = document.querySelector(selector);
        const rect = node.getBoundingClientRect();

        return {
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            left: rect.left,
        };
    }, selector);
}

/**
 * Assert two rendered coordinates are equal within Popper's pixel rounding.
 * @param {number} actual The actual coordinate.
 * @param {number} expected The expected coordinate.
 * @param {string} message The assertion message.
 */
function expectCoordinate(actual, expected, message) {
    expect(Math.abs(actual - expected), message).toBeLessThanOrEqual(1.5);
}
