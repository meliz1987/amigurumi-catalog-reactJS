import { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "../styles/productDetail.css";
import { executeBasicSweet } from "../assets/SweetAlert";
import loadingGif from "../assets/loadingSpinner.gif";
import { Button, Card as BootstrapCard } from "react-bootstrap";
import Footer from "./Footer";
import { FavoritesContext } from "../contexts/FavoritesContext";
import { BsInstagram } from "react-icons/bs";

import { useAuthContext } from "../contexts/AuthContext";

import { BsHeart, BsHeartFill } from "react-icons/bs";

function ProductDetail() {
  const navigate = useNavigate();

  const { id } = useParams();

  const { user, isAdmin } = useAuthContext();

  const { favoriteProducts, addFavorite, deleteFavorite } =
    useContext(FavoritesContext);

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://68100d8c27f2fdac24101f1f.mockapi.io/products")
      .then((res) => res.json())
      .then((data) => {
        const productFound = data.find((item) => item.id === id);

        if (productFound) {
          setProduct(productFound);
        } else {
          setError("Producto no encontrado.");
        }

        setLoading(false);
      })
      .catch((err) => {
        console.log("Error:", err);

        setError("Hubo un error al obtener el producto.");

        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <img src={loadingGif} alt="Cargando..." className="loading-gif" />

        <p className="cute-title">Cargando producto...</p>
      </div>
    );
  }

  if (error) return <p>{error}</p>;

  if (!product) return null;

  const isFavorite = favoriteProducts.some((p) => p.id === product.id);

  function handleFavorite() {
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

      executeBasicSweet("Eliminado", "Se quitó de favoritos", "info", "Cerrar");
    } else {
      addFavorite(product);

      executeBasicSweet(
        "Guardado",
        "Se agregó a favoritos",
        "success",
        "Cerrar",
      );
    }
  }

  function goProducts() {
    navigate("/productos");
  }

  return (
    <div>
      <div className="detail-container">
        <BootstrapCard className="product-detail-card shadow-sm">
          <BootstrapCard.Img
            variant="top"
            src={product.image}
            alt={product.name}
            className="detail-image"
          />

          <BootstrapCard.Body>
            <BootstrapCard.Title> {product.name} </BootstrapCard.Title>
            <BootstrapCard.Text> {product.description} </BootstrapCard.Text>
           {product.productionTime && (<BootstrapCard.Text className="text-muted">
    Plazo estimado de entrega: {product.productionTime}
  </BootstrapCard.Text>)}

            {isAdmin ? (
              <BootstrapCard.Text>
                <strong>$ {product.price}</strong>
              </BootstrapCard.Text>
            ) : (
              <BootstrapCard.Text className="text-muted">
                Consultar precio por Instagram 💕
              </BootstrapCard.Text>
            )}

            <div className="mt-4">
              {/* fila principal */}
              <div className="d-flex flex-column flex-md-row gap-2 justify-content-center">
                {user && (
                  <Button
                    variant={isFavorite ? "danger" : "outline-danger"}
                    onClick={handleFavorite}
                  >
                    {isFavorite ? (
                      <>
                        <BsHeartFill /> Quitar favorito </> ) : (
                      <>
                        <BsHeart /> Agregar a favoritos
                      </>
                    )}
                  </Button>
                )}

                <Button variant="primary" onClick={goProducts}>
                  Ver más productos
                </Button>
              </div>

              {/* botón principal */}
              <div className="text-center mt-3">
                <Button
                  as="a"
                  href="https://instagram.com/pinicrochet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-instagram"
                >
                  <BsInstagram className="me-2" />
                  ¡Lo quiero!
                </Button>
              </div>

              {/* favoritos */}
              {user && isFavorite && (
                <div className="text-center mt-3">
                  <Link to="/favoritos">
                    <Button variant="outline-primary">
                      Ir a mis favoritos
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </BootstrapCard.Body>
        </BootstrapCard>
      </div>

      <Footer />
    </div>
  );
}

export default ProductDetail;
