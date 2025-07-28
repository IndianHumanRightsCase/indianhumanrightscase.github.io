(function() {
    'use strict';

    function copyEmail() {
        const emailElement = document.getElementById('email-address');
        const copyBtn = document.getElementById('copy-email-btn');
        if (!emailElement || !copyBtn) return;
        const emailText = emailElement.dataset.email || emailElement.innerText;
        navigator.clipboard.writeText(emailText).then(() => {
            copyBtn.innerText = 'Copied!';
            copyBtn.classList.add('success');
            emailElement.classList.add('highlight-copy');
            setTimeout(() => {
                copyBtn.innerText = 'Copy Email';
                copyBtn.classList.remove('success');
                emailElement.classList.remove('highlight-copy');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy email: ', err);
            copyBtn.innerText = 'Failed!';
            copyBtn.classList.add('fail');
            setTimeout(() => {
                copyBtn.innerText = 'Copy Email';
                copyBtn.classList.remove('fail');
            }, 2000);
        });
    }

    function shareOnTwitter() {
        const url = encodeURIComponent(window.location.href);
        const descriptionMeta = document.querySelector('meta[name="description"]');
        const text = encodeURIComponent(descriptionMeta ? descriptionMeta.content : document.title);
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'noopener,noreferrer');
    }

    function shareOnFacebook() {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'noopener,noreferrer');
    }

    function setupNativeShare() {
        const shareButtons = document.querySelectorAll('.js-share-button');
        shareButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                const buttonElement = event.currentTarget;
                const shareData = {
                    title: document.title,
                    text: document.querySelector('meta[name="description"]')?.content || 'Check out this link:',
                    url: window.location.href
                };
                if (navigator.share) {
                    try {
                        await navigator.share(shareData);
                    } catch (err) {
                        console.log("Web Share API dialog closed.", err);
                    }
                } else {
                    const shareTextElement = buttonElement.querySelector('.share-text');
                    if (!shareTextElement) return;

                    const originalText = shareTextElement.innerText;
                    navigator.clipboard.writeText(window.location.href).then(() => {
                        shareTextElement.innerText = 'Link Copied!';
                        setTimeout(() => {
                            shareTextElement.innerText = originalText;
                        }, 2000);
                    }).catch(err => {
                        console.error('Fallback copy failed', err);
                        shareTextElement.innerText = 'Copy Failed!';
                        setTimeout(() => {
                            shareTextElement.innerText = originalText;
                        }, 2000);
                    });
                }
            });
        });
    }

    function setupScrollButtons() {
        const backToTopBtn = document.getElementById('back-to-top-btn');
        const goToBottomBtn = document.getElementById('go-to-bottom-btn');
        if (!backToTopBtn || !goToBottomBtn) return;
        const scrollFunction = () => {
            const scrollPosition = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;
            if (scrollPosition > 20) {
                backToTopBtn.style.display = "block";
            } else {
                backToTopBtn.style.display = "none";
            }
            const isAtBottom = scrollHeight - (scrollPosition + clientHeight) < 1;
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
        scrollFunction();
    }

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


    function highlightActiveNav() {
        const currentLocation = window.location.pathname;
        const navLinks = document.querySelectorAll('.desktop-navigation a, .primary-navigation a');
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === 'index.html' && (currentLocation === '/' || currentLocation.endsWith('/index.html'))) {
                link.classList.add('active-link');
            } else if (currentLocation.endsWith(linkHref) && linkHref !== 'index.html') {
                link.classList.add('active-link');
            }
        });
    }

    function initializeEventListeners() {
        document.querySelectorAll('.share-btn.twitter').forEach(btn => btn.addEventListener('click', shareOnTwitter));
        document.querySelectorAll('.share-btn.facebook').forEach(btn => btn.addEventListener('click', shareOnFacebook));
        document.querySelectorAll('.share-btn.print').forEach(btn => btn.addEventListener('click', () => window.print()));
        document.getElementById('copy-email-btn')?.addEventListener('click', copyEmail);
        setupNativeShare();
        setupScrollButtons();
        setupMobileNav();
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener("submit", handleFormSubmit);
        }
        highlightActiveNav();
    }

    document.addEventListener('htmlIncluded', () => {
        initializeEventListeners();
    });
})();
