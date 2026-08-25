import { expect } from '@playwright/test';
import { measureScrollbarSize } from '../measurements/scrollbar.js';

/**
 * @typedef {'top'|'right'|'bottom'|'left'} PopperPlacement
 * @typedef {'start'|'center'|'end'} PopperPosition
 */

/**
 * Assert that a popper is placed and aligned relative to its reference node.
 *
 * The assertion compares rendered boxes instead of absolute transforms so it
 * remains valid across browser coordinate rounding and positioning contexts.
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
}) {
    const popperLocator = page.locator(popper);
    const referenceLocator = page.locator(reference);

    await expect(popperLocator).toHaveAttribute('data-ui-placement', placement);
    await expect(referenceLocator).toHaveAttribute('data-ui-placement', placement);

    const [popperBox, referenceBox] = await Promise.all([
        popperLocator.boundingBox(),
        referenceLocator.boundingBox(),
    ]);

    expect(popperBox, `Bounding box for ${popper}`).not.toBeNull();
    expect(referenceBox, `Bounding box for ${reference}`).not.toBeNull();

    expectPlacement(popper, placement, spacing, popperBox, referenceBox);

    if (position) {
        expectAlignment(popper, placement, position, popperBox, referenceBox);
    }

    if (boundaryEdge) {
        const boundaryBox = boundary ?
            await getElementBoundaryBox(page, boundary) :
            await getWindowBoundaryBox(page);

        expectBoundary(
            popper,
            boundaryEdge,
            minContact ?? 0,
            popperBox,
            referenceBox,
            boundaryBox,
        );
    }

    if (minContact !== undefined) {
        expectReferenceContact(popper, placement, minContact, popperBox, referenceBox);
    }
}

/**
 * Assert the popper placement relative to its reference.
 * @param {string} popper The popper selector.
 * @param {PopperPlacement} placement The expected placement.
 * @param {number} spacing The expected spacing between nodes.
 * @param {import('@playwright/test').BoundingBox} popperBox The popper box.
 * @param {import('@playwright/test').BoundingBox} referenceBox The reference box.
 */
function expectPlacement(popper, placement, spacing, popperBox, referenceBox) {
    const popperEdges = getBoxEdges(popperBox);
    const referenceEdges = getBoxEdges(referenceBox);

    switch (placement) {
        case 'top':
            expectCoordinate(popperEdges.bottom, referenceBox.y - spacing, `${popper} bottom`);
            break;
        case 'right':
            expectCoordinate(popperBox.x, referenceEdges.right + spacing, `${popper} left`);
            break;
        case 'bottom':
            expectCoordinate(popperBox.y, referenceEdges.bottom + spacing, `${popper} top`);
            break;
        case 'left':
            expectCoordinate(popperEdges.right, referenceBox.x - spacing, `${popper} right`);
            break;
        default:
            throw new Error(`Unknown Popper placement: ${placement}`);
    }
}

/**
 * Assert the popper alignment relative to its reference.
 * @param {string} popper The popper selector.
 * @param {PopperPlacement} placement The expected placement.
 * @param {PopperPosition} position The expected alignment.
 * @param {import('@playwright/test').BoundingBox} popperBox The popper box.
 * @param {import('@playwright/test').BoundingBox} referenceBox The reference box.
 */
function expectAlignment(popper, placement, position, popperBox, referenceBox) {
    switch (placement) {
        case 'top':
        case 'bottom':
            expectHorizontalAlignment(popper, position, popperBox, referenceBox);
            break;
        case 'right':
        case 'left':
            expectVerticalAlignment(popper, position, popperBox, referenceBox);
            break;
        default:
            throw new Error(`Unknown Popper placement: ${placement}`);
    }
}

/**
 * Assert the horizontal popper alignment.
 * @param {string} popper The popper selector.
 * @param {PopperPosition} position The expected alignment.
 * @param {import('@playwright/test').BoundingBox} popperBox The popper box.
 * @param {import('@playwright/test').BoundingBox} referenceBox The reference box.
 */
function expectHorizontalAlignment(popper, position, popperBox, referenceBox) {
    const popperEdges = getBoxEdges(popperBox);
    const referenceEdges = getBoxEdges(referenceBox);

    switch (position) {
        case 'start':
            expectCoordinate(popperBox.x, referenceBox.x, `${popper} left alignment`);
            break;
        case 'center':
            expectCoordinate(
                popperBox.x + popperBox.width / 2,
                referenceBox.x + referenceBox.width / 2,
                `${popper} horizontal center`,
            );
            break;
        case 'end':
            expectCoordinate(popperEdges.right, referenceEdges.right, `${popper} right alignment`);
            break;
        default:
            throw new Error(`Unknown Popper position: ${position}`);
    }
}

/**
 * Assert the vertical popper alignment.
 * @param {string} popper The popper selector.
 * @param {PopperPosition} position The expected alignment.
 * @param {import('@playwright/test').BoundingBox} popperBox The popper box.
 * @param {import('@playwright/test').BoundingBox} referenceBox The reference box.
 */
function expectVerticalAlignment(popper, position, popperBox, referenceBox) {
    const popperEdges = getBoxEdges(popperBox);
    const referenceEdges = getBoxEdges(referenceBox);

    switch (position) {
        case 'start':
            expectCoordinate(popperBox.y, referenceBox.y, `${popper} top alignment`);
            break;
        case 'center':
            expectCoordinate(
                popperBox.y + popperBox.height / 2,
                referenceBox.y + referenceBox.height / 2,
                `${popper} vertical center`,
            );
            break;
        case 'end':
            expectCoordinate(
                popperEdges.bottom,
                referenceEdges.bottom,
                `${popper} bottom alignment`,
            );
            break;
        default:
            throw new Error(`Unknown Popper position: ${position}`);
    }
}

