<script lang="ts">
  import { onMount } from 'svelte';
  import '../../app.css';
  import 'highlight.js/styles/github-dark.css';
  import { goto } from '$app/navigation';
  import { API_URL } from '$lib/config';
  import hljs from 'highlight.js';

  let title = '';
  let text = '';
  let expires = '1d';
  let language = 'plaintext';
  let highlightedCode = '';

  $: {
    if (text && language !== 'plaintext') {
      try {
        highlightedCode = hljs.highlight(text, { language }).value;
      } catch {
        highlightedCode = text;
      }
    } else {
      highlightedCode = text;
    }
  }
  let saveBtnDisabled = true;
  let isSaving = false;
  let error = '';

  const languages = [
    { value: 'plaintext', label: 'Plain Text' },
    { value: 'markdown', label: 'Markdown' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'cpp', label: 'C++' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'sql', label: 'SQL' },
    { value: 'json', label: 'JSON' },
    { value: 'yaml', label: 'YAML' },
    { value: 'xml', label: 'XML' },
    { value: 'bash', label: 'Bash' },
    { value: 'shell', label: 'Shell' },
    { value: 'powershell', label: 'PowerShell' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'swift', label: 'Swift' },
    { value: 'scala', label: 'Scala' },
    { value: 'r', label: 'R' },
    { value: 'matlab', label: 'MATLAB' },
    { value: 'perl', label: 'Perl' },
    { value: 'lua', label: 'Lua' },
    { value: 'dart', label: 'Dart' },
    { value: 'elixir', label: 'Elixir' },
    { value: 'erlang', label: 'Erlang' },
    { value: 'haskell', label: 'Haskell' },
    { value: 'ocaml', label: 'OCaml' },
    { value: 'fsharp', label: 'F#' },
    { value: 'clojure', label: 'Clojure' },
    { value: 'groovy', label: 'Groovy' },
    { value: 'julia', label: 'Julia' },
    { value: 'nim', label: 'Nim' },
    { value: 'crystal', label: 'Crystal' },
    { value: 'zig', label: 'Zig' },
    { value: 'v', label: 'V' },
    { value: 'd', label: 'D' },
    { value: 'fortran', label: 'Fortran' },
    { value: 'cobol', label: 'COBOL' },
    { value: 'pascal', label: 'Pascal' },
    { value: 'ada', label: 'Ada' },
    { value: 'lisp', label: 'Lisp' },
    { value: 'scheme', label: 'Scheme' },
    { value: 'prolog', label: 'Prolog' },
    { value: 'smalltalk', label: 'Smalltalk' },
    { value: 'objective-c', label: 'Objective-C' },
    { value: 'assembly', label: 'Assembly' },
    { value: 'verilog', label: 'Verilog' },
    { value: 'vhdl', label: 'VHDL' },
    { value: 'dockerfile', label: 'Dockerfile' },
    { value: 'makefile', label: 'Makefile' },
    { value: 'ini', label: 'INI' },
    { value: 'toml', label: 'TOML' },
    { value: 'diff', label: 'Diff' },
    { value: 'git', label: 'Git' },
    { value: 'graphql', label: 'GraphQL' },
    { value: 'protobuf', label: 'Protocol Buffers' },
    { value: 'thrift', label: 'Thrift' },
    { value: 'avro', label: 'Avro' },
    { value: 'csv', label: 'CSV' },
    { value: 'tsv', label: 'TSV' },
    { value: 'latex', label: 'LaTeX' },
    { value: 'tex', label: 'TeX' },
    { value: 'asciidoc', label: 'AsciiDoc' },
    { value: 'restructuredtext', label: 'reStructuredText' },
    { value: 'coffeescript', label: 'CoffeeScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'jsx', label: 'JSX' },
    { value: 'tsx', label: 'TSX' },
    { value: 'vue', label: 'Vue' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' },
    { value: 'solidity', label: 'Solidity' },
    { value: 'vyper', label: 'Vyper' },
    { value: 'move', label: 'Move' },
    { value: 'cadence', label: 'Cadence' },
    { value: 'mermaid', label: 'Mermaid' },
    { value: 'plantuml', label: 'PlantUML' },
    { value: 'dot', label: 'DOT' },
    { value: 'gherkin', label: 'Gherkin' },
    { value: 'cucumber', label: 'Cucumber' },
    { value: 'robot', label: 'Robot Framework' },
    { value: 'terraform', label: 'Terraform' },
    { value: 'pulumi', label: 'Pulumi' },
    { value: 'ansible', label: 'Ansible' },
    { value: 'puppet', label: 'Puppet' },
    { value: 'chef', label: 'Chef' },
    { value: 'salt', label: 'Salt' }
  ];

  let searchQuery = '';
  let showLanguageDropdown = false;
  let filteredLanguages = languages;

  $: {
    if (searchQuery) {
      filteredLanguages = languages.filter(lang => 
        lang.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.value.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      filteredLanguages = languages;
    }
  }

  function selectLanguage(lang: string) {
    language = lang;
    showLanguageDropdown = false;
    searchQuery = '';
  }

  function handleLanguageClick() {
    showLanguageDropdown = !showLanguageDropdown;
    if (showLanguageDropdown) {
      searchQuery = '';
      filteredLanguages = languages;
    }
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.language-select')) {
      showLanguageDropdown = false;
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });

  function toMySQLDateTime(date: Date): string {
    const pad = (num: number): string => String(num).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  function handleTab(e: KeyboardEvent) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      
      if (start === end) {
        // No selection - just insert two spaces
        text = text.substring(0, start) + '  ' + text.substring(end);
        target.selectionStart = target.selectionEnd = start + 2;
      } else {
        // With selection - indent each line in selection
        const selectedText = text.substring(start, end);
        const lines = selectedText.split('\n');
        const indentedLines = lines.map(line => '  ' + line);
        const newText = indentedLines.join('\n');
        
        text = text.substring(0, start) + newText + text.substring(end);
        target.selectionStart = start;
        target.selectionEnd = start + newText.length;
      }
    }
  }

  function updateLenght() {
    const lenght = text.length;
    const lenghtElement = document.getElementById('lenght');
    if (lenghtElement) {
      lenghtElement.innerHTML = `${lenght}/2000`;
    }
  }

  function syncScroll(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    const overlay = document.querySelector('.highlight-overlay') as HTMLElement;
    if (overlay) {
      overlay.scrollTop = textarea.scrollTop;
      overlay.scrollLeft = textarea.scrollLeft;
    }
  }

  onMount(() => {
    updateLenght();
    document.querySelector('textarea')?.addEventListener('input', updateLenght);
    document.querySelector('textarea')?.addEventListener('scroll', syncScroll);
  })

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
        body: JSON.stringify({ title, text, expiresAt, language })
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

<div class="container">
  <div class="editor glass-card">
    <input 
      bind:value={title}
      type="text" 
      maxlength="255"
      placeholder="Title" 
    />
    <div class="editor-wrapper">
      <div class="editor-container">
        <textarea 
          bind:value={text}
          rows="10" 
          cols="30" 
          maxlength="2000"
          placeholder="Note text"
          class={language}
          on:keydown={handleTab}
          spellcheck="false"
        ></textarea>
        <pre class="highlight-overlay"><code class={`hljs language-${language}`}>{@html highlightedCode}</code></pre>
      </div>
      <div class="editor-meta">
        <span class="language-badge">{language}</span>
        <p id="lenght" class="text-secondary">0/2000</p>
      </div>
    </div>
  </div>

  <section class="editor-options glass-card">
    <div class="options-grid">
      <div class="option-group">
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
      </div>

      <div class="option-group">
        <h3>Language:</h3>
        <div class="language-select">
          <button 
            class="language-button" 
            on:click={handleLanguageClick}
            type="button"
          >
            <span>{languages.find(l => l.value === language)?.label || 'Select Language'}</span>
            <i class="fas fa-chevron-down"></i>
          </button>
          {#if showLanguageDropdown}
            <div class="language-dropdown">
              <div class="search-box">
                <i class="fas fa-search"></i>
                <input
                  type="text"
                  bind:value={searchQuery}
                  placeholder="Search languages..."
                  on:click|stopPropagation
                />
              </div>
              <div class="language-list">
                {#each filteredLanguages as lang}
                  <button
                    class="language-option"
                    class:selected={language === lang.value}
                    on:click={() => selectLanguage(lang.value)}
                    type="button"
                  >
                    {lang.label}
                  </button>
                {/each}
              </div>
            </div>
          {/if}
        </div>
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
</div>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .editor {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
  }

  .editor-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .editor-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
  }

  .language-badge {
    background: var(--card-background);
    color: var(--text-secondary);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .editor > input, .editor > textarea {
    width: 100%;
    background-color: var(--card-background);
    border: 1px solid var(--card-border);
    padding: 0.75rem 1rem;
    border-radius: 8px;
    color: var(--text-primary);
    font-size: 1rem;
    font-family: var(--font-family);
    transition: all 0.2s ease;
  }

  .editor-container {
    position: relative;
    min-height: 300px;
    background: var(--card-background);
    border: 1px solid var(--card-border);
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  textarea {
    min-height: 300px;
    resize: vertical;
    font-family: 'Fira Code', 'Consolas', monospace;
    line-height: 1.6;
    background: transparent !important;
    color: transparent !important;
    caret-color: var(--text-primary);
    position: relative;
    z-index: 1;
    white-space: pre;
    overflow: auto;
    width: 100%;
    padding: 0.75rem 1rem;
    border: none;
    flex: 1;
    tab-size: 2;
  }

  .highlight-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    pointer-events: none;
    font-family: 'Fira Code', 'Consolas', monospace;
    line-height: 1.6;
    padding: 0.75rem 1rem;
    white-space: pre;
    overflow: auto;
    background: transparent;
    z-index: 0;
  }

  .highlight-overlay code {
    background: transparent !important;
    padding: 0 !important;
    font-family: inherit;
    display: block;
    tab-size: 2;
  }

  :global(.hljs) {
    background: transparent !important;
    padding: 0 !important;
  }

  input:focus, textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  .editor-options {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .options-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .option-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .option-group h3 {
    color: var(--text-primary);
    font-size: 1rem;
    font-weight: 500;
  }

  .expiration-options {
    background: var(--card-background);
    border: 1px solid var(--card-border);
    border-radius: 8px;
    padding: 0.5rem;
  }

  .expiration-radio-group {
    position: relative;
    display: flex;
    gap: 0.5rem;
    padding: 0.25rem;
  }

  .expiration-slider {
    position: absolute;
    top: 0.25rem;
    height: calc(100% - 0.5rem);
    background: var(--primary-color);
    border-radius: 6px;
    z-index: 0;
    transition: all 0.2s ease;
    pointer-events: none;
  }

  .expiration-radio-group input[type="radio"] {
    display: none;
  }

  .expiration-radio-group label {
    position: relative;
    z-index: 1;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    color: var(--text-secondary);
    transition: all 0.2s ease;
    font-size: 0.875rem;
    min-width: 3rem;
    text-align: center;
    flex: 1;
  }

  .expiration-radio-group input[type="radio"]:checked + label {
    color: var(--text-primary);
    font-weight: 500;
  }

  .language-select {
    position: relative;
    width: 100%;
  }

  .language-button {
    width: 100%;
    background-color: var(--card-background);
    border: 1px solid var(--card-border);
    padding: 0.75rem 1rem;
    border-radius: 8px;
    color: var(--text-primary);
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .language-button:hover {
    border-color: var(--primary-color);
  }

  .language-dropdown {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    right: 0;
    background: var(--background-primary);
    border: 1px solid var(--card-border);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    max-height: 300px;
    display: flex;
    flex-direction: column;
  }

  .search-box {
    padding: 0.75rem;
    border-bottom: 1px solid var(--card-border);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .search-box i {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }

  .search-box input {
    background: none;
    border: none;
    color: var(--text-primary);
    font-size: 0.875rem;
    width: 100%;
    padding: 0;
  }

  .search-box input:focus {
    outline: none;
  }

  .language-list {
    overflow-y: auto;
    max-height: 250px;
  }

  .language-option {
    width: 100%;
    padding: 0.5rem 1rem;
    background: none;
    border: none;
    color: var(--text-primary);
    font-size: 0.875rem;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .language-option:hover {
    background: var(--card-background);
  }

  .language-option.selected {
    background: var(--primary-color);
    color: white;
  }

  .buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .error {
    color: var(--error-color);
    font-size: 0.875rem;
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem 0.5rem;
    }

    .editor, .editor-options {
      padding: 1rem;
    }

    .options-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .expiration-radio-group label {
      padding: 0.4rem 0.5rem;
      font-size: 0.75rem;
    }

    .language-dropdown {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      max-width: 400px;
      max-height: 80vh;
    }

    .language-list {
      max-height: calc(80vh - 60px);
    }
  }
</style>