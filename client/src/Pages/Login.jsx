import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import { useState } from "react";
import axios from "axios";
import Alert from "../Components/Alert";

const Login = () => {
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const loginHandler = (e) => {
    e.preventDefault();

    const loginData = {
      username,
      password,
    };

    const loginUser = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8081/api/users/login",
          loginData
        );
        console.log(response.data);
        localStorage.setItem("authToken", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
        setAlert({
          show: true,
          message: response.data.message,
          type: "success",
        });
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (error) {
        console.log(error);
        if (error.response) {
          setAlert({
            show: true,
            message: error.response.data.message,
            type: "danger",
          });
        } else {
          setAlert({
            show: true,
            message: error.message,
            type: "danger",
          });
        }
      }

      setUsername("");
      setPassword("");
    };

    loginUser();
  };

  return (
    <>
      {alert.show && <Alert message={alert.message} type={alert.type} />}
      <div className="login">
        <h2 className="text-center mb-4 mt-4">Login</h2>
        <form className="mt-4" onSubmit={loginHandler}>
          <div className="form-outline mb-4">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              style={{
                borderBottom: "2px solid #ced4da",
              }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-outline mb-4">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              style={{
                borderBottom: "2px solid #ced4da",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="row mb-4 text-center">
            <div className="col">
              Dont have an account? <Link to="/register">Register</Link>
            </div>
          </div>

          <button type="submit" className="login-btn btn btn-primary btn-block">
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
