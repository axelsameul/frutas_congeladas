import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import api from "../api/api";
import "./Checkout.css";

const Checkout = () => {
  const { carrito, total, vaciarCarrito } = useCarrito();
  const navigate = useNavigate();

  const [datos, setDatos] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
    observaciones: "",
    formaPago: "",
  });

  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);

  // =========================
  // CAMBIAR INPUTS
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDatos((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrores((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // =========================
  // VALIDAR FORMULARIO
  // =========================

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!datos.nombre.trim()) {
      nuevosErrores.nombre = "Debe ingresar su nombre.";
    }

    if (!datos.telefono.trim()) {
      nuevosErrores.telefono = "Debe ingresar su teléfono.";
    }

    if (!datos.direccion.trim()) {
      nuevosErrores.direccion = "Debe ingresar una dirección.";
    }

    if (!datos.formaPago) {
      nuevosErrores.formaPago =
        "Debe seleccionar una forma de pago.";
    }

    if (carrito.length === 0) {
      alert("El carrito está vacío.");
      return false;
    }

    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  // =========================
  // CONFIRMAR PEDIDO
  // =========================

  const finalizarCompra = async () => {
    if (!validarFormulario()) {
      return;
    }

    setCargando(true);

    try {
      const pedido = {
        cliente: {
          nombre: datos.nombre.trim(),
          telefono: datos.telefono.trim(),
          direccion: datos.direccion.trim(),
        },

        productos: carrito,

        total: Number(total),

        observaciones: datos.observaciones.trim(),

        formaPago: datos.formaPago,
      };

      console.log("ENVIANDO PEDIDO:", pedido);

      const respuesta = await api.post(
        "/pedidos",
        pedido
      );

      console.log(
        "PEDIDO CREADO:",
        respuesta.data
      );

      // =========================
      // WHATSAPP
      // =========================

      let mensaje =
        "🍓 *NUEVO PEDIDO*%0A%0A";

      mensaje +=
        `👤 *Cliente:* ${datos.nombre}%0A`;

      mensaje +=
        `📞 *Teléfono:* ${datos.telefono}%0A`;

      mensaje +=
        `📍 *Dirección:* ${datos.direccion}%0A`;

      mensaje +=
        `💳 *Forma de pago:* ${datos.formaPago}%0A`;

      if (datos.observaciones.trim()) {
        mensaje +=
          `📝 *Observaciones:* ${datos.observaciones}%0A`;
      }

      mensaje +=
        "%0A🛒 *PRODUCTOS*%0A";

      carrito.forEach((producto) => {
        const precio = Number(producto.precio);
        const cantidad = Number(producto.cantidad);

        const subtotal = precio * cantidad;

        mensaje +=
          `• ${producto.nombre} x${cantidad} - $${subtotal}%0A`;
      });

      mensaje +=
        `%0A💰 *TOTAL:* $${Number(total)}`;

      const numero = "3813676949";

      window.open(
        `https://wa.me/${numero}?text=${mensaje}`,
        "_blank"
      );

      // =========================
      // VACIAR CARRITO
      // =========================

      if (vaciarCarrito) {
        vaciarCarrito();
      }

      alert(
        "Pedido registrado correctamente."
      );

      navigate("/");
    } catch (error) {
      console.error(
        "ERROR AL REGISTRAR PEDIDO:",
        error
      );

      console.error(
        "RESPUESTA DEL BACKEND:",
        error.response?.data
      );

      alert(
        error.response?.data?.error ||
        "Ocurrió un error al registrar el pedido."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="checkout-container">

      <div className="checkout-card">

        {/* =========================
            TITULO
        ========================= */}

        <h1 className="checkout-titulo">
          Finalizar Compra
        </h1>

        <p className="checkout-descripcion">
          Completá tus datos para realizar el pedido.
        </p>

        {/* =========================
            FORMULARIO
        ========================= */}

        <div className="checkout-form">

          {/* NOMBRE */}

          <div className="checkout-grupo">

            <label className="checkout-label">
              Nombre Completo
            </label>

            <input
              type="text"
              name="nombre"
              value={datos.nombre}
              onChange={handleChange}
              placeholder="Ingrese su nombre"
              className={`checkout-input ${
                errores.nombre
                  ? "input-error"
                  : ""
              }`}
            />

            {errores.nombre && (
              <p className="mensaje-error">
                {errores.nombre}
              </p>
            )}

          </div>

          {/* TELEFONO */}

          <div className="checkout-grupo">

            <label className="checkout-label">
              Teléfono
            </label>

            <input
              type="text"
              name="telefono"
              value={datos.telefono}
              onChange={handleChange}
              placeholder="Ej: 3811234567"
              className={`checkout-input ${
                errores.telefono
                  ? "input-error"
                  : ""
              }`}
            />

            {errores.telefono && (
              <p className="mensaje-error">
                {errores.telefono}
              </p>
            )}

          </div>

          {/* DIRECCION */}

          <div className="checkout-grupo">

            <label className="checkout-label">
              Dirección
            </label>

            <input
              type="text"
              name="direccion"
              value={datos.direccion}
              onChange={handleChange}
              placeholder="Ej: Lomas de Tafí"
              className={`checkout-input ${
                errores.direccion
                  ? "input-error"
                  : ""
              }`}
            />

            {errores.direccion && (
              <p className="mensaje-error">
                {errores.direccion}
              </p>
            )}

          </div>

          {/* =========================
              FORMA DE PAGO
          ========================= */}

          <div className="checkout-pago-opciones">

            <h2 className="checkout-subtitulo">
              Forma de pago
            </h2>

            <label className="checkout-opcion-pago">

              <input
                type="radio"
                name="formaPago"
                value="Transferencia"
                checked={
                  datos.formaPago ===
                  "Transferencia"
                }
                onChange={handleChange}
              />

              <span>
                💳 Transferencia bancaria
              </span>

            </label>

            <label className="checkout-opcion-pago">

              <input
                type="radio"
                name="formaPago"
                value="Efectivo"
                checked={
                  datos.formaPago === "Efectivo"
                }
                onChange={handleChange}
              />

              <span>
                💵 Efectivo
              </span>

            </label>

            {errores.formaPago && (
              <p className="mensaje-error">
                {errores.formaPago}
              </p>
            )}

          </div>

          {/* =========================
              OBSERVACIONES
          ========================= */}

          <div className="checkout-grupo">

            <label className="checkout-label">
              Observaciones
            </label>

            <textarea
              name="observaciones"
              value={datos.observaciones}
              onChange={handleChange}
              placeholder="Ej: llamar antes de llegar..."
              rows="4"
              className="checkout-textarea"
            />

          </div>

        </div>

        {/* =========================
            RESUMEN DEL PEDIDO
        ========================= */}

        <div className="checkout-resumen">

          <h2 className="checkout-subtitulo">
            Resumen del Pedido
          </h2>

          {carrito.map((producto, index) => {

            const precio = Number(
              producto.precio
            );

            const cantidad = Number(
              producto.cantidad
            );

            const subtotal =
              precio * cantidad;

            return (
              <div
                key={
                  producto.id_producto ||
                  producto.id ||
                  index
                }
                className="checkout-producto"
              >

                <div>

                  <h4>
                    {producto.nombre}
                  </h4>

                  <small>
                    ${precio} x {cantidad}
                  </small>

                </div>

                <strong>
                  ${subtotal}
                </strong>

              </div>
            );
          })}

          <hr />

          <div className="checkout-total">

            <span>
              Total
            </span>

            <strong>
              ${Number(total)}
            </strong>

          </div>

        </div>

        {/* =========================
            DATOS TRANSFERENCIA
        ========================= */}

        <div className="checkout-pago">

          <h2 className="checkout-subtitulo">
            Datos para Transferencia
          </h2>

          <p className="checkout-dato">
            <strong>
              Alias:
            </strong>{" "}
            FRUTAS.CONGELADAS
          </p>

          <p className="checkout-dato">
            <strong>
              CBU:
            </strong>{" "}
            0000000000000000000000
          </p>

          <p className="checkout-dato">
            Una vez realizada la transferencia,
            enviá el comprobante por WhatsApp.
          </p>

        </div>

        {/* =========================
            BOTON
        ========================= */}

        <button
          type="button"
          className="checkout-boton"
          onClick={finalizarCompra}
          disabled={cargando}
        >
          {cargando
            ? "Registrando pedido..."
            : "🍓 Confirmar Pedido"}
        </button>

      </div>

    </div>
  );
};

export default Checkout;