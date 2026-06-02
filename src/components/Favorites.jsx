import Footer from "./Footer";
import "../styles/cart.css";
import { BsTrash, BsHeartFill } from "react-icons/bs";
import {executeBasicSweet, confirmSweetAlert,} from "../assets/SweetAlert";
import {Card as BootstrapCard, Button,} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { useFavoritesContext } from "../contexts/FavoritesContext";
import { Helmet } from "react-helmet-async";
import { FaLock } from "react-icons/fa";

function Favorites() {
  const { user } = useAuthContext();

 const { favoriteProducts,  deleteFavorite,clearFavorites} = useFavoritesContext();

  /* si NO está logueado */
  if (!user) {
    return (
      <div className="text-center mt-5 not-logged-container">
        <FaLock
          size={50}
          className="bounce-icon"
        />

        <h2 className="cute-title">
          Acceso restringido
        </h2>

        <p className="mb-4">
          Para ver tus favoritos primero tenés
          que iniciar sesión.
        </p>

        <Link to="/login">
          <Button
            variant="outline-primary"
            className="btn-custom"
          >
            Iniciar sesión
          </Button>
        </Link>
      </div>
    );
  }

  async function handleClearFavorites() {
    const result =
      await confirmSweetAlert({
        title:
          "¿Eliminar todos tus favoritos?",
        confirmText: "Sí",
        denyText: "No",
      });

    if (result.isConfirmed) {
      clearFavorites();

      executeBasicSweet(
        "Favoritos vacíos",
        "Se eliminaron todos tus favoritos",
        "info",
        "Cerrar"
      );
    }
  }

  function handleRemoveFavorite(id) {
    executeBasicSweet(
      "Eliminado",
      "Se quitó de favoritos",
      "info",
      "Cerrar"
    );

    deleteFavorite(id, true);
  }

  return (
    <>
      <Helmet>
        <title>
          Mis Favoritos | Pinicrochet
        </title>

        <meta
          name="description"
          content="Lista de favoritos."
        />
      </Helmet>

      <h2 className="mb-4 cute-title">
        <BsHeartFill /> Mis Favoritos
      </h2>

      <div className="cart-container">
        {favoriteProducts.length > 0 && (
          <Button
            variant="outline-danger"
            className="mb-3"
            onClick={
              handleClearFavorites
            }
          >
            Vaciar favoritos
          </Button>
        )}

        {favoriteProducts.length > 0 ? (
          favoriteProducts.map(
            (product) => (
              <BootstrapCard
                key={product.id}
                className="mb-3 shadow-sm cart-item-card"
              >
                <div className="d-flex align-items-center">
                  <BootstrapCard.Img
                    src={
                      product.image
                    }
                    style={{
                      width: 120,
                      height: 120,
                      objectFit:
                        "cover",
                      borderRadius: 8,
                      margin: 10,
                    }}
                  />

                  <BootstrapCard.Body>
                    <BootstrapCard.Title>
                      {
                        product.name
                      }
                    </BootstrapCard.Title>

                    <BootstrapCard.Text>
                      Precio: $
                      {Number(
                        product.price
                      ).toFixed(
                        2
                      )}
                    </BootstrapCard.Text>

                    <div className="d-flex gap-2 mt-2">
                      <Link
                        to={`/productos/${product.id}`}
                      >
                        <Button
                          variant="outline-primary"
                          size="sm"
                        >
                          Ver detalle
                        </Button>
                      </Link>

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() =>
                          handleRemoveFavorite(
                            product.id
                          )
                        }
                      >
                        <BsTrash /> Eliminar
                      </Button>
                    </div>
                  </BootstrapCard.Body>
                </div>
              </BootstrapCard>
            )
          )
        ) : (
          <h3 className="cute-title">
            No tenés favoritos
            guardados 💕
          </h3>
        )}
      </div>

      <div className="d-flex justify-content-center mt-3">
        <Link to="/productos">
          <Button variant="secondary">
            Ver productos
          </Button>
        </Link>
      </div>

      <br />
      <Footer />
    </>
  );
}

export default Favorites;