<script>
  let title = 'Welcome to PasteFox';
</script>

<div class="home">
  <div class="hero">
    <h1>Share Your Code & Notes Instantly</h1>
    <p class="description">A modern, minimal, and ad-free pastebin for your notes and code.</p>
    <div class="cta-buttons">
      <a href="/editor" class="button-46">
        <i class="fas fa-plus"></i>
        <span>New Paste</span>
      </a>
      <a href="/about" class="button-46 secondary">
        <i class="fas fa-info-circle"></i>
        <span>Learn More</span>
      </a>
    </div>
  </div>
  
  <div class="features">
    <div class="feature-card glass-card">
      <i class="fas fa-bolt"></i>
      <h3>Lightning Fast</h3>
      <p>Share your code and notes instantly with a clean, modern interface.</p>
    </div>
    <div class="feature-card glass-card">
      <i class="fas fa-shield-alt"></i>
      <h3>Secure</h3>
      <p>Your data is encrypted and automatically expires after your chosen time.</p>
    </div>
    <div class="feature-card glass-card">
      <i class="fas fa-mobile-alt"></i>
      <h3>Mobile Friendly</h3>
      <p>Works perfectly on all devices, from desktop to mobile.</p>
    </div>
  </div>

  <div class="support-section glass-card">
    <h2>Support the Project</h2>
    <p>If you like PasteFox, consider supporting me on Ko-fi to keep it ad-free and open source!</p>
    <a href="https://ko-fi.com/foxyk" target="_blank" rel="noopener noreferrer" class="kofi-button">
      <i class="fas fa-heart"></i>
      Support on Ko-fi
    </a>
  </div>

  <div class="github-section glass-card">
    <h2>Open Source</h2>
    <p>PasteFox is open source and available on GitHub.</p>
    <a href="https://github.com/FoxyIsCoding/TinyBin/tree/main" target="_blank" rel="noopener noreferrer" class="github-button">
      <i class="fab fa-github"></i>
      View on GitHub
    </a>
  </div>
</div>

<style>
  .home {
    text-align: center;
    padding: 4rem 0;
    animation: fadeIn 0.5s ease-out;
  }

  .hero {
    margin-bottom: 4rem;
  }

  h1 {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
  }

  p {
    font-size: 1.2rem;
    color: var(--text-secondary);
    margin-bottom: 2rem;
  }

  .cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
  }

  .button.secondary {
    background: transparent;
    border: 1px solid var(--primary-color);
  }

  .button.secondary:hover {
    background: rgba(74, 144, 226, 0.1);
  }

  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    padding: 0 1rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .feature-card {
    padding: 2rem;
    text-align: center;
    transition: transform 0.3s ease;
  }

  .feature-card i {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  .feature-card h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .feature-card p {
    font-size: 1rem;
    margin: 0;
  }

  .support-section, .github-section {
    text-align: center;
    padding: 2rem;
    margin: 2rem auto;
    max-width: 600px;
  }

  .support-section h2, .github-section h2 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  .support-section p, .github-section p {
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
  }

  .kofi-button, .github-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s ease;
    text-decoration: none;
  }

  .kofi-button {
    background: #ff5e5b;
    color: white;
  }

  .kofi-button:hover {
    background: #ff4444;
    transform: translateY(-2px);
  }

  .github-button {
    background: #24292e;
    color: white;
  }

  .github-button:hover {
    background: #1b1f23;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2.5rem;
    }

    .cta-buttons {
      flex-direction: column;
    }

    .features {
      grid-template-columns: 1fr;
    }

    .support-section, .github-section {
      margin: 1rem;
      padding: 1.5rem;
    }
  }
</style>
