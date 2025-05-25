function toMySQLDateTime(date) {
    const pad = (num) => String(num).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

// the thingy that handles the expiration date
function expireSelectionToTime(expireSelection) {
    const now = new Date();
    let expireTime;
    switch (expireSelection) {
        case '1h':
            expireTime = 60 * 60; // 1 hour
            break;
        case '1d':
            expireTime = 24 * 60 * 60; // 24 hours
            break;
        case '1w':
            expireTime = 7 * 24 * 60 * 60; // 7 days
            break;
        case '1m':
            expireTime = 30 * 24 * 60 * 60; // 30 days
            break;
    }
    return expireTime;
}


    const title = document.getElementById('title').value;
    const text = document.getElementById('text').value;
    


// some nerdy stuff
// probably make the note post and expire
export async function postNote() {
    const title = document.getElementById('title').value;
    const text = document.getElementById('text').value;
    // Get selected expiration value from radio buttons
    const expires = document.querySelector('input[name="expire"]:checked').value;
    if (!title || !text) {
        alert('Please fill in both title and text fields.');
        return;
    }
    const convertToTime = expireSelectionToTime(expires) * 1000;
    const expiresAt = toMySQLDateTime(new Date(Date.now() + convertToTime));
    console.log('expiresAt being sent:', expiresAt);

    const response = await fetch('/api/addnote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, text, expiresAt })
    });

    if (response.ok) {
        const data = await response.json();
        window.location.href = `/share/${data.url}`;
        console.log('Note added with ID:', data.url);
    } else {
        console.error('Error adding note');
        alert('Error saving note');
    }
}

// Enable/disable save button based on input fields
function updateSaveButtonState() {
    const title = document.getElementById('title').value.trim();
    const text = document.getElementById('text').value.trim();
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.disabled = !(title && text);
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('title').addEventListener('input', updateSaveButtonState);
    document.getElementById('text').addEventListener('input', updateSaveButtonState);
    updateSaveButtonState(); 

    // Sliding effect for expiration options
    const options = document.getElementById('options');
    const slider = options.querySelector('.slider');
    const labels = options.querySelectorAll('label');
    const radios = options.querySelectorAll('input[type="radio"]');

    function moveSlider() {
        const checked = options.querySelector('input[type="radio"]:checked');
        const label = options.querySelector(`label[for="${checked.id}"]`);
        if (label) {
            const labelRect = label.getBoundingClientRect();
            const optionsRect = options.getBoundingClientRect();
            slider.style.left = (label.offsetLeft) + "px";
            slider.style.width = label.offsetWidth + "px";
        }
    }

    radios.forEach(radio => {
        radio.addEventListener('change', moveSlider);
    });

    // Initial position
    moveSlider();

    // If window resizes, keep slider aligned
    window.addEventListener('resize', moveSlider);
});