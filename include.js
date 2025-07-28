(function() {
    'use strict';

    async function includeHTML() {
        const elements = document.querySelectorAll('[data-include]');
        const promises = Array.from(elements).map(async (el) => {
            const file = el.getAttribute('data-include');
            if (file) {
                try {
                    const response = await fetch(file);
                    if (!response.ok) throw new Error('Network response was not ok.');
                    const data = await response.text();
                    el.innerHTML = data;
                } catch (error) {
                    console.error(`Error fetching ${file}:`, error);
                    el.innerHTML = 'Content could not be loaded.';
                }
            }
        });
        await Promise.all(promises);
        document.dispatchEvent(new CustomEvent('htmlIncluded'));
    }

    document.addEventListener('htmlIncluded', () => {
        if (typeof highlightActiveNav === 'function') {
            highlightActiveNav();
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', includeHTML);
    } else {
        includeHTML();
    }
})();