/**
 * Assert the popper edge clamped to a boundary.
 * @param {string} popper The popper selector.
 * @param {PopperPlacement} boundaryEdge The expected clamped edge.
 * @param {number} contact The minimum reference overlap.
 * @param {import('@playwright/test').BoundingBox} popperBox The popper box.
 * @param {import('@playwright/test').BoundingBox} referenceBox The reference box.
 * @param {{top: number, right: number, bottom: number, left: number}} boundaryBox The boundary box.
 */
function expectBoundary(popper, boundaryEdge, contact, popperBox, referenceBox, boundaryBox) {
    const popperEdges = getBoxEdges(popperBox);
    const expectedCoordinate = getClampedBoundaryCoordinate(
        boundaryEdge,
        contact,
        referenceBox,
        boundaryBox,
    );

    expectCoordinate(
        popperEdges[boundaryEdge],
        expectedCoordinate,
        `${popper} ${boundaryEdge} boundary`,
    );
}

/**
 * Get the expected coordinate for a boundary-clamped popper edge.
 * @param {PopperPlacement} boundaryEdge The expected clamped edge.
 * @param {number} contact The minimum reference overlap.
 * @param {import('@playwright/test').BoundingBox} referenceBox The reference box.
 * @param {{top: number, right: number, bottom: number, left: number}} boundaryBox The boundary box.
 * @returns {number} The expected coordinate.
 */
function getClampedBoundaryCoordinate(boundaryEdge, contact, referenceBox, boundaryBox) {
    const referenceEdges = getBoxEdges(referenceBox);

    switch (boundaryEdge) {
        case 'top':
            return Math.min(boundaryBox.top, referenceEdges.bottom - contact);
        case 'right':
            return Math.max(boundaryBox.right, referenceBox.x + contact);
        case 'bottom':
            return Math.max(boundaryBox.bottom, referenceBox.y + contact);
        case 'left':
            return Math.min(boundaryBox.left, referenceEdges.right - contact);
        default:
            throw new Error(`Unknown Popper boundary edge: ${boundaryEdge}`);
    }
}

/**
 * Assert the minimum contact between a popper and its reference.
 * @param {string} popper The popper selector.
 * @param {PopperPlacement} placement The expected placement.
 * @param {number} minContact The minimum reference overlap.
 * @param {import('@playwright/test').BoundingBox} popperBox The popper box.
 * @param {import('@playwright/test').BoundingBox} referenceBox The reference box.
 */
function expectReferenceContact(popper, placement, minContact, popperBox, referenceBox) {
    const popperEdges = getBoxEdges(popperBox);
    const referenceEdges = getBoxEdges(referenceBox);
    let overlap;

    switch (placement) {
        case 'top':
        case 'bottom':
            overlap = Math.min(popperEdges.right, referenceEdges.right) -
                Math.max(popperBox.x, referenceBox.x);
            break;
        case 'right':
        case 'left':
            overlap = Math.min(popperEdges.bottom, referenceEdges.bottom) -
                Math.max(popperBox.y, referenceBox.y);
            break;
        default:
            throw new Error(`Unknown Popper placement: ${placement}`);
    }

    expect(overlap, `${popper} reference contact`).toBeGreaterThanOrEqual(minContact - 1);
}

/**
 * Get the viewport-relative edges for a bounding box.
 * @param {import('@playwright/test').BoundingBox} box The bounding box.
 * @returns {{top: number, right: number, bottom: number, left: number}} The box edges.
 */
function getBoxEdges(box) {
    return {
        top: box.y,
        right: box.x + box.width,
        bottom: box.y + box.height,
        left: box.x,
    };
}

/**
 * Get the viewport-relative window boundary box.
 * @param {import('@playwright/test').Page} page The Playwright page.
 * @returns {Promise<{top: number, right: number, bottom: number, left: number}>} The box.
 */
async function getWindowBoundaryBox(page) {
    const scrollbarSize = await measureScrollbarSize(page);

    return page.evaluate((scrollbarSize) => {
        const root = document.documentElement;
        const scrollSizeX = root.scrollWidth > window.innerWidth ?
            scrollbarSize :
            0;
        const scrollSizeY = root.scrollHeight > window.innerHeight ?
            scrollbarSize :
            0;

        return {
            top: 0,
            right: window.innerWidth - scrollSizeY,
            bottom: window.innerHeight - scrollSizeX,
            left: 0,
        };
    }, scrollbarSize);
}

/**
 * Get the viewport-relative boundary box for an element.
 * @param {import('@playwright/test').Page} page The Playwright page.
 * @param {string} selector The boundary selector.
 * @returns {Promise<{top: number, right: number, bottom: number, left: number}>} The box.
 */
async function getElementBoundaryBox(page, selector) {
    const scrollbarSize = await measureScrollbarSize(page);

    return page.evaluate(({ selector, scrollbarSize }) => {
        const node = document.querySelector(selector);
        const rect = node.getBoundingClientRect();
        const scrollSizeX = node.scrollWidth > node.clientWidth ?
            scrollbarSize :
            0;
        const scrollSizeY = node.scrollHeight > node.clientHeight ?
            scrollbarSize :
            0;

        return {
            top: rect.top,
            right: rect.right - scrollSizeY,
            bottom: rect.bottom - scrollSizeX,
            left: rect.left,
        };
    }, { selector, scrollbarSize });
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
