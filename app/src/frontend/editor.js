function toMySQLDateTime(date) {
    const pad = n => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

// some nerdy stuff
// probably make the note post and expire
export async function postNote() {
    const title = document.getElementById('title').value;
    const text = document.getElementById('text').value;
    if (!title || !text) {
        alert('Please fill in both title and text fields.');
        return;
    }

    const expiresAt = toMySQLDateTime(new Date(Date.now() + 24 * 60 * 60 * 1000));
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
        console.log('Note added with ID:', data.id);
        alert('Note saved!');
    } else {
        console.error('Error adding note');
        alert('Error saving note');
    }
}