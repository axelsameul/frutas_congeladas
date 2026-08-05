import React from "react";
import "./Footer.css";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-brand">
          <h2>🍓 Frutalia</h2>
          <p>
            Frutas congeladas seleccionadas con la mejor calidad 
            para tus comidas, licuados y postres.
          </p>
        </div>


        <div className="footer-links">
          <h3>Productos</h3>
          <a href="#">Frutillas</a>
          <a href="#">Arándanos</a>
          <a href="#">Mix tropical</a>
          <a href="#">Frutas premium</a>
        </div>


        <div className="footer-links">
          <h3>Ayuda</h3>
          <a href="#">Preguntas frecuentes</a>
          <a href="#">Envíos</a>
          <a href="#">Medios de pago</a>
          <a href="#">Contacto</a>
        </div>


        <div className="footer-contact">
          <h3>Seguinos</h3>

          <div className="social">

            <a 
              href="https://www.instagram.com/_frutitasbyfrancesca?igsh=MW5wM3ZrNjBjd3YwMA==" 
              className="social-icon instagram"
            >
              <FaInstagram />
            </a>


            

          </div>

          <p>📍 Lomas De Tafi  Sector 6 Manzana 1 Casa 28</p>
          <p>📞 3815836878</p>

        </div>

      </div>


      <div className="footer-bottom">
        © 2026 Frutalia - Todos los derechos reservados
      </div>

    </footer>
  );
};

export default Footer;