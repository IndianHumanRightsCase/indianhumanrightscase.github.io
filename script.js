// Function to copy email address to clipboard
function copyEmail() {
    const emailText = document.getElementById('email-address').innerText;
    navigator.clipboard.writeText(emailText).then(() => {
        alert('Email address copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy email: ', err);
    });
}

