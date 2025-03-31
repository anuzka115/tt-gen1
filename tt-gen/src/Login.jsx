import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import loginImage from "./assets/undraw_sign-up_qamz.svg";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "12345678") {
      localStorage.setItem("isAdmin", "true");
      setMessage("Successfully logged in!");
      setTimeout(() => navigate("/"), 1000);
    } else {
      setMessage("Incorrect credentials.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="image-container">
        <img src={loginImage} alt="Login Illustration" />
      </div>
      
      <div className="login-container">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        <p className={`message ${message.includes("Success") ? "success" : "error"}`}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default Login;