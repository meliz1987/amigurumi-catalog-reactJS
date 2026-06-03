import { Link } from "react-router-dom";
import { BsInstagram, BsTiktok,BsFacebook } from "react-icons/bs";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-inner container">
        <div className="row">

          {/* Mapa del sitio */}
          <div className="col-12 col-md-4">
            <h5>Mapa del sitio</h5>
            <ul className="footer-links">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/productos">Productos</Link></li>
              <li><Link to="/nosotros">Nosotros</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </div>

          {/* Info de Pinicrochet */}
          <div className="col-12 col-md-4">
            <h5>Pinicrochet</h5>
            <p>Amigurumis con alma, hechos con amor 💕</p>

            {/* Iconos de redes */}
            <div className="social-icons">
              <a href="https://www.instagram.com/pinicrochet" target="_blank" rel="noopener noreferrer">
                <BsInstagram />
              </a>
              <a href="https://www.tiktok.com/@pinicrochet" target="_blank" rel="noopener noreferrer">
                <BsTiktok />
              </a>
              <a href="https://www.facebook.com/pinicrochet.ba" target="_blank" rel="noopener noreferrer">
                <BsFacebook />
              </a>
            </div>
          </div>

          {/* Contacto */}
          <div className="col-12 col-md-4">
            <h5>Contacto</h5>
            <p>pinicrochet@gmail.com</p>
            <p className="footer-copy">
              &copy; 2025 – Proyecto React de Mariana Elizondo para Talento Tech
              <br />Todos los derechos reservados.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
