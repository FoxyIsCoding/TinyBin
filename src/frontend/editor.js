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

// some nerdy stuff
// probably make the note post and expire
export async function postNote() {
    const title = document.getElementById('title').value;
    const text = document.getElementById('text').value;
    const expires = document.getElementById('expireDate').value;
    if (!title || !text) {
        alert('Please fill in both title and text fields.');
        return;
    }
    // the most chaotic way to get the expiration date
    // this is a bit of a mess, but it works
    const convertToTime = expireSelectionToTime(expires) * 1000;
    const finalDate = toMySQLDateTime(new Date(Date.now() + convertToTime));
    const expiresAt = finalDate;
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
        window.location.href = `/paste/${data.url}`;
        console.log('Note added with ID:', data.url);
    } else {
        console.error('Error adding note');
        alert('Error saving note');
    }
}