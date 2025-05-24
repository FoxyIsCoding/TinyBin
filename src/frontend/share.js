document.addEventListener('DOMContentLoaded', () => {
        // Get the current URL and replace /share/ with /paste/
        const shareInput = document.getElementById('shareLink');
        const url = new URL(window.location.href);
        const pasteUrl = url.href.replace('/share/', '/paste/');
        shareInput.value = pasteUrl;

        // Copy button functionality
        document.getElementById('copyBtn').addEventListener('click', () => {
            shareInput.select();
            shareInput.setSelectionRange(0, 99999); // For mobile devices
            navigator.clipboard.writeText(shareInput.value);
            // Optional: show feedback
            document.getElementById('copyBtn').textContent = 'COPIED!';
            setTimeout(() => {
                document.getElementById('copyBtn').textContent = 'COPY';
            }, 1200);
        });

        document.getElementById('openBtn').addEventListener('click', async () => {
            window.location.href = pasteUrl;
        }
        );
        
        
});
