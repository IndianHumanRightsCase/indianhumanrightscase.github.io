(function() {
    'use strict';

    // Define the canonical URL that should always be shared.
    const SHARE_URL = 'https://indianhumanrightscase.github.io/';

    /**
     * Copies the email address from the designated element to the clipboard.
     * Provides visual feedback to the user.
     */
    function copyEmail() {
        const emailElement = document.getElementById('email-address');
        const copyBtn = document.getElementById('copy-email-btn');
        
        if (!emailElement || !copyBtn) return;

        const emailText = emailElement.dataset.email || emailElement.innerText;

        navigator.clipboard.writeText(emailText).then(() => {
            copyBtn.innerText = 'Copied!';
            copyBtn.style.backgroundColor = '#28a745'; // Green for success
            emailElement.classList.add('highlight-copy');

            setTimeout(() => {
                copyBtn.innerText = 'Copy Email';
                copyBtn.style.backgroundColor = '#8B0000'; // Original color
                emailElement.classList.remove('highlight-copy');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy email: ', err);
            copyBtn.innerText = 'Failed!';
            copyBtn.style.backgroundColor = '#dc3545'; // Red for failure

            setTimeout(() => {
                copyBtn.innerText = 'Copy Email';
                copyBtn.style.backgroundColor = '#8B0000'; // Original color
            }, 2000);
        });
    }

    /**
     * Opens the Twitter share dialog with the canonical URL and main site title.
     */
    function shareOnTwitter() {
        const url = encodeURIComponent(SHARE_URL);
        const text = encodeURIComponent("An Urgent Plea for Justice: Persecution of a Muslim Family in India");
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'noopener,noreferrer');
    }

    /**
     * Opens the Facebook share dialog with the canonical URL.
     */
    function shareOnFacebook() {
        const url = encodeURIComponent(SHARE_URL);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'noopener,noreferrer');
    }

    /**
     * Sets up the native Web Share API to share the canonical URL.
     * Provides a fallback to copy the canonical URL to the clipboard.
     */
    function setupNativeShare() {
        const shareButtons = document.querySelectorAll('.js-share-button');
        shareButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                const buttonElement = event.currentTarget;
                const shareData = {
                    title: "An Urgent Plea for Justice: Persecution of a Muslim Family in India",
                    text: document.querySelector('meta[name="description"]').content,
                    url: SHARE_URL
                };

                if (navigator.share) {
                    try {
                        await navigator.share(shareData);
                    } catch (err) {
                        console.log("Web Share API dialog closed.", err);
                    }
                } else {
                    // Fallback for browsers that do not support the Web Share API
                    navigator.clipboard.writeText(SHARE_URL).then(() => {
                        buttonElement.innerText = 'Link Copied!';
                        setTimeout(() => {
                            buttonElement.innerText = 'Share Story';
                        }, 2000);
                    }).catch(err => {
                        console.error('Fallback copy failed', err);
                        buttonElement.innerText = 'Copy Failed!';
                        setTimeout(() => {
                            buttonElement.innerText = 'Share Story';
                        }, 2000);
                    });
                }
            });
        });
    }

    /**
     * Sets up the "Back to Top" and "Go to Bottom" buttons, managing their visibility
     * and functionality with a robust check for mobile devices.
     */
    function setupScrollButtons() {
        const backToTopBtn = document.getElementById('back-to-top-btn');
        const goToBottomBtn = document.getElementById('go-to-bottom-btn');
        if (!backToTopBtn || !goToBottomBtn) return;

        const scrollFunction = () => {
            const scrollPosition = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;

            // Show/hide "Back to Top" button
            if (scrollPosition > 20) {
                backToTopBtn.style.display = "block";
            } else {
                backToTopBtn.style.display = "none";
            }

            // A more robust check for being at the bottom of the page.
            // Some mobile browsers have rounding issues, so we check if we are "close enough".
            const isAtBottom = scrollHeight - (scrollPosition + clientHeight) < 1;

            // Show/hide "Go to Bottom" button
            if (isAtBottom) {
                goToBottomBtn.style.display = "none";
            } else {
                goToBottomBtn.style.display = "block";
            }
        };

        window.addEventListener('scroll', scrollFunction);

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        goToBottomBtn.addEventListener('click', () => {
            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
        });
        
        // Initial check
        scrollFunction();
    }

    /**
     * Attaches all necessary event listeners to the DOM elements.
     */
    function initializeEventListeners() {
        // Traditional Share Buttons
        document.querySelector('.share-btn.twitter')?.addEventListener('click', shareOnTwitter);
        document.querySelector('.share-btn.facebook')?.addEventListener('click', shareOnFacebook);
        document.querySelector('.share-btn.print')?.addEventListener('click', () => window.print());

        // Copy Email Button
        document.getElementById('copy-email-btn')?.addEventListener('click', copyEmail);

        // Modern Share API Button
        setupNativeShare();

        // Scroll Buttons
        setupScrollButtons();

        // Mobile Navigation
        setupMobileNav();

        // Contact Form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener("submit", handleFormSubmit);
        }

        // Highlight active navigation link
        highlightActiveNav();
    }

    // Run all setup functions when the DOM is fully loaded.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeEventListeners);
    } else {
        initializeEventListeners();
    }

})();

    /**
     * Sets up the mobile navigation toggle.
     */
    function setupMobileNav() {
        const navToggle = document.querySelector('.mobile-nav-toggle');
        const primaryNav = document.querySelector('.primary-navigation');

        if (navToggle && primaryNav) {
            navToggle.addEventListener('click', () => {
                const isVisible = primaryNav.getAttribute('data-visible') === 'true';
                primaryNav.setAttribute('data-visible', !isVisible);
                navToggle.setAttribute('aria-expanded', !isVisible);
            });
        }
    }

    /**
     * Handles the contact form submission.
     */
    async function handleFormSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        const status = document.getElementById('form-status');

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                status.innerHTML = "Thanks for your submission!";
                form.reset();
            } else {
                const responseData = await response.json();
                if (Object.hasOwn(responseData, 'errors')) {
                    status.innerHTML = responseData["errors"].map(error => error["message"]).join(", ");
                } else {
                    status.innerHTML = "Oops! There was a problem submitting your form";
                }
            }
        } catch (error) {
            status.innerHTML = "Oops! There was a problem submitting your form";
        }
    }

    /**
     * Highlights the active page in the navigation menus.
     */
    function highlightActiveNav() {
        const currentLocation = window.location.pathname;
        const navLinks = document.querySelectorAll('.desktop-navigation a, .primary-navigation a');

        navLinks.forEach(link => {
            // Handle the case for the root index.html
            if (link.getAttribute('href') === 'index.html' && (currentLocation === '/' || currentLocation.endsWith('/index.html'))) {
                link.classList.add('active-link');
            }
            // Handle other pages
            else if (currentLocation.endsWith(link.getAttribute('href')) && link.getAttribute('href') !== 'index.html') {
                link.classList.add('active-link');
            }
        });
    }
