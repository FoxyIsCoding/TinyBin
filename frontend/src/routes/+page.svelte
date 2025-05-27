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
  <section class="hero">
    <h1 class="text-gradient">TinyBin</h1>
    <p class="subtitle">Share code snippets instantly, securely, and elegantly.</p>
    <div class="cta-buttons">
      <a href="/editor" class="button-46">
        <i class="fas fa-plus"></i>&nbsp;
        New Paste
      </a>
      <a href="/about" class="button-46">
        <i class="fas fa-info-circle"></i>&nbsp;
        Learn More
      </a>
    </div>
  </section>

  <section class="features">
    <div class="feature-card">
      <i class="fas fa-bolt"></i>
      <h3>Lightning Fast</h3>
      <p>Share your code instantly with a simple, clean interface.</p>
    </div>
    <div class="feature-card">
      <i class="fas fa-shield-alt"></i>
      <h3>Secure</h3>
      <p>Your code is encrypted and automatically expires when you want.</p>
    </div>
    <div class="feature-card">
      <i class="fas fa-mobile-alt"></i>
      <h3>Mobile Friendly</h3>
      <p>Works perfectly on any device, from desktop to mobile.</p>
    </div>
  </section>

  <section class="support">
    <div class="support-content">
      <h2>Support TinyBin</h2>
      <p>If you find TinyBin useful, consider supporting its development.</p>
      <a href="https://ko-fi.com/foxyiscoding" target="_blank" rel="noopener noreferrer" class="button-46">
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
        <a href="https://ko-fi.com/foxyiscoding" target="_blank" rel="noopener noreferrer">Support</a>
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
    padding: 0 1rem;
  }

  .hero {
    text-align: center;
    padding: 4rem 0;
  }

  h1 {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .subtitle {
    font-size: 1.25rem;
    color: var(--text-secondary);
    margin-bottom: 2rem;
  }

  .cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin: 4rem 0;
  }

  .feature-card {
    background: var(--background-secondary);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 2rem;
    text-align: center;
    transition: transform 0.3s ease;
  }

  .feature-card:hover {
    transform: translateY(-5px);
  }

  .feature-card i {
    font-size: 2rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  .feature-card h3 {
    margin-bottom: 0.5rem;
  }

  .support {
    margin: 4rem 0;
    text-align: center;
  }

  .support-content {
    background: var(--background-secondary);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 3rem 2rem;
  }

  .support h2 {
    margin-bottom: 1rem;
  }

  .support p {
    margin-bottom: 2rem;
  }

  .footer {
    margin-top: 4rem;
    padding: 2rem 0;
    border-top: 1px solid var(--border-color);
  }

  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .footer-links {
    display: flex;
    gap: 1.5rem;
  }

  .footer-links a {
    color: var(--text-secondary);
    transition: color 0.3s ease;
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
  }

  .commit-link:hover {
    color: var(--text-primary);
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 3rem;
    }

    .cta-buttons {
      flex-direction: column;
    }

    .footer-content {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .footer-links {
      justify-content: center;
    }
  }
</style>
