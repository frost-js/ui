import { $ } from './../../globals.js';
import { getPosition } from './../../helpers.js';
import { getDirOffset, getDirection, getIndex } from './../helpers.js';

/**
 * Attach events for the Carousel.
 */
export function _events() {
    if (this._options.keyboard) {
        $.addEvent(this._node, 'keydown.ui.carousel', (e) => {
            const target = e.target;
            if ($.is(target, 'input, select')) {
                return;
            }

            switch (e.code) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prev();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.next();
                    break;
            }
        });
    }

    if (this._options.pause) {
        $.addEvent(this._node, 'mouseenter.ui.carousel', (_) => {
            this._mousePaused = true;
            this.pause();
        });

        $.addEvent(this._node, 'mouseleave.ui.carousel', (_) => {
            this._mousePaused = false;
            this._paused = false;

            if (!$.getDataset(this._node, 'uiSliding')) {
                this._setTimer();
            }
        });
    }

    if (this._options.swipe) {
        let startX;
        let index = null;
        let progress;
        let direction;

        const downEvent = (e) => {
            if (
                e.button ||
                $.getDataset(this._node, 'uiSliding') ||
                (
                    !$.is(e.target, ':disabled, .disabled') &&
                    (
                        $.is(e.target, '[data-ui-slide-to], [data-ui-slide], a, button, input, textarea, select') ||
                        $.closest(e.target, '[data-ui-slide], a, button', (parent) => $.isSame(parent, this._node) || $.is(parent, ':disabled, .disabled')).length
                    )
                )
            ) {
                return false;
            }

            this.pause();
            $.setDataset(this._node, { uiSliding: true });

            const pos = getPosition(e);
            startX = pos.x;
        };

        const moveEvent = (e) => {
            const pos = getPosition(e);
            const currentX = pos.x;
            const width = $.width(this._node);
            const scrollX = width / 2;

            let mouseDiffX = currentX - startX;
            if (!this._options.wrap) {
                mouseDiffX = $._clamp(
                    mouseDiffX,
                    -(this._items.length - 1 - this._index) * scrollX,
                    this._index * scrollX,
                );
            }

            progress = $._map(Math.abs(mouseDiffX), 0, scrollX, 0, 1);

            do {
                const lastIndex = index;

                if (mouseDiffX < 0) {
                    index = this._index + 1;
                } else if (mouseDiffX > 0) {
                    index = this._index - 1;
                } else {
                    index = this._index;
                    return;
                }

                const offset = getDirOffset(index, this._items.length);
                index = getIndex(index, this._items.length);
                direction = getDirection(offset, this._index, index);

                if (progress >= 1) {
                    startX = currentX;

                    const oldIndex = this._setIndex(index);
                    this._update(this._items[this._index], this._items[oldIndex], progress, { direction });
                    this._updateIndicators();

                    if (lastIndex !== this._index) {
                        this._resetStyles(lastIndex);
                    }

                    progress--;
                } else {
                    this._update(this._items[index], this._items[this._index], progress, { direction, dragging: true });

                    if (lastIndex !== index) {
                        this._resetStyles(lastIndex);
                    }
                }
            } while (progress > 1);
        };

        const upEvent = (_) => {
            if (index === null || index === this._index) {
                this._paused = false;
                $.removeDataset(this._node, 'uiSliding');
                this._setTimer();
                return;
            }

            let oldIndex;
            let progressRemaining;
            if (progress > .25) {
                oldIndex = this._setIndex(index);
                progressRemaining = 1 - progress;
            } else {
                oldIndex = index;
                progressRemaining = progress;
                direction = direction === 'right' ? 'left' : 'right';
            }

            this._resetStyles(this._index);

            index = null;

            $.animate(
                this._items[this._index],
                (node, newProgress) => {
                    if (!this._items) {
                        return;
                    }

                    if (progress > .25) {
                        this._update(node, this._items[oldIndex], progress + (newProgress * progressRemaining), { direction });
                    } else {
                        this._update(node, this._items[oldIndex], (1 - progress) + (newProgress * progressRemaining), { direction });
                    }
                },
                {
                    duration: this._options.transition * progressRemaining,
                },
            ).then((_) => {
                this._updateIndicators();
                $.removeDataset(this._node, 'uiSliding');

                this._paused = false;
                this._setTimer();
            }).catch((_) => {
                $.removeDataset(this._node, 'uiSliding');
            });
        };

        const dragEvent = $.mouseDragFactory(downEvent, moveEvent, upEvent);

        $.addEvent(this._node, 'mousedown.ui.carousel touchstart.ui.carousel', dragEvent);
    }
};
