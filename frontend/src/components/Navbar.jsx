import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useCarrito } from "../context/CarritoContext";

const Navbar = () => {
  const navigate = useNavigate();

  const [menuAbierto, setMenuAbierto] = useState(false);

  // =========================
  // CARRITO
  // =========================

  const { cantidadTotal } = useCarrito();

  const token = localStorage.getItem("token");

  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    setMenuAbierto(false);

    alert("Sesión cerrada");

    navigate("/");
  };

  return (
    <header className="navbar">

      {/* =========================
          LOGO
      ========================= */}

      <div className="navbar-logo">

        <Link
          to="/"
          onClick={cerrarMenu}
        >
          🍓 Frutitasbyfrancesca
        </Link>

      </div>


      {/* =========================
          BOTÓN HAMBURGUESA
      ========================= */}

      <button
        className={`navbar-hamburger ${
          menuAbierto ? "activo" : ""
        }`}
        onClick={() => setMenuAbierto(!menuAbierto)}
        aria-label="Abrir menú"
        aria-expanded={menuAbierto}
      >

        <span></span>
        <span></span>
        <span></span>

      </button>


      {/* =========================
          CONTENIDO
      ========================= */}

      <div
        className={`navbar-contenido ${
          menuAbierto ? "menu-abierto" : ""
        }`}
      >

        {/* =========================
            MENÚ
        ========================= */}

        <nav className="navbar-menu">

          {/* INICIO */}

          <Link
            className="navbar-link"
            to="/"
            onClick={cerrarMenu}
          >
            Inicio
          </Link>


          {/* PRODUCTOS */}

          <Link
            className="navbar-link"
            to="/productos"
            onClick={cerrarMenu}
          >
            Productos
          </Link>
           
         


          {/* =========================
              CARRITO CLIENTE
          ========================= */}

          {!token && (

            <Link
              className="navbar-link navbar-carrito"
              to="/carrito"
              onClick={cerrarMenu}
            >

              🛒 Carrito


              {/* =========================
                  CONTADOR
              ========================= */}

              {cantidadTotal > 0 && (

                <span className="carrito-contador">
                  {cantidadTotal}
                </span>

              )}

            </Link>

          )}


          {/* =========================
              ADMIN
          ========================= */}

          {token && (

            <>

              <Link
                className="navbar-link"
                to="/admin"
                onClick={cerrarMenu}
              >
                📦 Productos
              </Link>


              <Link
                className="navbar-link"
                to="/admin/pedidos"
                onClick={cerrarMenu}
              >
                🛒 Pedidos
              </Link>

                 <Link
                className="navbar-link"
                to="/admin/opiniones"
                onClick={cerrarMenu}
              >
               opiniones
              </Link>
              <Link
                className="navbar-link"
                to="/admin/contabilidad"
                onClick={cerrarMenu}
              >
                📊 Contabilidad
              </Link>

            </>

          )}

        </nav>


        {/* =========================
            BOTÓN ADMIN / CERRAR SESIÓN
        ========================= */}

        <div className="navbar-actions">

          {!token ? (

            <Link
              className="navbar-login-btn"
              to="/login"
              onClick={cerrarMenu}
            >
              Administrador
            </Link>

          ) : (

            <button
              className="navbar-login-btn"
              onClick={cerrarSesion}
            >
              Cerrar sesión
            </button>

          )}

        </div>

      </div>

    </header>
  );
};

export default Navbar;