# Frost UI

[![CI](https://github.com/frost-js/ui/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/frost-js/ui/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/frost-js/ui/branch/main/graph/badge.svg)](https://codecov.io/gh/frost-js/ui)
[![npm version](https://img.shields.io/npm/v/%40fr0st%2Fui?style=flat-square)](https://www.npmjs.com/package/@fr0st/ui)
[![npm downloads](https://img.shields.io/npm/dm/%40fr0st%2Fui?style=flat-square)](https://www.npmjs.com/package/@fr0st/ui)
[![CSS gzip size](https://img.badgesize.io/frost-js/ui/main/dist/frost-ui.min.css?compression=gzip&label=CSS%20gzip%20size&style=flat-square)](https://github.com/frost-js/ui/blob/main/dist/frost-ui.min.css)
[![JS gzip size](https://img.badgesize.io/frost-js/ui/main/dist/frost-ui.min.js?compression=gzip&label=JS%20gzip%20size&style=flat-square)](https://github.com/frost-js/ui/blob/main/dist/frost-ui.min.js)
[![license](https://img.shields.io/github/license/frost-js/ui?style=flat-square)](./LICENSE)

Customizable JavaScript UI framework with responsive components, utilities, and opinionated Sass styling.

## Highlights

- Responsive containers, grid layout, gutters, and utility classes
- Styled content, forms, navigation, feedback, and overlay components
- Declarative `data-ui-*` APIs alongside programmatic component classes
- Modals, offcanvas panels, dropdowns, carousels, tabs, toasts, tooltips, popovers, and more
- Keyboard navigation, focus trapping, scroll handling, and dynamic popper positioning
- System-aware light and dark themes with nested scopes and runtime CSS custom properties
- Frosted overlays, ambient gradients, glass surfaces, and theme-aware elevation
- Configurable Sass variables with public functions and mixins
- Prebuilt ESM and UMD bundles, with external or bundled [`fQuery`](https://www.npmjs.com/package/@fr0st/query)
- JSDoc-powered IntelliSense

## Installation

### Browser projects / bundlers

```bash
npm i @fr0st/ui
```

Frost UI's package entry point is ESM-only. Import the compiled CSS and use the named component exports from the JavaScript entry point:

```js
import '@fr0st/ui/dist/frost-ui.min.css';
import { Modal, Toast } from '@fr0st/ui';

const modal = Modal.init(document.querySelector('#settings-modal'));
modal.show();
```

The package entry point registers the complete component suite, its data APIs, and its fQuery plugins. A component can instead be imported directly when a project only needs part of the JavaScript:

```js
import Modal from '@fr0st/ui/src/js/modal/index.js';
```

[`@fr0st/query`](https://www.npmjs.com/package/@fr0st/query) is installed as a dependency.

### Browser (ESM)

The ESM bundle imports `@fr0st/query`, which in turn imports `@fr0st/core`. Map both dependencies when loading the bundle directly in a browser:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fr0st/ui@latest/dist/frost-ui.min.css">

<script type="importmap">
{
    "imports": {
        "@fr0st/core": "https://cdn.jsdelivr.net/npm/@fr0st/core@latest/dist/frost-core.esm.min.js",
        "@fr0st/query": "https://cdn.jsdelivr.net/npm/@fr0st/query@latest/dist/fquery.esm.min.js"
    }
}
</script>
<script type="module">
    import { Modal } from 'https://cdn.jsdelivr.net/npm/@fr0st/ui@latest/dist/frost-ui.esm.min.js';

    const modal = Modal.init(document.querySelector('#settings-modal'));
    modal.show();
</script>
```

### Browser (UMD)

Load the CSS, fQuery, and Frost UI scripts from your own copy or a CDN:

```html
<link rel="stylesheet" href="/path/to/dist/frost-ui.min.css">

<script src="/path/to/dist/fquery.min.js"></script>
<script src="/path/to/dist/frost-ui.min.js"></script>
<!-- or -->
<script src="https://cdn.jsdelivr.net/npm/@fr0st/query@latest/dist/fquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@fr0st/ui@latest/dist/frost-ui.min.js"></script>
```

The JavaScript bundle exposes the component exports as `globalThis.UI` and expects fQuery to be available as `globalThis.fQuery`.

An all-in-one build containing fQuery is also available:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fr0st/ui@latest/dist/frost-ui.min.css">
<script src="https://cdn.jsdelivr.net/npm/@fr0st/ui@latest/dist/frost-ui-bundle.min.js"></script>

<script>
    const modal = UI.Modal.init(document.querySelector('#settings-modal'));
    modal.show();
</script>
```

Do not load the separate fQuery script when using `frost-ui-bundle.js` or `frost-ui-bundle.min.js`.

The package root resolves to the prebuilt ESM bundle. Published files under `dist/` and `src/` are also available through matching package subpaths.

### Custom Sass builds

Install Sass and create an application stylesheet when the default Frost UI build needs different colors, typography, sizing, or layout settings:

```bash
npm i -D sass
```

`src/styles.scss`

```scss
@use "@fr0st/ui/src/scss/ui" as ui with (
    $primary: #6750a4,
    $accent: #db2777,
    $secondary: #546e7a,
    $body-bg: #f8fafc,
    $body-color: #172033,
    $body-bg-dark: #111318,
    $body-color-dark: #e4e7ee,
    $font-sans-serif: ("Inter", system-ui, sans-serif),
    $border-radius: .75rem,
    $grid-size: 16
);

.app-shell {
    @include ui.media-breakpoint-up(lg) {
        max-width: 90rem;
    }
}
```

Compile the entry point with npm package resolution enabled:

```bash
npx sass --load-path=node_modules src/styles.scss dist/styles.css
```

The `ui` module applies the configured values before emitting the complete framework. It also forwards Frost UI's public variables, functions, and mixins for use by application styles. Build tools that already resolve Sass modules from npm packages do not need the explicit load path.

## Quick Start

Frost UI's data API handles common interactions without application JavaScript. This control toggles the targeted collapse element:

```html
<button
    class="btn btn-primary collapsed"
    type="button"
    data-ui-toggle="collapse"
    data-ui-target="#details"
    aria-controls="details"
    aria-expanded="false">
    Show details
</button>

<div class="collapse" id="details">
    <div class="card card-body mt-3">
        Content can be toggled declaratively or through the Collapse class.
    </div>
</div>
```

Components can also be created and controlled directly:

```html
<div
    class="toast fade"
    id="status-toast"
    role="status"
    aria-live="polite"
    aria-atomic="true"
    style="display: none !important;">
    <div class="toast-body">Your changes were saved.</div>
</div>
```

```js
import { Toast } from '@fr0st/ui';

const toast = Toast.init(document.querySelector('#status-toast'), {
    autohide: true,
    delay: 3000,
});

toast.show();
```

See the [`demo/`](./demo/) folder for theme-aware examples with a System, Light, and Dark switcher covering components, forms, layout, helpers, and utilities.

## What's Included

| Area | Included features |
| --- | --- |
| Content | Base styles, typography, images, figures, and tables |
| Layout | Responsive containers, a configurable grid, columns, offsets, and gutters |
| Forms | Filled and outline inputs, floating labels, checks, ranges, input groups, and validation states |
| Components | Accordions, alerts, badges, breadcrumbs, buttons, cards, carousels, dropdowns, list groups, modals, navigation, navbars, offcanvas panels, pagination, placeholders, popovers, progress bars, spinners, tabs, toasts, and tooltips |
| Helpers | Clearfix, color backgrounds and links, focus rings, aspect ratios, stacks, stretched links, ambient and glass surfaces, gradient text, glow shadows, text truncation, vertical rules, and visually hidden content |
| Utilities | Colors, borders, display, flexbox, grid, spacing, sizing, positioning, overflow, shadows, text, visibility, and responsive variants |
| Enhancements | Clipboard controls, click ripples, and expanding text areas |

### JavaScript components

| Export | Purpose |
| --- | --- |
| `Alert` | Closes dismissible alerts with cancellable lifecycle events |
| `Button` | Toggles active and pressed button state |
| `Carousel` | Cycles slides with controls, indicators, keyboard input, and swipe gestures |
| `Collapse` | Shows and hides one or more vertical or horizontal regions |
| `Dropdown` | Positions menus and manages click, focus, and keyboard behavior |
| `Modal` | Manages dialogs, backdrops, focus trapping, keyboard dismissal, and document scrolling |
| `Offcanvas` | Manages edge panels, backdrops, keyboard dismissal, and document scrolling |
| `Popover` | Displays positioned, optionally sanitized rich content |
| `Tab` | Coordinates tab controls, panels, accessibility state, and keyboard navigation |
| `Toast` | Shows transient notifications with optional autohide timers |
| `Tooltip` | Displays positioned, optionally sanitized contextual labels |
| `FocusTrap` | Keeps keyboard focus inside an active region |
| `Popper` | Positions floating content relative to a reference element |
| `BaseComponent` | Provides shared initialization, options, element data, and disposal |

The package also exports helpers for component registration, target resolution, pointer positions, scroll containers, scrollbar compensation, CSS transition waiting, and generated IDs.

## Component Model

### Instances and options

Every component derives from `BaseComponent` and is associated with one element. Call the class's static `init()` method to retrieve the existing instance or create it:

```js
import { Modal } from '@fr0st/ui';

const node = document.querySelector('#settings-modal');
const modal = Modal.init(node, {
    backdrop: 'static',
    focus: true,
    keyboard: true,
});
```

Options are combined in this order:

1. Component defaults
2. The element's `data-ui-*` attributes
3. Options passed to `init()`

For example, this element overrides the default backdrop and keyboard behavior:

```html
<div
    class="modal"
    id="settings-modal"
    data-ui-backdrop="static"
    data-ui-keyboard="false"
    tabindex="-1"
    aria-hidden="true">
    <!-- modal markup -->
</div>
```

Defaults can be adjusted before instances are initialized:

```js
import { Toast } from '@fr0st/ui';

Toast.defaults.delay = 4000;
Toast.defaults.autohide = true;
```

Each instance exposes:

- `component.node`: the associated element, or `null` after disposal
- `component.options`: the frozen resolved options, or `null` after disposal
- `component.dispose()`: remove registered state and release resources owned by the instance

Calling `init()` again for the same element returns its current instance. Dispose it before initializing that element with a new set of options.

### Data API

Frost UI registers delegated document handlers for controls such as:

- `data-ui-toggle="button"`
- `data-ui-toggle="collapse"`
- `data-ui-toggle="dropdown"`
- `data-ui-toggle="modal"`
- `data-ui-toggle="offcanvas"`
- `data-ui-toggle="tab"`
- `data-ui-dismiss="alert"`
- `data-ui-dismiss="modal"`
- `data-ui-dismiss="offcanvas"`
- `data-ui-dismiss="toast"`
- `data-ui-slide` and `data-ui-slide-to`

Targets are normally resolved from `data-ui-target` or `href`. Because the handlers are delegated, matching controls added after Frost UI loads work without being registered individually.

Tooltip and popover triggers are initialized explicitly so their listeners and options can be configured:

```js
import { Tooltip } from '@fr0st/ui';

for (const node of document.querySelectorAll('[data-ui-toggle="tooltip"]')) {
    Tooltip.init(node);
}
```

Ride-enabled carousels marked with `data-ui-ride="carousel"` initialize when the document is ready.

### fQuery plugins

Importing a component registers a method on `fQuery.QuerySet` using the component's lowercase name:

```js
import $ from '@fr0st/query';
import '@fr0st/ui';

$('.toast').toast({
    autohide: false,
});

$('.toast').toast('show');
```

Pass an options object to initialize every matched element, or pass a public method name followed by its arguments. The first component or method result is returned.

Plugins are registered for alerts, buttons, carousels, collapses, dropdowns, focus traps, modals, offcanvas panels, popovers, poppers, tabs, toasts, and tooltips.

### Events and lifecycle

Interactive components emit namespaced fQuery events around state changes. Before-events can be cancelled with `preventDefault()`; completion events run after the transition finishes.

```js
import $ from '@fr0st/query';

$.addEvent('#settings-modal', 'show.ui.modal', (event) => {
    if (!userCanOpenSettings()) {
        event.preventDefault();
    }
});

$.addEvent('#settings-modal', 'shown.ui.modal', (_) => {
    console.log('Settings are visible');
});
```

| Components | Before event | Completion event |
| --- | --- | --- |
| Collapse, Dropdown, Modal, Offcanvas, Popover, Tab, Toast, Tooltip | `show.ui.*` | `shown.ui.*` |
| Collapse, Dropdown, Modal, Offcanvas, Popover, Tab, Toast, Tooltip | `hide.ui.*` | `hidden.ui.*` |
| Alert | `close.ui.alert` | `closed.ui.alert` |
| Carousel | `slide.ui.carousel` | `slid.ui.carousel` |

Clipboard controls emit `copied.ui.clipboard` with the completed action and copied text.

## Styling and Layout

Frost UI layouts use containers, rows, a configurable twelve-column grid, breakpoint prefixes, and spacing utilities:

```html
<main class="container py-5">
    <div class="row g-3">
        <section class="col-12 col-md-8">
            <div class="card shadow-sm">
                <div class="card-body">Main content</div>
            </div>
        </section>
        <aside class="col-12 col-md-4">
            <div class="p-3 rounded bg-body-tertiary">Sidebar</div>
        </aside>
    </div>
</main>
```

Breakpoint-prefixed classes apply from that breakpoint upwards. The default breakpoint map contains `xs`, `sm`, `md`, `lg`, `xl`, and `xxl`, and can be replaced through Sass configuration.

CSS-only components and utilities do not require Frost UI's JavaScript. Load the JavaScript when the page needs interactive behavior, event lifecycles, positioning, or accessibility state management.

## Themes and Customization

Frost UI follows the user's preferred color scheme by default. Set `data-ui-theme="light"` or `data-ui-theme="dark"` on the document or any container to select an explicit theme for that subtree:

```html
<html lang="en" data-ui-theme="dark">
```

```html
<nav class="navbar" data-ui-theme="dark">
    <!-- a dark themed region inside a light page -->
</nav>
```

Theme attributes can be nested. Each boundary recalculates the theme colors and overrides the inherited color scheme for its subtree.

Generated styles expose colors, typography, borders, shadows, focus rings, and component values through `--ui-*` custom properties. Override them after Frost UI for runtime theming:

```css
:root,
[data-ui-theme] {
    --ui-primary: #6750a4;
    --ui-body-bg: light-dark(#f8fafc, #111318);
    --ui-body-color: light-dark(#172033, #e4e7ee);
}

:root {
    --ui-border-radius: .5rem;
}
```

Use Sass configuration when derived colors, utility maps, breakpoints, component defaults, or generated class sets also need to change. Frost UI variables use `!default`, allowing them to be configured through the `ui` module shown in the installation section.

## Behavior Notes

- Frost UI's JavaScript requires a browser DOM or a compatible DOM environment configured through fQuery.
- The package entry point registers all component data handlers, QuerySet plugins, and the clipboard, ripple, and expanding-textarea enhancements.
- `frost-ui.js` expects a separate fQuery global; `frost-ui-bundle.js` includes it.
- Component options are resolved once, frozen, and retained until the instance is disposed.
- Tooltip and popover HTML is sanitized by default when HTML content is enabled.
- Event namespaces are managed by fQuery; the underlying native event types are `show`, `shown`, `hide`, `hidden`, and so on.
- Motion styles are enabled under `prefers-reduced-motion: no-preference`, with component transition timing controlled through CSS custom properties.
- Compiled CSS targets browsers in the Baseline Widely Available Browserslist range.
- Component markup and accessibility attributes remain the application's responsibility; interactive components update the state they own.

## Development

```bash
npm test
npm run lint
npm run lint:sass:unused
npm run build
```

`npm test` runs the Playwright suite in Chromium, Firefox, and WebKit.

## License

Frost UI is released under the [MIT License](./LICENSE).
