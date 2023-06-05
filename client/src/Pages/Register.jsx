import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import { useState } from "react";
import axios from "axios";
import Alert from "../Components/Alert";

const Register = () => {
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const registerHandler = (e) => {
    e.preventDefault();

    const registerData = {
      username,
      password,
    };

    const registerUser = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8081/api/users/register",
          registerData
        );
        console.log(response.data);
        setAlert({
          show: true,
          message: response.data.message,
          type: "success",
        });
        setTimeout(() => {
          navigate("/login");
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

    registerUser();
  };

  return (
    <>
      {alert.show && <Alert message={alert.message} type={alert.type} />}
      <div className="register">
        <h2 className="text-center mb-4 mt-4">Register</h2>
        <form className="mt-4" onSubmit={registerHandler}>
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
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </div>

          <button
            type="submit"
            className="register-btn btn btn-primary btn-block"
          >
            Register
          </button>
        </form>
      </div>
    </>
  );
};

export default Register;
