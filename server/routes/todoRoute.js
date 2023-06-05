const express = require("express");

const todoController = require("../controllers/todoController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, todoController.getAllTodos);

router.get("/:id", protect, todoController.getTodoById);

router.post("/", protect, todoController.createTodo);

router.put("/:id", protect, todoController.updateTodo);

router.delete("/:id", protect, todoController.deleteTodo);

module.exports = router;
