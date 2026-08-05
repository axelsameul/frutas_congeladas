import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Productos from "../pages/Productos";
import Login from "../pages/Login";
import Admin from "../pages/Admin";
import Checkout from "../pages/Checkout";
import Carrito from "../pages/Carrito";
import Pedidos from "../pages/Pedidos";
import Contabilidad from "../pages/Contabilidad";
import Opiniones from "../components/Opiniones";
import AdminOpiniones from "../pages/AdminOpiniones";
const AppRoutes = () => {

  return (

    <Routes>

      {/* CLIENTE */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/productos"
        element={<Productos />}
      />
      <Route
        path="/opiniones"
        element={<Opiniones />}
      />
      <Route 
      path="/admin/opiniones"
       element={<AdminOpiniones/>}
      />

      <Route
        path="/carrito"
        element={<Carrito />}
      />

      <Route
        path="/checkout"
        element={<Checkout />}
      />

      {/* LOGIN */}

      <Route
        path="/login"
        element={<Login />}
      />

      {/* ADMIN */}

      <Route
        path="/admin"
        element={<Admin />}
      />
      <Route
      path="/admin/pedidos"
      element={<Pedidos />}
        /> 
        <Route
        path="/admin/contabilidad"
        element={<Contabilidad />}
      />
    </Routes>

  );

};

export default AppRoutes;