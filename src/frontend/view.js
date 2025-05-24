document.addEventListener('DOMContentLoaded', () => {
    // some formatting functions
    // formatDateTime formats a date string to a more readable format
    function formatDateTime(dtStr) {
        const d = new Date(dtStr);
        return d.toLocaleString(undefined, {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
        }).replace(',', '');
    }
    // the cool asf bubble with the expiring time
    // getExpiringIn calculates the time remaining until expiration
    function getExpiringIn(expireStr) {
        const now = new Date();
        const expire = new Date(expireStr);
        const diffMs = expire - now;
        if (diffMs <= 0) return 'expired';

        const diffSec = Math.floor(diffMs / 1000);
        const months = Math.floor(diffSec / (30 * 24 * 3600));
        const weeks = Math.floor((diffSec % (30 * 24 * 3600)) / (7 * 24 * 3600));
        const days = Math.floor((diffSec % (7 * 24 * 3600)) / (24 * 3600));
        const hours = Math.floor((diffSec % (24 * 3600)) / 3600);
        const minutes = Math.floor((diffSec % 3600) / 60);

        if (months > 0) return `Expiring in ${months}mo${weeks > 0 ? ' ' + weeks + 'w' : ''}`;
        if (weeks > 0) return `Expiring in ${weeks}w${days > 0 ? ' ' + days + 'd' : ''}`;
        if (days > 0) return `Expiring in ${days}d${hours > 0 ? ' ' + hours + 'h' : ''}`;
        if (hours > 0) return `Expiring in ${hours}h${minutes > 0 ? ' ' + minutes + 'm' : ''}`;
        if (minutes > 0) return `Expiring in ${minutes}m`;
        return 'Expiring soon';
    }

    // Get the note url from the path, works for /paste/abc123 or /abc123
    const urlParts = window.location.pathname.split('/');
    let noteUrl = urlParts[urlParts.length - 1];
    if (!noteUrl) noteUrl = urlParts[urlParts.length - 2];

    fetch(`/api/notes/${noteUrl}`)
        .then(res => {
            if (!res.ok) throw new Error('Note not found');
            return res.json();
        })
        .then(note => {
            document.getElementById('note-title').textContent = note.title;
            document.getElementById('note-text').innerHTML = marked.parse(note.text); // use marked to do some markdown stuff

            const meta = [];
            if (note.created_at) {
                meta.push(`<span class="badge created">Created: ${formatDateTime(note.created_at)}</span>`);
            }
            if (note.expires_at) {
                meta.push(`<span class="badge expiring">${getExpiringIn(note.expires_at)}</span>`);
            }
            document.getElementById('note-meta').innerHTML = meta.join('');
        })
        .catch(err => {
            document.getElementById('note').innerHTML = `
                <div style="margin:2em;font-size:1.5em;">
                    <b>Note not found.</b><br>
                    The note may have expired or the link is incorrect.
                </div>
            `;
        });

    // adds the copy button to the page
    const copyBtn = document.getElementById('copy');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href);
            alert('Copied to clipboard!');
        });
    }
});
