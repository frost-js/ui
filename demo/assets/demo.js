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
    'colors.html': 'Review the semantic palette, contrast pairings, subtle surfaces, and theme-aware color states.',
    'components/accordion.html': 'Organize related disclosure panels with exclusive, flush, and independently open behavior.',
    'components/collapse.html': 'Reveal content from buttons, links, horizontal transitions, or selectors shared by multiple targets.',
    'components/card.html': 'Compose flexible content surfaces with media, navigation, lists, and contextual treatments.',
    'components/card-group.html': 'Compare connected cards with aligned content against responsive grids of separate cards.',
    'components/carousel.html': 'Compare slides, controls, indicators, and captions using the same realistic media set.',
    'components/breadcrumb.html': 'Communicate page hierarchy with accessible trails, local dividers, and utility-based surfaces.',
    'components/clipboard.html': 'Copy provided text or the current value of a targeted control, with accessible operation feedback.',
    'components/close-button.html': 'Use a compact, accessible dismissal control that inherits the color of its surrounding surface.',
    'components/list-group.html': 'Organize static, interactive, contextual, horizontal, and selectable rows into cohesive groups.',
    'components/modal.html': 'Review modal sizes, alignment, scrolling, animation, and interactive content.',
    'components/nav.html': 'Compose horizontal, vertical, treated, aligned, distributed, and dropdown navigation groups.',
    'components/navbar.html': 'Build responsive navigation across expansion points, color contexts, and offcanvas layouts.',
    'components/pagination.html': 'Navigate result sets with clear current, disabled, compact, sized, and aligned controls.',
    'components/placeholder.html': 'Build loading skeletons that preserve content hierarchy across widths, sizes, colors, and motion.',
    'components/popover.html': 'Reveal richer contextual content with controlled triggers, placement, alignment, and dismissal.',
    'components/progress.html': 'Communicate values, semantic states, shared totals, active work, and vertical capacity.',
    'components/spinner.html': 'Indicate indeterminate work with accessible border or growing motion across common compositions.',
    'components/tabs.html': 'Connect accessible tab, pill, and vertical triggers to focused panels of related content.',
    'components/tooltip.html': 'Provide concise supporting text across pointer, keyboard, placement, alignment, and disabled states.',
    'content/figure.html': 'Keep media and its caption together, then adjust alignment with text utilities.',
    'content/image.html': 'Make images responsive and apply thumbnail, float, and alignment treatments.',
    'content/table.html': 'Present structured data with responsive wrappers, row states, and semantic variants.',
    'form/check.html': 'Compare checkboxes, radios, switches, inline controls, and button toggles across their native states.',
    'form/floating-label.html': 'Compare floating labels across filled and outline controls, sizes, and input groups.',
    'form/input-group.html': 'Compose filled and outline controls with text, selections, buttons, and responsive sizes.',
    'form/input.html': 'Compare filled and outline controls across input types, sizes, and interaction states.',
    'form/layout.html': 'Compose practical stacked, responsive, horizontal, and inline forms with the grid and spacing utilities.',
    'form/range.html': 'Review range controls with native limits, steps, disabled states, and responsive compositions.',
    'form/validation.html': 'Apply clear success and error states to filled, outline, and selection controls.',
    'layout/grid.html': 'Combine responsive rows and columns to build layouts that adapt across breakpoints.',
};

const sectionDescriptions = {
    Components: 'Compare the supported variants, states, and interactions for this component.',
    Forms: 'Review this form pattern across its supported states, sizes, and control types.',
    Foundations: 'See how this foundation establishes consistent, theme-aware content.',
    Helpers: 'Apply this focused helper to a common interface composition problem.',
    Layout: 'Use this layout primitive to organize content responsively.',
    Utilities: 'Apply these utilities directly and combine them across responsive breakpoints.',
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
    const isDark = theme === 'dark';

    $(document.documentElement).setAttribute('data-ui-theme', theme);
    $('[data-demo-theme]')
        .setAttribute('aria-label', `Use ${isDark ? 'light' : 'dark'} theme`)
        .setText(isDark ? 'Light theme' : 'Dark theme');
};

const toggleTheme = () => {
    const theme = document.documentElement.dataset.uiTheme === 'dark' ? 'light' : 'dark';

    localStorage.setItem('frostui-demo-theme', theme);
    setTheme(theme);
};

