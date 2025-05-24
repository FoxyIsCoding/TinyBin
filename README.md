# TinyBin

TinyBin is a modern, minimal, and ad-free pastebin for your notes and code.  
Built with Node.js, Express, and MySQL.  
Easily self-host with Docker!

---

## ✨ Features

- 📝 Create and share notes with unique URLs
- ⏳ Notes auto-expire after 24 hours or more
- ⚡ Fast and simple UI
- 🐳 Easy Docker Compose setup

---

## 🚀 Quick Start (Docker Compose)

### 1. Download `docker-compose.yml`

```sh
curl -O -L https://github.com/FoxyIsCoding/TinyBin/raw/refs/heads/main/docker-compose.yml
```

### 2. Start Everything with Docker Compose

```sh
docker-compose up
```

- This will:
  - Spin up a MySQL 8 database (with user/password: `pastefox`)
  - Build and run the PasteFox app (Node.js)
  - Automatically run DB migrations on startup

### 3. Visit PasteFox

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Docker Compose Details

- **MySQL** runs privately on port `3306`, with data persisted in a Docker volume.
- **PasteFox App** runs publically on port `3000`.
- Environment variables are set automatically for DB connection.

**You can customize DB credentials in `docker-compose.yml` if needed.**

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

