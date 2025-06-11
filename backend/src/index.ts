import express from 'express';
import cors from 'cors';
import notesRoutes from './routes/notes.js';
import healthRoutes from './routes/health.js';
import { removeExpiredNotes } from './queries/notes.js';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(notesRoutes.prefix, notesRoutes.router);
app.use(healthRoutes.prefix, healthRoutes.router);

// Cleanup expired notes every hour
setInterval(async () => {
  const removed = await removeExpiredNotes();
  if (removed > 0) {
    console.log(`🧹 | Removed ${removed} expired notes`);
  }
}, 60 * 60 * 1000);

app.listen(port, () => {
  console.log(`🚀 | Server running on port ${port}`);
});