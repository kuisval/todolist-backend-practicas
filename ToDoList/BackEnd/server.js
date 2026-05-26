const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// "Base de datos" en memoria (array de tareas)
let tasks = [
  { id: 1, text: 'Aprender React', completed: false },
  { id: 2, text: 'Crear mi primera API con Express', completed: true },
];
let nextId = 3;

// GET /tasks - Obtener todas las tareas
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// POST /tasks - Crear una nueva tarea
app.post('/tasks', (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'El texto de la tarea es requerido' });
  }

  const newTask = {
    id: nextId++,
    text: text.trim(),
    completed: false,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /tasks/:id - Actualizar una tarea (texto o estado)
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  const { text, completed } = req.body;

  if (text !== undefined) {
    if (text.trim() === '') {
      return res.status(400).json({ error: 'El texto no puede estar vacío' });
    }
    tasks[taskIndex].text = text.trim();
  }

  if (completed !== undefined) {
    tasks[taskIndex].completed = completed;
  }

  res.json(tasks[taskIndex]);
});

// DELETE /tasks/:id - Eliminar una tarea
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  tasks.splice(taskIndex, 1);
  res.json({ message: 'Tarea eliminada correctamente' });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📋 Endpoints disponibles:`);
  console.log(`   GET    /tasks       -> Obtener todas las tareas`);
  console.log(`   POST   /tasks       -> Crear nueva tarea`);
  console.log(`   PUT    /tasks/:id   -> Actualizar tarea`);
  console.log(`   DELETE /tasks/:id   -> Eliminar tarea`);
});
