const Todo = require("../models/todoModel");

// @Desc     : Get all todos
// @Access   : Private
const getAllTodos = async (req, res) => {
  const userId = req.user._id;

  try {
    const todos = await Todo.find({ user: userId }).sort({ createdAt: -1 });
    if (!todos) {
      return res.status(404).json({
        success: false,
        message: "Todos not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Get all todos successfully",
      todos,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @Desc     : Get a todo by id
// @Access   : Private
const getTodoById = async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Get a todo by id successfully",
      todo,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @Desc     : Create a todo
// @Access   : Private
const createTodo = async (req, res) => {
  const { title, description, due, completed } = req.body;
  const userId = req.user._id;

  try {
    const newTodo = await Todo.create({
      title,
      description,
      due,
      completed,
      user: userId,
    });

    if (!newTodo) {
      return res.status(400).json({
        success: false,
        message: "Create a todo failed",
      });
    }

    res.status(201).json({
      success: true,
      message: "Create a todo successfully",
      todo: newTodo,
    });
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages[0],
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
};

// @Desc     : Update a todo
// @Access   : Public
const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, description, due, completed } = req.body;
  const userId = req.user._id;

  try {
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    // check if user is the owner of the todo
    if (todo.user.toString() !== userId.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this todo",
      });
    }

    todo.title = title || todo.title;
    todo.description = description || todo.description;
    todo.due = due || todo.due;
    todo.completed = completed === undefined ? todo.completed : completed;
    todo.user = userId || todo.user;

    const updatedTodo = await todo.save();
    if (!updatedTodo) {
      return res.status(400).json({
        success: false,
        message: "Update a todo failed",
      });
    }

    res.status(200).json({
      success: true,
      message: "Update a todo successfully",
      todo: updatedTodo,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @Desc     : Delete a todo
// @Access   : Public
const deleteTodo = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    // check if user is the owner of the todo
    if (todo.user.toString() !== userId.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this todo",
      });
    }

    const deletedTodo = await Todo.findByIdAndDelete(id);
    console.log(deletedTodo);
    if (!deletedTodo) {
      return res.status(400).json({
        success: false,
        message: "Delete a todo failed",
        todo: deletedTodo,
      });
    }

    res.status(200).json({
      success: true,
      message: "Delete a todo successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
};
