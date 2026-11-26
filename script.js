/* Mobile navigation, project interactions, active navigation and reveal effects */
document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = [...document.querySelectorAll('.nav-link')];
    const backToTop = document.querySelector('.back-to-top');

    // Keep the footer year current.
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    // Accessible mobile navigation.
    const closeMenu = () => {
        if (!menuButton || !navLinks) return;
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation');
        navLinks.classList.remove('open');
        document.body.classList.remove('menu-open');
    };

    if (menuButton && navLinks) {
        menuButton.addEventListener('click', () => {
            const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
            menuButton.setAttribute('aria-expanded', String(!isOpen));
            menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
            navLinks.classList.toggle('open', !isOpen);
            document.body.classList.toggle('menu-open', !isOpen);
        });
        navItems.forEach(link => link.addEventListener('click', closeMenu));
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') closeMenu();
        });
        window.addEventListener('resize', () => {
            if (window.innerWidth > 700) closeMenu();
        });
    }

    // Highlight the navigation item for the visible section.
    const sections = [...document.querySelectorAll('main section[id]')];
    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                navItems.forEach(link => {
                    const active = link.getAttribute('href') === `#${entry.target.id}`;
                    link.classList.toggle('active', active);
                    if (active) link.setAttribute('aria-current', 'location');
                    else link.removeAttribute('aria-current');
                });
            });
        }, {rootMargin: '-35% 0px -55% 0px', threshold: 0});
        sections.forEach(section => sectionObserver.observe(section));
    }

    // Project category filters.
    const filterButtons = [...document.querySelectorAll('.filter-button')];
    const projectCards = [...document.querySelectorAll('.project-card')];
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            filterButtons.forEach(item => {
                const selected = item === button;
                item.classList.toggle('active', selected);
                item.setAttribute('aria-pressed', String(selected));
            });
            projectCards.forEach(card => {
                card.hidden = filter !== 'all' && card.dataset.category !== filter;
            });
        });
    });

    // Expand additional project context.
    document.querySelectorAll('.details-button').forEach(button => {
        button.addEventListener('click', () => {
            const extra = button.nextElementSibling;
            const isOpen = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', String(!isOpen));
            button.querySelector('span').textContent = isOpen ? '＋' : '−';
            button.firstChild.textContent = isOpen ? 'Show project details ' : 'Hide project details ';
            extra.classList.toggle('is-open', !isOpen);
        });
    });

    // Subtle reveal animation; content remains visible if observer is unsupported.
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reveal-ready');
        const revealTargets = document.querySelectorAll(
            '.section-heading, .about-grid, .skill-group, .timeline-item, .project-card, .contact-card'
        );
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {threshold: 0.12});
        revealTargets.forEach(target => revealObserver.observe(target));
    }

    // Back-to-top button.
    const updateBackToTop = () => {
        if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 550);
    };
    window.addEventListener('scroll', updateBackToTop, {passive: true});
    updateBackToTop();
    if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));
});
