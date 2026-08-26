const navigation = [
    {
        title: 'Foundations',
        paths: [
            ['Colors', 'colors.html'],
            ['Base styles', 'content/base.html'],
            ['Typography', 'content/typography.html'],
            ['Images', 'content/image.html'],
            ['Tables', 'content/table.html'],
            ['Figures', 'content/figure.html'],
        ],
    },
    {
        title: 'Layout',
        paths: [
            ['Containers', 'layout/container.html'],
            ['Grid', 'layout/grid.html'],
            ['Columns', 'layout/column.html'],
            ['Gutters', 'layout/gutter.html'],
        ],
    },
    {
        title: 'Forms',
        paths: [
            ['Inputs', 'form/input.html'],
            ['Checks and radios', 'form/check.html'],
            ['Input groups', 'form/input-group.html'],
            ['Floating labels', 'form/floating-label.html'],
            ['Form layout', 'form/layout.html'],
            ['Validation', 'form/validation.html'],
            ['Range controls', 'form/range.html'],
        ],
    },
    {
        title: 'Components',
        paths: [
            ['Accordion', 'components/accordion.html'],
            ['Alerts', 'components/alert.html'],
            ['Badges', 'components/badge.html'],
            ['Breadcrumbs', 'components/breadcrumb.html'],
            ['Buttons', 'components/button.html'],
            ['Button groups', 'components/button-group.html'],
            ['Cards', 'components/card.html'],
            ['Card groups', 'components/card-group.html'],
            ['Carousel', 'components/carousel.html'],
            ['Clipboard', 'components/clipboard.html'],
            ['Close button', 'components/close-button.html'],
            ['Collapse', 'components/collapse.html'],
            ['Dropdown', 'components/dropdown.html'],
            ['List groups', 'components/list-group.html'],
            ['Modal', 'components/modal.html'],
            ['Navs', 'components/nav.html'],
            ['Navbar', 'components/navbar.html'],
            ['Offcanvas', 'components/offcanvas.html'],
            ['Pagination', 'components/pagination.html'],
            ['Placeholders', 'components/placeholder.html'],
            ['Popover', 'components/popover.html'],
            ['Progress', 'components/progress.html'],
            ['Spinners', 'components/spinner.html'],
            ['Tabs', 'components/tabs.html'],
            ['Toasts', 'components/toast.html'],
            ['Tooltips', 'components/tooltip.html'],
        ],
    },
    {
        title: 'Helpers',
        paths: [
            ['Clearfix', 'helpers/clearfix.html'],
            ['Color and background', 'helpers/color-background.html'],
            ['Colored links', 'helpers/colored-link.html'],
            ['Focus rings', 'helpers/focus-ring.html'],
            ['Ratios', 'helpers/ratio.html'],
            ['Stacks', 'helpers/stacks.html'],
            ['Stretched links', 'helpers/stretched-link.html'],
            ['Text truncation', 'helpers/text-truncate.html'],
            ['Vertical rules', 'helpers/vertical-rule.html'],
            ['Visually hidden', 'helpers/visually-hidden.html'],
        ],
    },
    {
        title: 'Utilities',
        paths: [
            ['Backgrounds', 'utility/background.html'],
            ['Borders', 'utility/border.html'],
            ['Colors', 'utility/color.html'],
            ['Flex', 'utility/flex.html'],
            ['Float', 'utility/float.html'],
            ['Interactions', 'utility/interaction.html'],
            ['Links', 'utility/link.html'],
            ['Object fit', 'utility/object-fit.html'],
            ['Opacity', 'utility/opacity.html'],
            ['Overflow', 'utility/overflow.html'],
            ['Position', 'utility/position.html'],
            ['Shadows', 'utility/shadow.html'],
            ['Sizing', 'utility/sizing.html'],
            ['Text', 'utility/text.html'],
            ['Vertical align', 'utility/vertical-align.html'],
            ['Visibility', 'utility/visibility.html'],
            ['Z-index', 'utility/z-index.html'],
        ],
    },
    {
        title: 'Examples',
        paths: [
            ['Travel journal', 'examples/album.html'],
            ['Editorial', 'examples/blog.html'],
            ['Travel landing', 'examples/carousel.html'],
            ['Checkout', 'examples/checkout.html'],
            ['Cover', 'examples/cover.html'],
            ['Pricing', 'examples/pricing.html'],
            ['Sign in', 'examples/sign-in.html'],
        ],
    },
];

