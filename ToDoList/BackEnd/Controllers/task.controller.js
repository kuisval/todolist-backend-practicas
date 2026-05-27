const db = require('../database');

const getAll = (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks WHERE user_id = ?').all(req.userId);
  res.json(tasks.map((t) => ({ ...t, completed: t.completed === 1 })));
};

const create = (req, res) => {
  const { text, due_date } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'Texto requerido' });

  const result = db.prepare(
    'INSERT INTO tasks (user_id, text, due_date) VALUES (?, ?, ?)'
  ).run(req.userId, text.trim(), due_date || null);

  const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ ...newTask, completed: false });
};

const update = (req, res) => {
  const id   = parseInt(req.params.id);
  const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(id, req.userId);
  if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });

  const { text, completed, due_date } = req.body;
  if (text !== undefined)      db.prepare('UPDATE tasks SET text = ? WHERE id = ?').run(text.trim(), id);
  if (completed !== undefined) db.prepare('UPDATE tasks SET completed = ? WHERE id = ?').run(completed ? 1 : 0, id);
  if (due_date !== undefined)  db.prepare('UPDATE tasks SET due_date = ? WHERE id = ?').run(due_date, id);

  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  res.json({ ...updated, completed: updated.completed === 1 });
};

const remove = (req, res) => {
  const id   = parseInt(req.params.id);
  const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(id, req.userId);
  if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });

  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  res.json({ message: 'Tarea eliminada' });
};

module.exports = { getAll, create, update, remove };