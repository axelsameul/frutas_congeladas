import Productos from "./Productos";
import "./Home.css";
import Opiniones from "../components/Opiniones";

const Home = () => {
  return (
    <>
      <section className="hero">
        <div className="hero-overlay">
          <h1>Frutas Congeladas Tucumán</h1>

          <p>
            Frutillas, Arándanos, Frambuesas y mucho más.
            Productos frescos, congelados y listos para disfrutar.
          </p>

          <a href="#productos" className="hero-btn">
            Ver Productos
          </a>
        </div>
      </section>

      <div id="productos">
        <Productos />
      </div>
      <Opiniones/>
    </>
  );
};

export default Home;