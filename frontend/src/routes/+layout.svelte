<script>

  import "../app.css";
  import { onMount } from "svelte";

  let theme = "dark";
  let isMenuOpen = false;

  onMount(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      theme = savedTheme;
      document.documentElement.setAttribute("data-theme", theme);
    }
  });

  function toggleTheme() {
    theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function closeMenu() {
    isMenuOpen = false;
  }
</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" >
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="app">
  <nav>
    <div class="nav-content">
      <a href="/" class="logo" on:click={closeMenu}>
        <i class="fas fa-code"></i>
        TinyBin
      </a>
      <button class="menu-toggle" on:click={toggleMenu} aria-label="Toggle menu">
        <i class="fas fa-{isMenuOpen ? 'times' : 'bars'}"></i>
      </button>
      <div class="links" class:open={isMenuOpen}>
        <a href="/" class="nav-link" on:click={closeMenu}>Home</a>
        <a href="/editor" class="nav-link" on:click={closeMenu}>New Paste</a>
        <a href="/about" class="nav-link" on:click={closeMenu}>About</a>
      </div>
    </div>
  </nav>

  <button class="theme-switch" on:click={toggleTheme} aria-label="Toggle theme">
    <i class="fas fa-{theme === 'dark' ? 'sun' : 'moon'}"></i>
  </button>

  <main>
    <slot />
  </main>
</div>

<style>
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  nav {
    background: var(--background-secondary);
    border-bottom: none;
    box-shadow: none;
    padding: 0.7rem 0;
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(12px) saturate(120%);
    background-color: rgba(9,9,10,0.85);
  }

  .nav-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--primary-color);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    z-index: 101;
    letter-spacing: -0.01em;
  }

  .logo i {
    color: var(--primary-color);
  }

  .menu-toggle {
    display: none;
    background: none;
    border: none;
    color: var(--text-primary);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    z-index: 101;
  }

  .links {
    display: flex;
    gap: 1.2rem;
    align-items: center;
    background: none;
    box-shadow: none;
  }

  .nav-link {
    color: var(--text-secondary);
    font-weight: 500;
    transition: color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
    padding: 0.2rem 0.5rem;
    border-radius: 6px;
  }

  .nav-link:hover {
    color: var(--primary-color);
    background: #181819;
    box-shadow: 0 0 8px 2px rgba(255,255,255,0.08);
  }

  main {
    flex: 1;
    padding: 2rem 0;
  }

  @media (max-width: 768px) {
    .menu-toggle {
      display: block;
    }

    .nav-content {
      padding: 0 1rem;
    }

    .links {
      position: fixed;
      top: 0;
      right: -100%;
      width: 100%;
      height: 100vh;
      background: var(--background-secondary);
      flex-direction: column;
      justify-content: center;
      gap: 2rem;
      transition: right 0.3s ease;
      z-index: 100;
      box-shadow: none;
    }

    .links.open {
      right: 0;
    }

    .nav-link {
      font-size: 1.15rem;
      padding: 0.5rem 1rem;
    }

    .theme-switch {
      top: 1rem;
      right: 4rem;
    }
  }
</style>