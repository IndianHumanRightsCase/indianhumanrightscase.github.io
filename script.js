(function() {
    'use strict';

    // Function to copy email address to clipboard
    function copyEmail() {
        const emailElement = document.getElementById('email-address');
        const emailText = emailElement.innerText;
        const copyBtn = document.getElementById('copy-email-btn');

        navigator.clipboard.writeText(emailText).then(() => {
            // Provide visual feedback
            copyBtn.innerText = 'Copied!';
            copyBtn.style.backgroundColor = '#28a745';
            emailElement.classList.add('highlight-copy'); // Highlight the email

            // Reset the button text and highlight after a few seconds
            setTimeout(() => {
                copyBtn.innerText = 'Copy Email';
                copyBtn.style.backgroundColor = '#8B0000';
                emailElement.classList.remove('highlight-copy'); // Remove highlight
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy email: ', err);
            copyBtn.innerText = 'Failed!';
            // Optional: indicate failure visually
            setTimeout(() => {
                copyBtn.innerText = 'Copy Email';
            }, 2000);
        });
    }

    // Function to share on Twitter
    function shareOnTwitter() {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent("An Urgent Plea for Justice: Persecution of a Muslim Family in India");
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'noopener,noreferrer');
    }

    // Function to share on Facebook
    function shareOnFacebook() {
        const url = encodeURIComponent(window.location.href);
    // Function to share the story using Web Share API or fallback to copy
    async function shareStory() {
        const shareBtn = document.getElementById('share-btn');
        const shareData = {
            title: document.title,
            text: document.querySelector('meta[name="description"]').content,
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error("Sharing failed:", err);
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(window.location.href).then(() => {
                shareBtn.innerText = 'Link Copied!';
                setTimeout(() => {
                    shareBtn.innerText = 'Share Story';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy link: ', err);
                shareBtn.innerText = 'Copy Failed!';
                setTimeout(() => {
                    shareBtn.innerText = 'Share Story';
                }, 2000);
            });
        }
    }

        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'noopener,noreferrer');
    }

    // Back to Top button functionality
    document.addEventListener('DOMContentLoaded', (event) => {
        const backToTopBtn = document.getElementById('back-to-top-btn');

        if (backToTopBtn) {
            window.onscroll = function() {
                scrollFunction();
            };

            function scrollFunction() {
                if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                    backToTopBtn.style.display = "block";
                } else {
                    backToTopBtn.style.display = "none";
                }
            }

            backToTopBtn.addEventListener('click', () => {
                document.body.scrollTop = 0; // For Safari
                document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
            });
        }
    });

    // Expose functions to the global scope for onclick attributes
    window.copyEmail = copyEmail;
    window.shareOnTwitter = shareOnTwitter;
    window.shareOnFacebook = shareOnFacebook;

})();
