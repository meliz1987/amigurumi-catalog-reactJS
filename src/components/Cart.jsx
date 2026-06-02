import "../styles/cart.css";
import { BsTrash } from "react-icons/bs";
import { executeBasicSweet, confirmSweetAlert } from "../assets/SweetAlert";
import { Card as BootstrapCard, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { useAuthContext } from "../contexts/AuthContext";
import { Helmet } from "react-helmet-async";
import Footer from "./Footer";
import { FaLock } from "react-icons/fa";

export default function Cart() {
  const { user } = useAuthContext();
  const { productsCart, deleteProductCart, clearCart } = useContext(CartContext);

  /*Si NO está logueado: aviso*/
  if (!user) {
    return (
      <div className="text-center mt-5 not-logged-container">
        <FaLock size={50} className="bounce-icon" />
        <h2 className="cute-title">Acceso restringido</h2>
        <p className="mb-4">Para ver tu carrito, primero tenés que iniciar sesión.</p>
        <Link to="/login">
          <Button variant="outline-primary" className="btn-custom">Iniciar sesión</Button>
        </Link>
      </div>
    );
  }

  /*   Confirmar antes de vaciar todo el carrito */
  async function handleClearCart() {
    const result = await confirmSweetAlert({
      title: "¿Estás seguro de vaciar el carrito?",
      confirmText: "Sí",
      denyText: "No"
    });

    if (result.isConfirmed) {
      clearCart();
      executeBasicSweet(
        "Carrito vacío",
        "Se eliminaron todos los productos del carrito",
        "info",
        "Cerrar"
      );
    }
  }

  /* Calcular total*/

  const total = productsCart.reduce(
    (sub, p) => sub + Number(p.price) * Number(p.quantity),
    0
  );

  /*Eliminar una unidad o todo*/
  function TriggerFunction(id, removeAll = true) {
    if (removeAll) {
      executeBasicSweet("Producto Eliminado","El producto fue eliminado del carrito","info","Cerrar");
      deleteProductCart(id, true);
    } else {
      executeBasicSweet("Unidad Eliminada","Se eliminó una unidad del producto","info","Cerrar");
      deleteProductCart(id, false);
    }
  }

  /*Render */

  return (
    <>
      <Helmet>
        <title>Mis Favoritos | Pinicrochet</title>
        <meta name="description" content="Carrito de compras." />
      </Helmet>

      <h2 className="mb-4 cute-title">Mi carrito</h2>

      <div className="cart-container">

        {/* Botón vaciar */}
        {productsCart.length > 0 && (
          <Button
            variant="outline-danger"
            className="mb-3"
            onClick={handleClearCart}
          >
            Vaciar carrito
          </Button>
        )}

        {/* Lista de productos */}
        {productsCart.length > 0 ? (
          productsCart.map((product) => (
            <BootstrapCard key={product.id} className="mb-3 shadow-sm cart-item-card">
              <div className="d-flex align-items-center">
                <BootstrapCard.Img
                  src={product.image}
                  style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8, margin: 10 }}
                />
                <BootstrapCard.Body>
                  <BootstrapCard.Title>{product.name}</BootstrapCard.Title>
                  <BootstrapCard.Text>
                    Cantidad: {product.quantity}<br />
                    Precio unitario: ${Number(product.price).toFixed(2)}<br />
                    Subtotal: ${(product.price * product.quantity).toFixed(2)}
                  </BootstrapCard.Text>

                  <div className="d-flex gap-2 mt-2">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => TriggerFunction(product.id, false)}
                    >
                      -1 unidad
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => TriggerFunction(product.id, true)}
                    >
                      <BsTrash /> Eliminar todo
                    </Button>
                  </div>
                </BootstrapCard.Body>
              </div>
            </BootstrapCard>
          ))
        ) : (
          <h3 className="cute-title">Tu carrito está vacío 🛒</h3>
        )}

        {/* Total */}
        {total > 0 && (
          <span className="cartSpan cute-title">
            Total a pagar: ${total.toFixed(2)}
          </span>
        )}
      </div>

      {/* Botones finales */}
      {productsCart.length > 0 ? (
        <div className="d-flex gap-2 justify-content-center mt-3">
          <Link to="/checkout"><Button variant="success">Continuar a Pagar</Button></Link>
          <Link to="/productos"><Button variant="primary">Seguir comprando</Button></Link>
        </div>
      ) : (
        <div className="d-flex justify-content-center mt-3">
          <Link to="/productos"><Button variant="secondary">Volver a Productos</Button></Link>
        </div>
      )}

      <br />
      <Footer />
    </>
  );
}
