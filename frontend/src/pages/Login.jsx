import { useState } from "react";
import api from "../api/api";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();

  const [datos, setDatos] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value
    });
  };

  const login = async () => {

    try {

      const res = await api.post("/login", datos);

      localStorage.setItem("token", res.data.token);

      alert("Login exitoso");

      navigate("/admin");

    } catch (error) {

      console.log(error);
      alert("Error en login");

    }
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <h1>Login Admin</h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button onClick={login}>
          Iniciar sesión
        </button>

      </div>

    </div>
  );
};

export default Login;