<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import '../../../app.css';
  import { marked } from 'marked';

  let note: { title: string; text: string; expiresAt: string; createdAt: string } | null = null;
  let loading = true;
  let error = '';
  let renderedContent = '';
  let copySuccess = false;
  let timeLeft = '';

  onMount(async () => {
    try {
      const response = await fetch(`/api/notes/${$page.params.id}`);
      if (response.ok) {
        note = await response.json();
        if (note) {
          renderedContent = marked.parse(note.text, { async: false }) as string;
          updateTimeLeft();
          // Update time left every minute
          setInterval(updateTimeLeft, 60000);
        }
      } else {
        error = 'Note not found or has expired';
      }
    } catch (err) {
      error = 'Error loading note';
      console.error(err);
    } finally {
      loading = false;
    }
  });

  function updateTimeLeft() {
    if (!note) return;
    const now = new Date();
    const expires = new Date(note.expiresAt);
    const diff = expires.getTime() - now.getTime();
    
    if (diff <= 0) {
      timeLeft = 'Expired';
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      timeLeft = `Expires in ${hours}h ${minutes}m`;
    } else {
      timeLeft = `Expires in ${minutes}m`;
    }
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
              Created: {new Date(note.createdAt).toLocaleString()}
            </div>
            <div class="meta-item">
              <i class="fa-regular fa-clock"></i>
              {timeLeft}
            </div>
          </div>
        </div>
        <button class="button-46" on:click={copyUrl}>
          {#if copySuccess}
            <i class="fa-solid fa-check"></i>&nbsp;&nbsp;COPIED!
          {:else}
            <i class="fa-solid fa-copy"></i>&nbsp;&nbsp;COPY URL
          {/if}
        </button>
      </div>
      <div class="content">{@html renderedContent}</div>
    </div>
  {/if}
</div>

<style>
  .view {
    max-width: 800px;
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

  .content {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 1.5rem;
    color: white;
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

  .button-46 {
    align-items: center;
    background-color: rgba(26, 26, 26, 0.26);
    border: 1px solid #2c2c2c;
    border-radius: 16px;
    box-sizing: border-box;
    color: #ffffff;
    cursor: pointer;
    display: flex;
    font-family: var(--font-family);
    font-size: 18px;
    justify-content: center;
    line-height: 28px;
    padding: 14px 22px;
    text-decoration: none;
    transition: all 0.3s ease;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
  }

  .button-46:hover {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.2);
  }

  .button-46:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    .view {
      padding: 1rem;
    }

    .note {
      padding: 1.5rem;
    }

    .meta-info {
      flex-direction: column;
      gap: 0.5rem;
    }

    .button-46 {
      width: 100%;
    }
  }
</style> 