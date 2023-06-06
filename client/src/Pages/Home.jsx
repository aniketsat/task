import { useState, useEffect } from "react";
import Alert from "../Components/Alert";
import axios from "axios";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [state, setState] = useState("ALL");

  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: "",
  });

  const [t, setT] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    console.log("useEffect" + state);

    const getTasks = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/todos", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        console.log(res.data);

        switch (state) {
          case "ALL":
            setTasks(res.data.todos);
            break;
          case "COMPLETED":
            setTasks(res.data.todos.filter((task) => task.completed === true));
            break;
          case "PENDING":
            setTasks(res.data.todos.filter((task) => task.completed === false));
            break;
          default:
            setTasks(res.data.todos);
            break;
        }
      } catch (error) {
        console.log(error);
        if (error.response) {
          setAlert({
            show: true,
            type: "danger",
            message: error.response.data.message,
          });
        } else {
          setAlert({
            show: true,
            type: "danger",
            message: "Something went wrong",
          });
        }
      }
    };

    getTasks();
  }, [state]);

  const deleteTaskHandler = (id) => {
    const deleteTask = async () => {
      const res = await axios.delete(`http://localhost:8081/api/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      console.log(res.data);
      setTasks(tasks.filter((task) => task._id !== id));
    };
    deleteTask();
  };

  const addTodoHandler = (e) => {
    e.preventDefault();
    setT(null);

    if (title === "" || description === "") {
      setAlert({
        show: true,
        type: "danger",
        message: "Please fill all the fields",
      });
      return;
    }

    const addTask = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8081/api/todos",
          {
            title,
            description,
            due: dueDate ? dueDate : null,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        console.log(res.data);
        // Add task to the tasks array according to the state
        switch (state) {
          case "ALL":
            setTasks([...tasks, res.data.todo]);
            break;
          case "COMPLETED":
            if (res.data.todo.completed === true) {
              setTasks([...tasks, res.data.todo]);
            }
            break;
          case "PENDING":
            if (res.data.todo.completed === false) {
              setTasks([...tasks, res.data.todo]);
            }
            break;
          default:
            setTasks([...tasks, res.data.todo]);
            break;
        }
        setAlert({
          show: true,
          type: "success",
          message: "Task added successfully",
        });
      } catch (error) {
        console.log(error);
        if (error.response) {
          setAlert({
            show: true,
            type: "danger",
            message: error.response.data.message,
          });
        } else {
          setAlert({
            show: true,
            type: "danger",
            message: "Something went wrong",
          });
        }
      }

      setTitle("");
      setDescription("");
      setDueDate("");
    };

    addTask();
  };

  const updateTodoHandler = (e) => {
    e.preventDefault();
    if (t === null) {
      setAlert({
        show: true,
        type: "danger",
        message: "Please select a task to update",
      });
      return;
    }
    if (title === "" || description === "") {
      setAlert({
        show: true,
        type: "danger",
        message: "Please fill all the fields",
      });
      return;
    }

    console.log(t);
    if (t === null) {
      setAlert({
        show: true,
        type: "danger",
        message: "Please select a task to update",
      });
    } else {
      const updateTask = async () => {
        try {
          const res = await axios.put(
            `http://localhost:8081/api/todos/${t._id}`,
            {
              title,
              description,
              due: dueDate ? dueDate : null,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );
          console.log(res.data);
          setTasks(
            tasks.map((task) => {
              if (task._id === t._id) {
                return res.data.todo;
              }
              return task;
            })
          );
          setAlert({
            show: true,
            type: "success",
            message: "Task updated successfully",
          });
        } catch (error) {
          console.log(error);
          if (error.response) {
            setAlert({
              show: true,
              type: "danger",
              message: error.response.data.message,
            });
          } else {
            setAlert({
              show: true,
              type: "danger",
              message: "Something went wrong",
            });
          }
        }
      };

      updateTask();

      setTitle("");
      setDescription("");
      setDueDate("");
      setT(null);
    }
  };

  const checkBoxToggleHandler = (id) => {
    console.log(id);

    const toggleTask = async () => {
      try {
        console.log(tasks.find((task) => task._id === id).completed);
        const res = await axios.put(
          `http://localhost:8081/api/todos/${id}`,
          {
            completed: !tasks.find((task) => task._id === id).completed,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        console.log(res.data);
        setTasks(
          tasks.map((task) => {
            if (task._id === id) {
              return res.data.todo;
            }
            return task;
          })
        );
      } catch (error) {
        console.log(error);
        if (error.response) {
          setAlert({
            show: true,
            type: "danger",
            message: error.response.data.message,
          });
        } else {
          setAlert({
            show: true,
            type: "danger",
            message: "Something went wrong",
          });
        }
      }
    };

    toggleTask();
  };

  return (
    <>
      {alert.show && <Alert message={alert.message} type={alert.type} />}
      {localStorage.getItem("authToken") ? (
        <>
          <div
            className="container"
            style={{
              marginTop: "20px",
            }}
          >
            <div className="row">
              <div className="col-md-4">
                {/* group of 3 buttons */}
                <div
                  className="btn-group"
                  role="group"
                  aria-label="Basic outlined example"
                  style={{
                    marginBottom: "20px",
                    width: "100%",
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => setState("ALL")}
                    style={{
                      backgroundColor: state === "ALL" ? "#007bff" : "",
                      color: state === "ALL" ? "white" : "",
                    }}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => setState("COMPLETED")}
                    style={{
                      backgroundColor: state === "COMPLETED" ? "#007bff" : "",
                      color: state === "COMPLETED" ? "white" : "",
                    }}
                  >
                    Completed
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => setState("PENDING")}
                    style={{
                      backgroundColor: state === "PENDING" ? "#007bff" : "",
                      color: state === "PENDING" ? "white" : "",
                    }}
                  >
                    Pending
                  </button>
                </div>

                <form>
                  <div className="form-group">
                    <label htmlFor="title">Task Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      className="form-control"
                      id="description"
                      rows="3"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="dueDate">Due Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="dueDate"
                      value={dueDate.replace("T00:00:00.000Z", "")}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                  <button className="btn btn-primary" onClick={addTodoHandler}>
                    ADD
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={updateTodoHandler}
                  >
                    UPDATE
                  </button>
                </form>
              </div>

              <div className="col-md-8 ">
                {/* <button className="btn btn-primary">Sort by due date</button> */}

                <ul
                  style={{
                    listStyle: "none",
                    width: "100%",
                  }}
                >
                  {tasks &&
                    tasks.map((task) => (
                      <>
                        <li key={task._id}>
                          <div
                            className="card"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              width: "100%",
                              marginTop: "20px",
                            }}
                          >
                            <div className="card-head">
                              <div className="card-title form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="flexCheckDefault"
                                  checked={task.completed}
                                  onChange={() =>
                                    checkBoxToggleHandler(task._id)
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="flexCheckDefault"
                                  style={{
                                    textDecoration: task.completed
                                      ? "line-through"
                                      : "none",
                                    color: task.completed ? "grey" : "black",
                                  }}
                                >
                                  {task.title}
                                </label>
                              </div>
                              <div className="card-action">
                                <button
                                  className="btn btn-outline-dark"
                                  onClick={() => {
                                    setT(task);
                                    console.log(task);
                                    setTitle(task.title);
                                    setDescription(task.description);
                                    setDueDate(task.due || "");
                                  }}
                                >
                                  <i className="fa-solid fa-edit"></i>
                                </button>
                                <button
                                  className="btn btn-outline-dark"
                                  onClick={() => deleteTaskHandler(task._id)}
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                              </div>
                            </div>

                            <div className="card-body">
                              <p className="card-text">{task.description}</p>
                            </div>

                            <div className="card-tail">
                              <p className="card-date">
                                Due Date:
                                <span>
                                  {task.due ? task.due.substring(0, 10) : "N/A"}
                                </span>
                              </p>
                            </div>
                          </div>
                        </li>
                      </>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1>Home</h1>
        </>
      )}
    </>
  );
};

export default Home;
