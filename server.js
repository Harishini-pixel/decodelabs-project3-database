const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const DEFAULT_PORT = Number(process.env.PORT) || 3000;
const DB_PATH = path.join(__dirname, 'tasks.db');

// Allow Express to read JSON request bodies
app.use(express.json());

// Create a single database connection for the app
let db;

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        reject(err);
        return;
      }

      // Create the tasks table automatically if it does not exist
      db.run(
        `CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          status TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        (tableErr) => {
          if (tableErr) {
            reject(tableErr);
            return;
          }

          resolve();
        }
      );
    });
  });
}

function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve({
        id: this.lastID,
        changes: this.changes,
      });
    });
  });
}

function getQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(row);
    });
  });
}

function getAllQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(rows);
    });
  });
}

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await getAllQuery(
      'SELECT * FROM tasks ORDER BY created_at DESC'
    );
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new task
app.post('/api/tasks', async (req, res) => {
  const { title, description = '', status = 'pending' } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const result = await runQuery(
      'INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)',
      [title.trim(), description, status]
    );

    const task = await getQuery('SELECT * FROM tasks WHERE id = ?', [result.id]);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a task
app.put('/api/tasks/:id', async (req, res) => {
  const taskId = Number(req.params.id);
  const { title, description = '', status = 'pending' } = req.body;

  if (!Number.isInteger(taskId)) {
    return res.status(400).json({ error: 'Task id must be a valid integer' });
  }

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const existingTask = await getQuery('SELECT * FROM tasks WHERE id = ?', [taskId]);

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await runQuery(
      'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?',
      [title.trim(), description, status, taskId]
    );

    const updatedTask = await getQuery('SELECT * FROM tasks WHERE id = ?', [taskId]);
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  const taskId = Number(req.params.id);

  if (!Number.isInteger(taskId)) {
    return res.status(400).json({ error: 'Task id must be a valid integer' });
  }

  try {
    const existingTask = await getQuery('SELECT * FROM tasks WHERE id = ?', [taskId]);

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await runQuery('DELETE FROM tasks WHERE id = ?', [taskId]);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.warn(`Port ${port} is busy. Trying ${port + 1}...`);
      server.close(() => {
        startServer(port + 1);
      });
    } else {
      console.error('Server error:', error);
      process.exit(1);
    }
  });
}

// Start the server only after the database has been initialized
initializeDatabase()
  .then(() => {
    startServer(DEFAULT_PORT);
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });

// Optional graceful shutdown cleanup
process.on('SIGINT', () => {
  if (db) {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      }
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
