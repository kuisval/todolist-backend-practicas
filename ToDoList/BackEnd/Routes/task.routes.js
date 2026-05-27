const express        = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const TaskController = require('../controllers/task.controller');

const router = express.Router();

router.get('/',     authMiddleware, TaskController.getAll);
router.post('/',    authMiddleware, TaskController.create);
router.put('/:id',  authMiddleware, TaskController.update);
router.delete('/:id', authMiddleware, TaskController.remove);

module.exports = router;