const descriptions = {
    'colors.html': 'The palette includes semantic colors, contrast pairs, derived interaction states, neutral surfaces, and scoped overrides.',
    'components/accordion.html': 'Accordions support exclusive panels, flush styling, and multiple independently open panels.',
    'components/alert.html': 'Alerts include semantic variants, headings, links, actions, and dismissal controls.',
    'components/badge.html': 'Badges provide labels, counts, semantic variants, and positioned indicators.',
    'components/breadcrumb.html': 'Breadcrumbs support current-page state, custom dividers, and contained layouts.',
    'components/button.html': 'Button examples cover solid, gradient, outline, size, disabled, layout, and toggle states.',
    'components/button-group.html': 'Button groups support horizontal and vertical actions, selection controls, toolbars, sizes, and nested dropdowns.',
    'components/card.html': 'Cards support structured content, media, headers, footers, navigation, lists, and semantic variants.',
    'components/card-group.html': 'Card groups connect related cards and align their content; responsive grids keep cards separate.',
    'components/carousel.html': 'Carousels provide slides, previous and next controls, indicators, captions, and configurable CSS timing.',
    'components/clipboard.html': 'Clipboard controls copy provided text or the current value of an input or textarea.',
    'components/close-button.html': 'Close buttons inherit the current text color and require an accessible name.',
    'components/collapse.html': 'Collapse examples cover button and link triggers, horizontal panels, and selectors shared by several targets.',
    'components/dropdown.html': 'Dropdowns support menu states, split actions, dynamic placement, dismissal options, and embedded forms.',
    'components/list-group.html': 'List groups support static, interactive, numbered, horizontal, semantic, and selectable items.',
    'components/modal.html': 'Modals support stacking, alignment, scrolling, size modifiers, and responsive fullscreen layouts.',
    'components/nav.html': 'Navs support horizontal and vertical links, tabs, pills, underlines, alignment, fill, and dropdowns.',
    'components/navbar.html': 'Navbars combine brands, links, forms, dropdowns, responsive expansion, themes, and offcanvas menus.',
    'components/offcanvas.html': 'Offcanvas panels can open from any edge with configurable backdrop, scrolling, and dismissal behavior.',
    'components/pagination.html': 'Pagination includes current and disabled states, compact labels, size modifiers, and alignment options.',
    'components/placeholder.html': 'Placeholders provide loading shapes, width and size modifiers, colors, and optional animation.',
    'components/popover.html': 'Popovers support text or HTML content, trigger modes, placement, alignment, and disabled controls.',
    'components/progress.html': 'Progress bars support labels, semantic colors, stacked values, stripes, animation, and vertical tracks.',
    'components/spinner.html': 'Spinners provide border and grow animations, sizes, semantic colors, and loading-button layouts.',
    'components/tabs.html': 'Tabs connect accessible triggers to panels using standard, pill, or vertical navigation.',
    'components/toast.html': 'Toasts support headers, actions, containers, programmatic display, and semantic colors.',
    'components/tooltip.html': 'Tooltips support pointer and keyboard triggers, HTML content, placement, alignment, and disabled controls.',
    'content/base.html': 'Base styles cover unclassed headings, text, lists, tables, controls, and other semantic HTML.',
    'content/figure.html': 'Figures keep images and captions together and support utility-based caption alignment.',
    'content/image.html': 'Image helpers provide responsive sizing, thumbnail framing, centering, and floats.',
    'content/table.html': 'Tables support stripes, borders, compact spacing, semantic rows, sections, and responsive scrolling.',
    'content/typography.html': 'Typography includes heading and display scales, lead text, inline elements, quotations, and list styles.',
    'form/check.html': 'Selection controls include checkbox, radio, switch, inline, and button-toggle presentations.',
    'form/floating-label.html': 'Floating labels work with filled and outline controls, size modifiers, and input groups.',
    'form/input-group.html': 'Input groups join filled or outline controls with text, selections, buttons, and size modifiers.',
    'form/input.html': 'Inputs provide filled and outline styles across control types, sizes, and native states.',
    'form/layout.html': 'Form examples cover stacked, responsive grid, horizontal, and inline layouts.',
    'form/range.html': 'Range controls support native limits, step intervals, disabled state, and responsive grouping.',
    'form/validation.html': 'Validation styles update filled, outline, checkbox, radio, and switch controls with their feedback.',
    'helpers/clearfix.html': 'Clearfix makes a parent contain floated media or controls.',
    'helpers/color-background.html': 'Text-background helpers pair semantic backgrounds with their intended contrast colors.',
    'helpers/colored-link.html': 'Colored links support semantic colors, fixed light and dark contrast, and underline utilities.',
    'helpers/focus-ring.html': 'Focus-ring helpers add keyboard-visible focus styles and semantic ring colors.',
    'helpers/ratio.html': 'Ratio helpers reserve responsive media space using preset or custom aspect ratios.',
    'helpers/stacks.html': 'Stacks arrange controls vertically or horizontally with gaps, auto margins, and dividers.',
    'helpers/stretched-link.html': 'Stretched links expand across their nearest positioned ancestor.',
    'helpers/text-truncate.html': 'Text truncation adds an ellipsis to constrained single-line labels.',
    'helpers/vertical-rule.html': 'Vertical rules separate content and stretch along the cross axis of a flex container.',
    'helpers/visually-hidden.html': 'Visually hidden helpers provide assistive labels and keyboard-revealed skip links.',
    'layout/column.html': 'Column utilities control alignment, distribution, wrapping, order, offsets, and auto margins.',
    'layout/container.html': 'Containers can use responsive maximum widths, a named breakpoint, or the full available width.',
    'layout/grid.html': 'The grid uses responsive rows, twelve-column spans, row columns, auto widths, and nesting.',
    'layout/gutter.html': 'Gutter utilities control horizontal and vertical grid spacing together or independently.',
    'utility/background.html': 'Background utilities cover semantic, neutral, gradient, glass, transparent, and opacity variants.',
    'utility/border.html': 'Border utilities control logical sides, colors, opacity, width, radius, and shape.',
    'utility/color.html': 'Text color utilities cover semantic, neutral, fixed-contrast, gradient, and opacity variants.',
    'utility/flex.html': 'Flex utilities cover direction, distribution, alignment, sizing, wrapping, order, and responsive variants.',
    'utility/float.html': 'Float utilities place content on logical edges and support responsive variants.',
    'utility/interaction.html': 'Interaction utilities control text selection and pointer targeting.',
    'utility/link.html': 'Link utilities control color opacity and underline color, offset, opacity, and interaction states.',
    'utility/object-fit.html': 'Object-fit utilities control how media fits a fixed frame and support responsive variants.',
    'utility/opacity.html': 'Opacity utilities fade an element and all of its rendered contents.',
    'utility/overflow.html': 'Overflow utilities control clipping, visibility, and scrolling on one or both axes.',
    'utility/position.html': 'Position utilities set positioning mode, logical offsets, and translation.',
    'utility/shadow.html': 'Shadow utilities provide theme-aware elevation levels and a primary-colored glow.',
    'utility/sizing.html': 'Sizing utilities set percentages, constraints, and classic or dynamic viewport dimensions.',
    'utility/text.html': 'Text utilities control alignment, wrapping, casing, size, weight, line height, family, and decoration.',
    'utility/vertical-align.html': 'Vertical-align utilities position inline, inline-block, and table-cell content.',
    'utility/visibility.html': 'Visibility utilities hide content without removing its allocated layout space.',
    'utility/z-index.html': 'Z-index utilities order positioned elements within a local stacking context.',
};

