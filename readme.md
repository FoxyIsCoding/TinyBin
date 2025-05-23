# PasteFox

PasteFox is a modern, minimal, and ad-free pastebin for your notes and code.  
Built with Node.js, Express, and MySQL.  
Easily self-host with Docker!

---

## ✨ Features

- 📝 Create and share notes with unique URLs
- ⏳ Notes auto-expire after 24 hours
- ⚡ Fast and simple UI, dark mode by default
- 🐳 Easy Docker Compose setup
- 💾 MySQL-backed, open source, no ads

---

## 🚀 Quick Start (Docker Compose)

### 1. Clone the Repo

```sh
git clone https://github.com/FoxyIsCoding/pastefox.git
cd pastefox/app
```

### 2. Start Everything with Docker Compose

```sh
docker-compose -f compose.yml up --build
```

- This will:
  - Spin up a MySQL 8 database (with user/password: `pastefox`)
  - Build and run the PasteFox app (Node.js)
  - Automatically run DB migrations on startup

### 3. Visit PasteFox

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Project Structure

```
app/
├── src/
│   ├── backend/      # Express, DB, API logic
│   ├── frontend/     # HTML, CSS, JS for UI
│   └── main.js       # App entrypoint
├── compose.yml       # Docker Compose config
├── Dockerfile        # App Dockerfile
├── package.json
└── index.html        # Landing page
```

---

## 🐳 Docker Compose Details

- **MySQL** runs on port `3306`, data is persisted in a Docker volume.
- **PasteFox App** runs on port `3000`.
- Environment variables are set automatically for DB connection.

**You can customize DB credentials in `compose.yml` if needed.**

---

## 🧩 Environment Variables

PasteFox uses these env vars (set automatically in Docker):

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `WEB_PORT` (default: 3000)

---

## 🗃️ Database Migration

On every start, PasteFox will auto-create the `notes` table and indexes if they don't exist.  
No manual SQL needed!

---

## ❤️ Support

If you like this project, consider [supporting me on Ko-fi](https://ko-fi.com/foxyk)!  
Your support keeps PasteFox ad-free and open source.

---

## 📄 License

MIT

---

