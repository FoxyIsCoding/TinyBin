<script>
  import '../app.css';
  import { page } from '$app/stores';
</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" >
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="app" class:fade-gradient={$page.url.pathname !== '/'}>
  <nav class="glass-card">
    <a href="/" class="logo">
      <i class="fas fa-paste"></i>
      <span>PasteFox</span>
    </a>
    <div class="nav-links">
      <a href="/" class="nav-link">
        <i class="fas fa-home"></i>
        <span>Home</span>
      </a>
      <a href="/editor" class="nav-link">
        <i class="fas fa-plus"></i>
        <span>New Paste</span>
      </a>
      <a href="/about" class="nav-link">
        <i class="fas fa-info-circle"></i>
        <span>About</span>
      </a>
    </div>
  </nav>

  <main>
    <slot />
  </main>
</div>

<style>
  .app {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  nav {
    padding: 1.5rem 2rem;
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 1rem;
    z-index: 100;
  }

  .logo {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-color);
    text-decoration: none;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .logo i {
    font-size: 1.3rem;
  }

  .logo:hover {
    color: var(--primary-hover);
    transform: translateY(-1px);
  }

  .nav-links {
    display: flex;
    gap: 1rem;
  }

  .nav-link {
    color: var(--text-primary);
    text-decoration: none;
    font-size: 1rem;
    padding: 0.7rem 1.2rem;
    border-radius: 12px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--background-input);
    border: 1px solid var(--border-color);
  }

  .nav-link i {
    font-size: 1rem;
  }

  .nav-link:hover {
    background: var(--primary-color);
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.2);
  }

  .nav-link:active {
    transform: translateY(0);
  }

  main {
    flex: 1;
    padding: 1rem 0;
    width: 100%;
  }

  @media (max-width: 768px) {
    nav {
      padding: 1rem;
      flex-direction: column;
      gap: 1rem;
    }

    .nav-links {
      width: 100%;
      justify-content: center;
    }

    .nav-link span {
      display: none;
    }

    .nav-link {
      padding: 0.7rem;
    }

    .nav-link i {
      font-size: 1.2rem;
    }
  }

  .fade-gradient {
    background-image: none !important;
  }
</style> 