const renderNavigationGroup = ({ title, paths }, index) => {
    const expanded = path !== 'index.html' && title === section;
    const id = `demoNavigation${index}`;
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
            <div class="accordion-collapse collapse${expanded ? ' show' : ''}" id="${id}" data-ui-parent="#demoSections">
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
            <a class="navbar-brand fw-bold" href="${root}index.html">FrostUI</a>
            <button class="navbar-toggler" type="button" data-ui-toggle="offcanvas" data-ui-target="#demoNavigation" aria-controls="demoNavigation" aria-label="Open demo navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
        </div>
    </header>
    <aside class="offcanvas offcanvas-start bg-glass" id="demoNavigation" tabindex="-1" aria-labelledby="demoNavigationLabel" data-demo-sidebar>
        <div class="offcanvas-header border-bottom">
            <a class="d-flex align-items-center gap-2 text-body text-decoration-none" href="${root}index.html">
                <span class="badge bg-primary bg-gradient shadow-glow fs-5">F</span>
                <span>
                    <strong class="d-block" id="demoNavigationLabel">FrostUI</strong>
                    <small class="text-body-secondary">Component demos</small>
                </span>
            </a>
            <button class="btn-close" type="button" data-ui-dismiss="offcanvas" aria-label="Close navigation"></button>
        </div>
        <div class="offcanvas-body p-3">
            <div class="accordion accordion-flush" id="demoSections">
                ${navigation.map(renderNavigationGroup).join('')}
            </div>
        </div>
    </aside>`;

const renderExampleNavigation = () => `
    <div class="position-fixed top-0 end-0 z-3 p-3">
        <a class="btn btn-secondary btn-sm shadow-sm" href="../index.html#examples">Demos</a>
    </div>`;

const renderThemeToggle = () => `
    <div class="position-fixed bottom-0 end-0 z-3 p-3">
        <button class="btn btn-secondary btn-sm rounded-pill shadow-lg" data-demo-theme type="button">Dark theme</button>
    </div>`;

const renderPageHeader = () => {
    const container = $('body > .container').first();
    const heading = container.find('h1').first();
    const title = heading.getText();

    if (!title) {
        return;
    }

    const pageHeader = $.parseHTML(`
        <header class="mb-5">
            <nav aria-label="Breadcrumb">
                <ol class="breadcrumb mt-4 mb-0">
                    <li class="breadcrumb-item"><a href="${root}index.html">Demos</a></li>
                    <li class="breadcrumb-item active" aria-current="page">${section}</li>
                </ol>
            </nav>
            <h1>${title}</h1>
            <p class="lead text-body-secondary mb-0">${descriptions[path] || sectionDescriptions[section]}</p>
        </header>`).shift();

    heading.remove();
    container.prepend(pageHeader);
};

const storedTheme = localStorage.getItem('frostui-demo-theme');
setTheme(storedTheme === 'dark' ? 'dark' : 'light');

$.ready(() => {
    const navigationElements = $.parseHTML(`${example ? renderExampleNavigation() : renderNavigation()}${renderThemeToggle()}`);

    $(document.body).prepend(navigationElements);
    $('[data-demo-theme]').addEvent('click', toggleTheme);
    $('[data-demo-indeterminate]').each((node) => {
        node.indeterminate = true;
    });
    $('[data-demo-clipboard-tooltip]').each((node) => {
        const tooltip = UI.Tooltip.init(node, {
            placement: 'top',
            trigger: '',
        });
        let hideTimer;

        $.addEvent(node, 'copied.ui.clipboard', (_) => {
            const action = $.getDataset(node, 'uiAction') || 'copy';

            clearTimeout(hideTimer);
            $.setDataset(node, { uiTitle: action === 'cut' ? 'Cut to clipboard.' : 'Copied to clipboard.' });
            tooltip.refresh();
            tooltip.show();
            hideTimer = setTimeout(() => tooltip.hide(), 2000);
        });
    });
    $('[data-ui-toggle="tooltip"]').each((node) => UI.Tooltip.init(node));
    $('[data-ui-toggle="popover"]').each((node) => UI.Popover.init(node));
    setTheme(document.documentElement.dataset.uiTheme);

    if (!example && path !== 'index.html') {
        renderPageHeader();
    }
});
