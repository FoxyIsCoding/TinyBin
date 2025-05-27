<script lang="ts">
  import { onMount } from 'svelte';
  import '../../app.css';
  import { goto } from '$app/navigation';
  import { API_URL } from '$lib/config';

  let title = '';
  let text = '';
  let expires = '1d';
  let saveBtnDisabled = true;
  let isSaving = false;
  let error = '';

  function toMySQLDateTime(date: Date): string {
    const pad = (num: number): string => String(num).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  function expireSelectionToTime(expireSelection: string): number {
    let expireTime: number;
    switch (expireSelection) {
      case '3h':
        expireTime = 3 * 60 * 60;
        break;
      case '1d':
        expireTime = 24 * 60 * 60;
        break;
      case '1w':
        expireTime = 7 * 24 * 60 * 60;
        break;
      case '1m':
        expireTime = 30 * 24 * 60 * 60;
        break;
      default:
        expireTime = 24 * 60 * 60; // Default to 1 day
    }
    return expireTime;
  }

  async function postNote() {
    if (!title || !text) {
      error = 'Please fill in both title and text fields.';
      return;
    }

    isSaving = true;
    error = '';

    try {
      const convertToTime = expireSelectionToTime(expires) * 1000;
      const expiresAt = toMySQLDateTime(new Date(Date.now() + convertToTime));

      const response = await fetch(`${API_URL}/notes/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, text, expiresAt })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save note');
      }

      const data = await response.json();
      if (data.success && data.data && data.data.url) {
        goto(`/share/${data.data.url}`);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error:', err);
      error = err instanceof Error ? err.message : 'Error saving note. Please try again.';
    } finally {
      isSaving = false;
    }
  }

  function updateSaveButtonState() {
    saveBtnDisabled = !(title.trim() && text.trim());
  }

  $: if (title || text) updateSaveButtonState();
</script>

<div class="editor">
  <input 
    bind:value={title}
    type="text" 
    placeholder="Title" 
  />
  <textarea 
    bind:value={text}
    rows="10" 
    cols="30" 
    placeholder="Note text"
  ></textarea>
</div>

<section class="editor-options glass-card">
  <h3>Expiration:</h3>
  <div class="expiration-options">
    <div class="expiration-radio-group">
      <input type="radio" bind:group={expires} id="3h" value="3h">
      <label for="3h">3h</label>
      <input type="radio" bind:group={expires} id="1d" value="1d">
      <label for="1d">1d</label>
      <input type="radio" bind:group={expires} id="1w" value="1w">
      <label for="1w">7d</label>
      <input type="radio" bind:group={expires} id="1m" value="1m">
      <label for="1m">1m</label>
      <div class="expiration-slider"></div>
    </div>
  </div>
  <div class="buttons">
    {#if error}
      <p class="error">{error}</p>
    {/if}
    <button 
      class="button-46" 
      role="button" 
      on:click={postNote}
      disabled={saveBtnDisabled || isSaving}
    >
      {#if isSaving}
        <i class="fa-solid fa-spinner fa-spin"></i>&nbsp;&nbsp;Saving...
      {:else}
        <i class="fa-solid fa-cloud-arrow-up"></i>&nbsp;&nbsp;<strong>Save</strong>
      {/if}
    </button>
  </div>
</section>

<style>
  .editor {
    display: flex;
    flex-direction: column;
    width: calc(100% - 40px);
    justify-content: center;
    margin: 2rem 0;
  }

  .editor > input, .editor > textarea {
    max-width: 100%;
    width: 100%;
    background-color: rgba(14, 14, 14, 0.26);
    border: 1px solid #2c2c2c;
    padding: 10px;
    border-radius: 10px;
    color: white;
    font-size: 1.1rem;
    font-family: var(--font-family);
  }

  textarea {
    margin-top: 2%;
    height: 60vh;
    resize: none;
  }

  input:focus, textarea:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  .editor-options {
    position: fixed;
    bottom: 0;
    right: 0;
    margin: 20px;
    background: rgba(20, 20, 20, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  }

  .editor-options h3 {
    color: white;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }

  .expiration-options {
    position: relative;
    background: var(--background-input);
    border-radius: 12px;
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    margin-bottom: 1rem;
    width: 100%;
  }

  .expiration-radio-group {
    position: relative;
    display: flex;
    gap: 0.5rem;
    padding: 0.25rem;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .expiration-slider {
    position: absolute;
    top: 0.25rem;
    height: calc(100% - 0.5rem);
    background: var(--primary-color);
    border-radius: 8px;
    z-index: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
  }

  .expiration-radio-group input[type="radio"] {
    display: none;
  }

  .expiration-radio-group label {
    position: relative;
    z-index: 1;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.7);
    transition: all 0.3s ease;
    font-size: 0.9rem;
    min-width: 3rem;
    text-align: center;
    flex: 1;
  }

  .expiration-radio-group input[type="radio"]:checked + label {
    color: white;
    font-weight: 500;
  }

  /* Slider positions - updated for responsive layout */
  .expiration-radio-group input[type="radio"][value="3h"]:checked ~ .expiration-slider {
    left: 0.25rem;
    width: calc(25% - 0.5rem);
  }

  .expiration-radio-group input[type="radio"][value="1d"]:checked ~ .expiration-slider {
    left: calc(25% + 0.25rem);
    width: calc(25% - 0.5rem);
  }

  .expiration-radio-group input[type="radio"][value="1w"]:checked ~ .expiration-slider {
    left: calc(50% + 0.25rem);
    width: calc(25% - 0.5rem);
  }

  .expiration-radio-group input[type="radio"][value="1m"]:checked ~ .expiration-slider {
    left: calc(75% + 0.25rem);
    width: calc(25% - 0.5rem);
  }

  @media (max-width: 768px) {
    .editor-options {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      margin: 0;
      border-radius: 16px 16px 0 0;
      width: 100%;
      padding: 1rem;
    }

    .expiration-radio-group {
      gap: 0.25rem;
    }

    .expiration-radio-group label {
      padding: 0.4rem 0.5rem;
      font-size: 0.8rem;
      min-width: 2.5rem;
    }

    .expiration-slider {
      display: none; /* Hide slider on mobile for better UX */
    }

    .expiration-radio-group input[type="radio"]:checked + label {
      background-color: var(--primary-color);
      color: white;
    }
  }

  @media (max-width: 480px) {
    .editor-options {
      padding: 0.75rem;
    }

    .expiration-radio-group label {
      padding: 0.3rem 0.4rem;
      font-size: 0.75rem;
      min-width: 2rem;
    }
  }

  .buttons {
    margin-top: 0.5rem;
  }

  .error {
    color: #ff4444;
    text-align: center;
    margin-bottom: 0.5rem;
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
    max-width: 100%;
    padding: 14px 22px;
    text-decoration: none;
    transition: all 0.3s ease;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    width: 100%;
  }

  .button-46:disabled {
    background-color: rgba(236, 225, 225, 0.1);
    filter: brightness(0.5);
    color: rgba(150, 150, 150, 0.5);
    cursor: not-allowed;
  }

  .button-46:not(:disabled):hover {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.2);
  }

  .button-46:not(:disabled):active {
    transform: translateY(0);
  }
</style> 