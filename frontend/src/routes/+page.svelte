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

<div class="landing">
  <section class="hero glass-card">
    <h1 class="hero-title gradient-glow">Paste. Share. Forget.</h1>
    <p class="hero-subtitle">Ultra-minimal, secure, and instant code sharing. No sign up. No clutter. Just paste and go.</p>
    <div class="cta-row">
      <a href="/editor" class="button-46 cta-main">New Paste</a>
      <a href="/about" class="button-46 cta-secondary">Learn More</a>
    </div>
    <div class="hero-visual">
      <pre class="code-demo"><code>// Paste your code here
console.log('Hello, TinyBin!');
      </code></pre>
    </div>
  </section>

  <section class="features-row">
    <div class="feature glass-card">
      <i class="fas fa-bolt"></i>
      <h3>Instant</h3>
      <p>Share code in seconds. No login, no hassle.</p>
    </div>
    <div class="feature glass-card">
      <i class="fas fa-lock"></i>
      <h3>Private</h3>
      <p>Your pastes are encrypted and can auto-expire.</p>
    </div>
    <div class="feature glass-card">
      <i class="fas fa-mobile-alt"></i>
      <h3>Responsive</h3>
      <p>Works beautifully on any device, dark or light.</p>
    </div>
  </section>

  <footer class="footer">
    <div class="footer-links">
      <a href="/about">About</a>
      <a href="https://github.com/foxyiscoding/tinybin" target="_blank" rel="noopener noreferrer">GitHub</a>
      <a href="https://ko-fi.com/foxyk" target="_blank" rel="noopener noreferrer">Support</a>
    </div>
    {#if !isLoading && commit}
      <div class="commit-link">
        <a href="https://github.com/foxyiscoding/tinybin/commit/{commit}" target="_blank" rel="noopener noreferrer">
          <i class="fab fa-github"></i>
          {commit}
        </a>
      </div>
    {/if}
  </footer>
</div>

<style>
.landing {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  padding: 0 1rem;
}

.hero {
  width: 100%;
  max-width: 1400px;
  margin: 3rem auto 0 auto;
  text-align: center;
  padding: 6rem 7rem 5rem 7rem;
  position: relative;
  overflow: hidden;
  border-radius: var(--border-radius);
  border: 1px solid var(--card-border);
  background: var(--card-background);
  box-shadow: 0 4px 32px 0 rgba(0,0,0,0.18);
  backdrop-filter: blur(18px) saturate(120%);
  animation: fadeIn 0.8s cubic-bezier(.4,0,.2,1);
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  margin-bottom: 1.2rem;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.gradient-glow {
  background: linear-gradient(90deg, #fff, #b3b3b3 60%, #fff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 3px #fff6);
  animation: glow 2.5s ease-in-out infinite alternate;
}

@keyframes glow {
  from { filter: drop-shadow(0 0 2px #fff3); }
  to { filter: drop-shadow(0 0 6px #fff6); }
}

.hero-subtitle {
  color: var(--text-secondary);
  font-size: 1.25rem;
  margin-bottom: 2.2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.cta-row {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2.2rem;
  flex-wrap: wrap;
}

.cta-main {
  font-size: 1.1rem;
  font-weight: 700;
  padding: 0.9rem 2.2rem;
  border-radius: 8px;
  background: #fff;
  color: #111;
  border: none;
  box-shadow: 0 0 16px 2px rgba(255,255,255,0.10);
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
}
.cta-main:hover {
  background: #eaeaea;
  color: #000;
  box-shadow: 0 0 24px 4px rgba(255,255,255,0.18);
}

.cta-secondary {
  font-size: 1.1rem;
  font-weight: 500;
  padding: 0.9rem 2.2rem;
  border-radius: 8px;
  background: transparent;
  color: #fff;
  border: 1px solid #fff3;
  box-shadow: none;
  transition: background 0.18s, color 0.18s, border 0.18s;
}
.cta-secondary:hover {
  background: #181819;
  color: #fff;
  border: 1px solid #fff;
}

.hero-visual {
  margin-top: 2.5rem;
  display: flex;
  justify-content: center;
}
.code-demo {
  background: #181819;
  color: #fff;
  font-family: var(--font-mono);
  font-size: 1.1rem;
  border-radius: 8px;
  padding: 1.2rem 1.5rem;
  box-shadow: 0 0 16px 2px rgba(255,255,255,0.08);
  border: 1px solid #232326;
  min-width: 420px;
  max-width: 900px;
  overflow-x: auto;
  opacity: 0.98;
  transition: box-shadow 0.2s;
}
.code-demo:hover {
  box-shadow: 0 0 32px 4px rgba(255,255,255,0.16);
}

.features-row {
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2.2rem;
  margin-bottom: 2rem;
}

.feature {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.2rem 1.2rem 2rem 1.2rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--card-border);
  background: var(--card-background);
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.18);
  backdrop-filter: blur(12px) saturate(120%);
  transition: box-shadow 0.2s, border 0.2s, background 0.2s;
  text-align: center;
}
.feature i {
  font-size: 2.2rem;
  color: #fff;
  margin-bottom: 1.1rem;
  filter: drop-shadow(0 0 8px #fff3);
}
.feature h3 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.7rem;
  color: #fff;
}
.feature p {
  color: var(--text-secondary);
  font-size: 1.05rem;
}
.feature:hover {
  box-shadow: 0 0 24px 4px rgba(255,255,255,0.13);
  border: 1.5px solid #fff;
  background: #181819cc;
}

.footer {
  width: 100%;
  max-width: 1300px;
  margin: 2.5rem auto 0 auto;
  padding: 2rem 2rem 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  border-top: 1px solid var(--card-border);
  background: none;
  box-shadow: none;
}
.footer-links {
  display: flex;
  gap: 2.2rem;
  flex-wrap: wrap;
  justify-content: center;
}
.footer-links a {
  color: #fff;
  font-weight: 500;
  letter-spacing: 0.01em;
  padding: 0.1rem 0.7rem;
  border-radius: 6px;
  transition: color 0.18s, background 0.18s, box-shadow 0.18s;
}
.footer-links a:hover {
  color: #fff;
  background: #181819;
  box-shadow: 0 0 8px 2px rgba(255,255,255,0.08);
}
.commit-link {
  color: #fff;
  font-size: 0.92rem;
  opacity: 0.7;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.commit-link a {
  color: #fff;
  text-decoration: none;
  opacity: 0.7;
  transition: opacity 0.18s;
}
.commit-link a:hover {
  opacity: 1;
}

@media (max-width: 900px) {
  .features-row {
    max-width: 99vw;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .hero {
    max-width: 99vw;
    padding: 3rem 1.2rem 2.5rem 1.2rem;
  }
  .code-demo {
    min-width: 0;
    max-width: 100vw;
  }
  .footer {
    max-width: 99vw;
    padding: 2rem 1rem 1.5rem 1rem;
  }
}
@media (max-width: 600px) {
  .hero {
    max-width: 100vw;
    padding: 1.2rem 0.2rem 1.2rem 0.2rem;
    margin-top: 1.2rem;
  }
  .hero-title {
    font-size: 2.1rem;
  }
  .features-row {
    gap: 1.1rem;
    max-width: 100vw;
  }
  .feature {
    padding: 1.2rem 0.5rem 1.1rem 0.5rem;
  }
  .code-demo {
    min-width: 0;
    max-width: 100vw;
  }
  .footer {
    max-width: 100vw;
    padding: 2rem 0.2rem 1.5rem 0.2rem;
  }
}
</style>