const $ = globalThis.$;
const UI = globalThis.UI;
const path = window.location.pathname.split('/demo/').pop() || 'index.html';
const directory = path.includes('/') ? path.split('/').shift() : null;
const example = directory === 'examples';
const root = directory ? '../' : '';
const currentGroup = navigation.find(({ paths }) => paths.some(([, itemPath]) => itemPath === path));
const section = currentGroup?.title || 'Foundations';

if (!example) {
    $(document.documentElement).setAttribute('data-demo-catalog', '');
}

const setTheme = (theme) => {
    const themeNode = $(document.documentElement);

    if (theme === 'system') {
        themeNode.removeAttribute('data-ui-theme');
    } else {
        themeNode.setAttribute('data-ui-theme', theme);
    }

    $('[data-demo-theme]').setValue(theme);
};

const updateTheme = (event) => {
    const theme = $.getValue(event.currentTarget);

    if (theme === 'system') {
        localStorage.removeItem('frostui-demo-theme');
    } else {
        localStorage.setItem('frostui-demo-theme', theme);
    }

    setTheme(theme);
};

const renderNavigationGroup = ({ title, paths }, index) => {
    const expanded = path !== 'index.html' && title === section;
    const id = `demo-navigation-${index}`;
    const links = paths.map(([label, itemPath]) => {
        const active = itemPath === path;

        return `
            <a class="list-group-item list-group-item-action border-0 rounded-2 px-3 py-2${active ? ' active' : ''}" href="${root}${itemPath}"${active ? ' aria-current="page"' : ''}>${label}</a>`;
    }).join('');

    return `
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button py-2${expanded ? '' : ' collapsed'}" type="button" data-ui-toggle="collapse" data-ui-target="#${id}" aria-expanded="${expanded}" aria-controls="${id}">
                    ${title}
                </button>
            </h2>
            <div class="collapse${expanded ? ' show' : ''}" id="${id}" data-ui-parent="#demo-sections">
                <div class="accordion-body p-2">
                    <nav class="list-group list-group-flush" aria-label="${title}">${links}
                    </nav>
                </div>
            </div>
        </div>`;
};

