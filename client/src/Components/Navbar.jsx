import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Alert from "./Alert";

const Navbar = () => {
  const navigate = useNavigate();

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });

  const logoutHandler = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setAlert({
      show: true,
      message: "Logged out successfully",
      type: "success",
    });

    navigate("/login");
  };
  return (
    <>
      {alert.show && <Alert message={alert.message} type={alert.type} />}
      <nav className="navbar navbar-expand-lg bg-light navbar-light ">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            Todo List
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-mdb-toggle="collapse"
            data-mdb-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fas fa-bars"></i>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {localStorage.getItem("authToken") ? (
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link to="/inbox" className="nav-link">
                    Inbox
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/all" className="nav-link">
                    All
                  </Link>
                </li>
              </ul>
            ) : (
              ""
            )}

            <>
              {localStorage.getItem("authToken") ? (
                <ul className="navbar-nav d-flex  me-1">
                  <li className="nav-item">
                    <button
                      className="nav-link"
                      onClick={logoutHandler}
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              ) : (
                <ul className="navbar-nav d-flex  me-1">
                  <li className="nav-item">
                    <Link to="/register" className="nav-link">
                      Register
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link">
                      Login
                    </Link>
                  </li>
                </ul>
              )}
            </>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
