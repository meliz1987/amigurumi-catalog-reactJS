import { Button, Card as BootstrapCard } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/product.css";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { FavoritesContext } from "../contexts/FavoritesContext";
import { useAuthContext } from "../contexts/AuthContext";
import { executeBasicSweet } from "../assets/SweetAlert";

function Card({ product }) {
  /*logica de agregar a favoritos */
  const navigate = useNavigate();

  const { user, isAdmin } = useAuthContext();

  const { favoriteProducts, addFavorite, deleteFavorite } =
    useContext(FavoritesContext);

  const isFavorite = favoriteProducts.some((p) => p.id === product.id);

  function handleFavorite(e) {
    e.preventDefault();

    if (!user) {
      executeBasicSweet(
        "Iniciá sesión",
        "Tenés que iniciar sesión para guardar favoritos",
        "info",
        "Cerrar",
      );

      navigate("/login");

      return;
    }

    if (isFavorite) {
      deleteFavorite(product.id);
    } else {
      addFavorite(product);
    }
  }
  return (
    <BootstrapCard className="product-card shadow-sm mb-3">
      <div className="favorite-icon"  onClick={handleFavorite}>
    {isFavorite ? ( <BsHeartFill /> ) : (<BsHeart /> )}
  </div>
      <Link to={`/productos/${product.id}`}>     
        <BootstrapCard.Img
          variant="top"
          src={product.image}
          alt={product.name}
          className="product-image"
        />
      </Link>
      <BootstrapCard.Body>
        <BootstrapCard.Title>{product.name}</BootstrapCard.Title>
       {isAdmin ? (
  <BootstrapCard.Text>
    <strong>$ {product.price}</strong>
  </BootstrapCard.Text>
) : (
  <BootstrapCard.Text className="text-muted">
    Consultar precio por Instagram 💕
  </BootstrapCard.Text>
)}
        <Link to={`/productos/${product.id}`}>
          <Button style={{ background: "#4f4ba1", borderColor: "#4f4ba1" }}>
            Ver más
          </Button>
        </Link>
        <a
          href="https://www.instagram.com/pinicrochet/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            style={{
              background: "#E1306C",
              borderColor: "#E1306C",
              marginLeft: "8px",
            }}
          >
            Lo quiero! 💕
          </Button>
        </a>
      </BootstrapCard.Body>
    </BootstrapCard>
  );
}

export default Card;
