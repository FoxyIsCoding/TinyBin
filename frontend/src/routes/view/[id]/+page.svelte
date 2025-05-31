<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import '../../../app.css';
  import 'highlight.js/styles/github-dark.css';
  import { marked } from 'marked';
  import { API_URL } from '$lib/config';
  import hljs from 'highlight.js';

  let note: { 
    title: string; 
    text: string; 
    expires_at: string; 
    created_at: string;
    url: string;
    language?: string;
  } | null = null;
  let loading = true;
  let error = '';
  let renderedContent = '';
  let copySuccess = false;
  let timeLeft = '';
  let detectedLanguage = '';

  function detectLanguage(text: string): string {
    // First try to detect the language using highlight.js
    const result = hljs.highlightAuto(text);
    if (result.language) {
      return result.language;
    }

    // If no language detected, try to detect based on file extensions in the text
    const extensionPatterns = {
      'javascript': /\.(js|jsx|mjs)$/i,
      'typescript': /\.(ts|tsx)$/i,
      'python': /\.(py|pyw)$/i,
      'java': /\.(java|class)$/i,
      'csharp': /\.(cs)$/i,
      'cpp': /\.(cpp|cxx|cc|hpp|hxx|hh)$/i,
      'php': /\.(php|phtml)$/i,
      'ruby': /\.(rb|ruby)$/i,
      'go': /\.(go)$/i,
      'rust': /\.(rs)$/i,
      'html': /\.(html|htm)$/i,
      'css': /\.(css)$/i,
      'sql': /\.(sql)$/i,
      'json': /\.(json)$/i,
      'yaml': /\.(yaml|yml)$/i,
      'xml': /\.(xml)$/i,
      'markdown': /\.(md|markdown)$/i
    };

    for (const [lang, pattern] of Object.entries(extensionPatterns)) {
      if (pattern.test(text)) {
        return lang;
      }
    }

    if (text.includes('<?php')) return 'php';
    if (text.includes('<!DOCTYPE html>') || text.includes('<html')) return 'html';
    if (text.includes('import React') || text.includes('from "react"')) return 'javascript';
    if (text.includes('import {') && text.includes('} from')) return 'typescript';
    if (text.includes('def ') && text.includes(':')) return 'python';
    if (text.includes('public class')) return 'java';
    if (text.includes('namespace')) return 'csharp';
    if (text.includes('#include')) return 'cpp';
    if (text.includes('package main')) return 'go';
    if (text.includes('fn ')) return 'rust';
    if (text.includes('SELECT') && text.includes('FROM')) return 'sql';
    if (text.includes('{') && text.includes('}') && text.includes('"')) return 'json';
    if (text.includes('---') && text.includes(':')) return 'yaml';

    return 'plaintext';
  }

  function formatCode(text: string, language: string): string {
    try {
      if (language === 'markdown') {
        return marked.parse(text, { async: false }) as string;
      }
      
      const highlighted = hljs.highlight(text, { language }).value;
      return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
    } catch (err) {
      console.error('Error highlighting code:', err);
      return `<pre><code>${text}</code></pre>`;
    }
  }

  onMount(async () => {
    try {
      const response = await fetch(`${API_URL}/notes/${$page.params.id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          note = data.data;
          if (note) {
            detectedLanguage = detectLanguage(note.text);
            renderedContent = formatCode(note.text, detectedLanguage);
            updateTimeLeft();
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

<div class="container">
  {#if loading}
    <div class="loading glass-card">
      <i class="fa-solid fa-spinner fa-spin fa-2xl"></i>
      <p>Loading...</p>
    </div>
  {:else if error}
    <div class="error-container glass-card">
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
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
    min-height: 100vh;
  }

  .loading, .error-container {
    text-align: center;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .loading i, .error-container i {
    color: var(--primary-color);
  }

  .error-container i {
    color: var(--error-color);
  }

  .note {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .note-header {
    border-bottom: 1px solid var(--card-border);
    padding-bottom: 1.5rem;
  }

  .title-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  h1 {
    font-size: 1.75rem;
    color: var(--text-primary);
    margin: 0;
    font-weight: 600;
  }

  .meta-info {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    color: var(--text-secondary);
    font-size: 0.875rem;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .meta-item i {
    color: var(--primary-color);
    font-size: 0.875rem;
  }

  .link-button {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: color 0.2s ease;
  }

  .link-button:hover {
    color: var(--primary-color);
  }

  .content {
    color: var(--text-primary);
    line-height: 1.6;
    font-size: 1rem;
    overflow-wrap: break-word;
  }

  .content :global(h1) {
    font-size: 1.75rem;
    margin: 1.5rem 0 1rem;
  }

  .content :global(h2) {
    font-size: 1.5rem;
    margin: 1.25rem 0 0.75rem;
  }

  .content :global(h3) {
    font-size: 1.25rem;
    margin: 1rem 0 0.5rem;
  }

  .content :global(p) {
    margin: 0.75rem 0;
  }

  .content :global(ul), .content :global(ol) {
    margin: 0.75rem 0;
    padding-left: 1.5rem;
  }

  .content :global(li) {
    margin: 0.25rem 0;
  }

  .content :global(code) {
    background: var(--card-background);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-size: 0.875rem;
    font-family: var(--font-mono);
  }

  .content :global(pre) {
    background: var(--card-background);
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1rem 0;
  }

  .content :global(pre code) {
    background: none;
    padding: 0;
    font-size: 0.875rem;
  }

  .content :global(blockquote) {
    border-left: 4px solid var(--primary-color);
    margin: 1rem 0;
    padding: 0.5rem 0 0.5rem 1rem;
    color: var(--text-secondary);
  }

  .content :global(a) {
    color: var(--primary-color);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .content :global(a:hover) {
    text-decoration: underline;
  }

  .content :global(img) {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 1rem 0;
  }

  .content :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
  }

  .content :global(th), .content :global(td) {
    border: 1px solid var(--card-border);
    padding: 0.5rem;
    text-align: left;
  }

  .content :global(th) {
    background: var(--card-background);
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem 0.5rem;
    }

    .note {
      padding: 1rem;
    }

    .meta-info {
      gap: 1rem;
    }

    h1 {
      font-size: 1.5rem;
    }

    .content :global(h1) {
      font-size: 1.5rem;
    }

    .content :global(h2) {
      font-size: 1.25rem;
    }

    .content :global(h3) {
      font-size: 1.1rem;
    }
  }
</style> 