import React from "react";
import Footer from "./Footer";
import { useAuthContext } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FaHeart, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import "../styles/notFound.css";

function Profile() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // si no hay sesión
  if (!user) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-warning">No hay sesión iniciada.</div>
      </div>
    );
  }

  return (
    <div className="container mt-5 d-flex flex-column align-items-center">
      <Helmet>
        <title>Mi Perfil | Pinicrochet</title>
        <meta name="description" content="Perfil de usuario." />
      </Helmet>

      <div className="admin-welcome-card text-center p-4 mb-4">
        <h4 className="cute-title">¡Hola!</h4>
        <p>Sesión iniciada como <strong>{user?.email || user}</strong></p>

        <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
         {/* <Link to="/miCarrito" className="btn btn-outline-primary">
            <FaShoppingCart className="me-2" />
            Ir a mi carrito
          </Link>*/}
          <Link to="/favoritos" className="btn btn-outline-primary">
            <FaHeart className="me-2" />
            Ver mis favoritos
          </Link>
        </div>

        <div className="text-center mt-4">
          <button className="btn btn-danger" onClick={handleLogout}>
            <FaSignOutAlt className="me-2" />
            Cerrar sesión
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Profile;
