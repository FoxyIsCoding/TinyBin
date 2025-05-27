<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import '../../../app.css';
  import QRCodeStyling from 'qr-code-styling';
  import { API_URL } from '$lib/config';

  let note: { title: string; text: string; expiresAt: string; url: string } | null = null;
  let loading = true;
  let error = '';
  let shareLink = '';
  let qrCode: QRCodeStyling;

  onMount(async () => {
    try {
      const response = await fetch(`${API_URL}/notes/${$page.params.id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          note = data.data;
          if (note && note.url) {
            shareLink = `${window.location.origin}/view/${note.url}`;
            
            // Initialize QR Code
            qrCode = new QRCodeStyling({
              width: 150,
              height: 150,
              data: shareLink,
              dotsOptions: {
                color: "#ffffff",
                type: "rounded"
              },
              backgroundOptions: {
                color: "#121212"
              },
              cornersSquareOptions: {
                type: "extra-rounded"
              }
            });

            // Wait for the canvas to be available
            setTimeout(() => {
              const canvas = document.getElementById('qr-canvas');
              if (canvas) {
                qrCode.append(canvas);
              }
            }, 0);
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

  function copyToClipboard() {
    navigator.clipboard.writeText(shareLink).then(() => {
      alert('Link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }

  function openNote() {
    goto(shareLink);
  }
</script>

<svelte:head>
  <script src="https://unpkg.com/qr-code-styling@1.5.0/lib/qr-code-styling.js"></script>
</svelte:head>

<div class="share">
  {#if loading}
    <p>Loading...</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else if note}
    <div class="success-message">
      <i class="fa-regular fa-circle-check fa-2xl"></i>
      <h2>Note Created!</h2>
      <p>Your note has been successfully created. You can share it with others using the link below.</p>
    </div>

    <div class="share-container">
      <div class="links">
        <p>Share your note with the following link:</p>
        <input type="text" readonly value={shareLink} />
        <div class="buttons">
          <button class="button-46" on:click={copyToClipboard}>
            <i class="fa-solid fa-copy"></i>&nbsp;&nbsp;COPY
          </button>
          <button class="button-46" on:click={openNote}>OPEN</button>
        </div>
      </div>

      <div class="qr">
        <p>Scan the QR code to view your note:</p>
        <div id="qr-canvas" style="width: 150px; height: 150px;"></div>
      </div>
    </div>
  {/if}
</div>

<style>
  .share {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    min-height: calc(100vh - 4rem);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .success-message {
    text-align: center;
    margin-bottom: 2.5rem;
    animation: fadeIn 0.5s ease-out;
  }

  .success-message i {
    color: var(--primary-color);
    margin-bottom: 1.5rem;
    font-size: 3rem;
  }

  .success-message h2 {
    font-size: 2rem;
    margin-bottom: 0.75rem;
    background: linear-gradient(135deg, var(--primary-color), #4a90e2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 600;
  }

  .success-message p {
    color: #b0b0b0;
    font-size: 1.1rem;
    line-height: 1.6;
  }

  .share-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    animation: slideUp 0.5s ease-out;
  }

  .links {
    background: rgba(20, 20, 20, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .links:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  }

  .links p {
    margin-bottom: 1.25rem;
    font-size: 1.1rem;
    color: #e0e0e0;
  }

  .links input {
    width: 100%;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    color: white;
    margin-bottom: 1.5rem;
    font-size: 1rem;
    transition: border-color 0.3s ease;
  }

  .links input:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  .qr {
    background: rgba(20, 20, 20, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .qr:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  }

  .qr p {
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
    color: #e0e0e0;
  }

  #qr-canvas {
    display: inline-block;
    padding: 1.25rem;
    background: rgba(255, 255, 255, 0);
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0);
  }

  .buttons {
    display: flex;
    gap: 1rem;
  }

  .button-46 {
    flex: 1;
    align-items: center;
    background-color: rgba(26, 26, 26, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    box-sizing: border-box;
    color: #ffffff;
    cursor: pointer;
    display: flex;
    font-family: var(--font-family);
    font-size: 1rem;
    font-weight: 500;
    justify-content: center;
    line-height: 1.5;
    padding: 1rem 1.5rem;
    text-decoration: none;
    transition: all 0.3s ease;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
  }

  .button-46:hover {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.2);
  }

  .button-46:active {
    transform: translateY(0);
  }

  .error {
    color: #ff4444;
    text-align: center;
    font-size: 1.2rem;
    padding: 2rem;
    background: rgba(255, 68, 68, 0.1);
    border-radius: 12px;
    border: 1px solid rgba(255, 68, 68, 0.2);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (min-width: 768px) {
    .share-container {
      flex-direction: row;
    }

    .links, .qr {
      flex: 1;
    }
  }

  @media (max-width: 480px) {
    .share {
      padding: 1rem;
    }

    .success-message h2 {
      font-size: 1.75rem;
    }

    .success-message p {
      font-size: 1rem;
    }

    .links, .qr {
      padding: 1.5rem;
    }

    .buttons {
      flex-direction: column;
    }
  }

  .options-container,
  .radio-group,
  .slider,
  .expiration-selector,
  .expiration-options,
  .expiration-radio-group,
  .expiration-slider {
    display: none;
  }
</style> 