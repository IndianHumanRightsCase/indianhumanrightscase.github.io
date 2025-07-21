// Function to copy email address to clipboard
function copyEmail() {
    const emailText = document.getElementById('email-address').innerText;
    navigator.clipboard.writeText(emailText).then(() => {
        alert('Email address copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy email: ', err);
    });
}

// Function to copy UN reference numbers to clipboard
function copyReference(refNumber) {
    navigator.clipboard.writeText(refNumber).then(() => {
        alert(`Reference number ${refNumber} copied to clipboard!`);
    }).catch(err => {
        console.error('Failed to copy reference number: ', err);
    });
}