const renderNavigation = () => `
    <header class="navbar bg-glass sticky-top border-bottom d-lg-none" data-demo-header>
        <div class="container-fluid">
            <a class="navbar-brand d-flex align-items-center gap-2 fw-bold" href="${root}index.html">
                <span class="badge bg-primary bg-gradient shadow-glow fs-5" aria-hidden="true">F</span>
                <span>FrostUI</span>
            </a>
            <button class="navbar-toggler" type="button" data-ui-toggle="offcanvas" data-ui-target="#demo-navigation" aria-controls="demo-navigation" aria-label="Open demo navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
        </div>
    </header>
    <aside class="offcanvas offcanvas-start bg-glass" id="demo-navigation" tabindex="-1" aria-labelledby="demo-navigation-label" data-demo-sidebar>
        <div class="offcanvas-header border-bottom">
            <a class="d-flex align-items-center gap-2 text-body text-decoration-none" href="${root}index.html">
                <span class="badge bg-primary bg-gradient shadow-glow fs-5">F</span>
                <span>
                    <strong class="d-block" id="demo-navigation-label">FrostUI</strong>
                    <small class="text-body-secondary">Component demos</small>
                </span>
            </a>
            <button class="btn-close" type="button" data-ui-dismiss="offcanvas" aria-label="Close navigation"></button>
        </div>
        <div class="offcanvas-body p-3">
            <div class="accordion accordion-flush" id="demo-sections">
                ${navigation.map(renderNavigationGroup).join('')}
            </div>
        </div>
    </aside>`;

const renderExampleNavigation = () => `
    <div class="position-fixed bottom-0 start-0 z-3 p-3">
        <a class="btn btn-secondary btn-sm rounded-pill shadow-lg" href="../index.html#examples">&larr; Demos</a>
    </div>`;

const renderThemeToggle = () => `
    <div class="position-fixed bottom-0 end-0 z-3 p-3">
        <label class="visually-hidden" for="demo_theme">Theme</label>
        <select class="input-outline input-sm w-auto rounded-pill shadow-lg" id="demo_theme" data-demo-theme>
            <option value="system">System theme</option>
            <option value="light">Light theme</option>
            <option value="dark">Dark theme</option>
        </select>
    </div>`;

const renderPageHeader = () => {
    const container = $('body > .container').first();
    const description = descriptions[path];
    const heading = container.find('h1').first();
    const title = heading.getText();

    if (!title) {
        return;
    }

    const pageHeader = $.parseHTML(`
        <header class="pt-4 mb-5">
            <h1>${title}</h1>
            ${description ? `<p class="lead text-body-secondary mb-0">${description}</p>` : ''}
        </header>`).shift();

    heading.remove();
    container.prepend(pageHeader);
};

const storedTheme = localStorage.getItem('frostui-demo-theme');
setTheme(['light', 'dark'].includes(storedTheme) ? storedTheme : 'system');

$.ready(() => {
    const navigationElements = $.parseHTML(`${example ? renderExampleNavigation() : renderNavigation()}${renderThemeToggle()}`);

    $(document.body).prepend(navigationElements);
    $('[data-demo-theme]').addEvent('change', updateTheme);
    $('[data-demo-indeterminate]').each((node) => {
        node.indeterminate = true;
    });
    $('[data-ui-toggle="tooltip"]').each((node) => UI.Tooltip.init(node));
    $('[data-ui-toggle="popover"]').each((node) => UI.Popover.init(node));
    setTheme(document.documentElement.dataset.uiTheme || 'system');

    if (!example && path !== 'index.html') {
        renderPageHeader();
    }
});
