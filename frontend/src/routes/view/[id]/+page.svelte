<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import '../../../app.css';
  import { marked } from 'marked';

  let note: { 
    title: string; 
    text: string; 
    expires_at: string; 
    created_at: string;
    url: string;
  } | null = null;
  let loading = true;
  let error = '';
  let renderedContent = '';
  let copySuccess = false;
  let timeLeft = '';

  onMount(async () => {
    try {
      const response = await fetch(`/api/notes/${$page.params.id}`);
      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data);
        if (data.success && data.data) {
          note = data.data;
          console.log('Note data:', note);
          if (note) {
            renderedContent = marked.parse(note.text, { async: false }) as string;
            updateTimeLeft();
            // Update time left every second
            setInterval(updateTimeLeft, 1000);
          }
        } else {
          error = 'Invalid response format';
        }
      } else {
        const errorData = await response.json();
        error = errorData.message || 'Note not found or has expired';
      }
    } catch (err) {
      error = 'Error loading note';
      console.error(err);
    } finally {
      loading = false;
    }
  });

  function formatDate(dateString: string): string {
    console.log('Formatting date:', dateString);
    try {
      const date = new Date(dateString);
      console.log('Parsed date:', date);
      if (isNaN(date.getTime())) {
        console.log('Invalid date detected');
        return 'Invalid Date';
      }
      const formatted = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      console.log('Formatted date:', formatted);
      return formatted;
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid Date';
    }
  }

  function updateTimeLeft() {
    if (!note || !note.expires_at) {
      timeLeft = 'No expiration';
      return;
    }

    try {
      const now = new Date();
      const expires = new Date(note.expires_at);
      
      if (isNaN(expires.getTime())) {
        timeLeft = 'Invalid expiration date';
        return;
      }

      const diff = expires.getTime() - now.getTime();
      
      if (diff <= 0) {
        timeLeft = 'Expired';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      if (days > 0) {
        timeLeft = `Expires in ${days}d ${hours}h`;
      } else if (hours > 0) {
        timeLeft = `Expires in ${hours}h ${minutes}m`;
      } else if (minutes > 0) {
        timeLeft = `Expires in ${minutes}m ${seconds}s`;
      } else {
        timeLeft = `Expires in ${seconds}s`;
      }
    } catch (err) {
      console.error('Error calculating time left:', err);
      timeLeft = 'Error calculating expiration';
    }
  }

  function getLineCount(text: string): number {
    return text.split('\n').length;
  }

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      copySuccess = true;
      setTimeout(() => {
        copySuccess = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      error = 'Failed to copy URL to clipboard';
    }
  }
</script>

<svelte:head>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
</svelte:head>

<div class="view">
  {#if loading}
    <div class="loading">
      <i class="fa-solid fa-spinner fa-spin fa-2xl"></i>
      <p>Loading...</p>
    </div>
  {:else if error}
    <div class="error-container">
      <i class="fa-solid fa-circle-exclamation fa-2xl"></i>
      <p class="error">{error}</p>
    </div>
  {:else if note}
    <div class="note glass-card">
      <div class="note-header">
        <div class="title-section">
          <h1>{note.title}</h1>
          <div class="meta-info">
            <div class="meta-item">
              <i class="fa-regular fa-calendar"></i>
              Created: {formatDate(note.created_at)}
            </div>
            <div class="meta-item">
              <i class="fa-regular fa-clock"></i>
              {timeLeft}
            </div>
            <div class="meta-item">
              <i class="fa-solid fa-link"></i>
              <button class="link-button" on:click={copyUrl}>
                {#if copySuccess}
                  <i class="fa-solid fa-check"></i> Copied!
                {:else}
                  Copy URL
                {/if}
              </button>
            </div>
            <div class="meta-item">
              <i class="fa-solid fa-code"></i>
              {getLineCount(note.text)} lines
            </div>
          </div>
        </div>
      </div>
      <div class="content">{@html renderedContent}</div>
    </div>
  {/if}
</div>

<style>
  .view {
    max-width: 100%;
    margin: 0 auto;
    padding: 2rem;
  }

  .loading, .error-container {
    text-align: center;
    margin: 2rem 0;
  }

  .loading i, .error-container i {
    margin-bottom: 1rem;
  }

  .error-container i {
    color: #ff4444;
  }

  .note {
    padding: 2rem;
    height: calc(100vh - 4rem);
    display: flex;
    flex-direction: column;
  }

  .note-header {
    margin-bottom: 2rem;
  }

  .title-section {
    margin-bottom: 1rem;
  }

  h1 {
    font-size: 2rem;
    color: white;
    margin: 0 0 1rem 0;
  }

  .meta-info {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .meta-item i {
    color: var(--primary-color);
  }

  .link-button {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .link-button:hover {
    color: var(--primary-color);
  }

  .content {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 1.5rem;
    color: white;
    flex: 1;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--primary-color) rgba(0, 0, 0, 0.3);
  }

  .content::-webkit-scrollbar {
    width: 8px;
  }

  .content::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
  }

  .content::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 4px;
    border: 2px solid rgba(0, 0, 0, 0.3);
  }

  .content::-webkit-scrollbar-thumb:hover {
    background: #4a90e2;
  }

  .content :global(p) {
    margin: 0 0 1rem 0;
    line-height: 1.6;
  }

  .content :global(pre) {
    background: rgba(0, 0, 0, 0.2);
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1rem 0;
    scrollbar-width: thin;
    scrollbar-color: var(--primary-color) rgba(0, 0, 0, 0.2);
  }

  .content :global(pre::-webkit-scrollbar) {
    height: 8px;
  }

  .content :global(pre::-webkit-scrollbar-track) {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  .content :global(pre::-webkit-scrollbar-thumb) {
    background: var(--primary-color);
    border-radius: 4px;
    border: 2px solid rgba(0, 0, 0, 0.2);
  }

  .content :global(pre::-webkit-scrollbar-thumb:hover) {
    background: #4a90e2;
  }

  .content :global(code) {
    font-family: monospace;
  }

  .content :global(blockquote) {
    border-left: 4px solid var(--primary-color);
    margin: 1rem 0;
    padding: 0.5rem 0 0.5rem 1rem;
    color: #b0b0b0;
  }

  .content :global(a) {
    color: var(--primary-color);
    text-decoration: none;
  }

  .content :global(a:hover) {
    text-decoration: underline;
  }

  .content :global(ul), .content :global(ol) {
    margin: 1rem 0;
    padding-left: 2rem;
  }

  .content :global(li) {
    margin: 0.5rem 0;
  }

  .error {
    color: #ff4444;
    text-align: center;
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    .view {
      padding: 1rem;
    }

    .note {
      padding: 1.5rem;
      height: calc(100vh - 2rem);
    }

    .meta-info {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style> 