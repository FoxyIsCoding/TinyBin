function toMySQLDate(date) {
    const pad = n => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export async function postNote() {
    const title = document.getElementById('title').value;
    const text = document.getElementById('text').value;
    if (!title || !text) {
        alert('Please fill in both title and text fields.');
        return;
    }
    // Set expiresAt to 24 hours from now in MySQL DATETIME format
    const expiresAt = toMySQLDate(new Date(Date.now() + 24 * 60 * 60 * 1000));
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