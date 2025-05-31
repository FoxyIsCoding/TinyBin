<script>
  import { onMount } from "svelte";
  import { API_URL } from '$lib/config';

  let commit = "";
  let isLoading = true;

  onMount(async () => {
    try {
      const response = await fetch(`${API_URL}/commit`);
      const data = await response.json();
      commit = data.commit;
    } catch (error) {
      console.error("Failed to fetch commit hash:", error);
    } finally {
      isLoading = false;
    }
  });
</script>

<div class="home">
  <section class="hero glass-card">
    <h1 class="text-gradient">TinyBin</h1>
    <p class="subtitle">Share code snippets instantly, securely, and elegantly.</p>
    <div class="cta-buttons">
      <a href="/editor" class="button-46">
        <i class="fas fa-plus"></i>
        New Paste
      </a>
      <a href="/about" class="button-46">
        <i class="fas fa-info-circle"></i>
        Learn More
      </a>
    </div>
  </section>

  <section class="features">
    <div class="feature-card glass-card">
      <i class="fas fa-bolt"></i>
      <h3>Lightning Fast</h3>
      <p>Share your code instantly with a simple, clean interface.</p>
    </div>
    <div class="feature-card glass-card">
      <i class="fas fa-shield-alt"></i>
      <h3>Secure</h3>
      <p>Your code is encrypted and automatically expires when you want.</p>
    </div>
    <div class="feature-card glass-card">
      <i class="fas fa-mobile-alt"></i>
      <h3>Mobile Friendly</h3>
      <p>Works perfectly on any device, from desktop to mobile.</p>
    </div>
  </section>

  <section class="support glass-card">
    <div class="support-content">
      <h2>Support TinyBin</h2>
      <p>If you find TinyBin useful, consider supporting its development.</p>
      <a href="https://ko-fi.com/foxyk" target="_blank" rel="noopener noreferrer" class="button-46">
        <i class="fas fa-heart"></i>
        Support on Ko-fi
      </a>
    </div>
  </section>

  <footer class="footer">
    <div class="footer-content">
      <div class="footer-links">
        <a href="/about">About</a>
        <a href="https://github.com/foxyiscoding/tinybin" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://ko-fi.com/foxyk" target="_blank" rel="noopener noreferrer">Support</a>
      </div>
      {#if !isLoading && commit}
        <a href="https://github.com/foxyiscoding/tinybin/commit/{commit}" target="_blank" rel="noopener noreferrer" class="commit-link">
          <i class="fab fa-github"></i>
          {commit}
        </a>
      {/if}
    </div>
  </footer>
</div>

<style>
  .home {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-unit);
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing-unit) * 2);
  }

  .hero {
    text-align: center;
    padding: calc(var(--spacing-unit) * 3) var(--spacing-unit);
    margin-top: calc(var(--spacing-unit) * 2);
  }

  .subtitle {
    font-size: 1.25rem;
    color: var(--text-secondary);
    margin-bottom: calc(var(--spacing-unit) * 2);
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .cta-buttons {
    display: flex;
    gap: var(--spacing-unit);
    justify-content: center;
    flex-wrap: wrap;
  }

  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: calc(var(--spacing-unit) * 2);
    margin: calc(var(--spacing-unit) * 2) 0;
  }

  .feature-card {
    text-align: center;
    padding: calc(var(--spacing-unit) * 2);
  }

  .feature-card i {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: var(--spacing-unit);
  }

  .feature-card h3 {
    margin-bottom: calc(var(--spacing-unit) * 0.5);
    font-size: 1.5rem;
  }

  .support {
    margin: calc(var(--spacing-unit) * 2) 0;
    text-align: center;
    padding: calc(var(--spacing-unit) * 3) var(--spacing-unit);
  }

  .support h2 {
    margin-bottom: var(--spacing-unit);
    font-size: 2rem;
  }

  .support p {
    margin-bottom: calc(var(--spacing-unit) * 2);
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  .footer {
    margin-top: auto;
    padding: calc(var(--spacing-unit) * 2) 0;
    border-top: 1px solid var(--border-color);
  }

  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--spacing-unit);
  }

  .footer-links {
    display: flex;
    gap: calc(var(--spacing-unit) * 1.5);
    flex-wrap: wrap;
  }

  .footer-links a {
    color: var(--text-secondary);
    transition: color var(--transition-speed) ease;
  }

  .footer-links a:hover {
    color: var(--text-primary);
  }

  .commit-link {
    color: var(--text-secondary);
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: color var(--transition-speed) ease;
  }

  .commit-link:hover {
    color: var(--text-primary);
  }

  @media (max-width: 768px) {
    .hero {
      padding: calc(var(--spacing-unit) * 2) var(--spacing-unit);
      margin-top: var(--spacing-unit);
    }

    .cta-buttons {
      flex-direction: column;
    }

    .cta-buttons .button-46 {
      width: 100%;
    }

    .footer-content {
      flex-direction: column;
      text-align: center;
    }

    .footer-links {
      justify-content: center;
    }

    .feature-card {
      padding: calc(var(--spacing-unit) * 1.5);
    }
  }
</style>
