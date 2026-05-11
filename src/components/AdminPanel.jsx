import React, { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../assets/requests";
import ProductForm from "./ProductForm";
import { Card, Button, Container } from "react-bootstrap";
import { executeBasicSweet, confirmSweetAlert } from "../assets/SweetAlert";
import "../styles/product.css";
import { useMaterials } from "../contexts/MaterialsContext";

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  const { materialsCatalog, addMaterial, updateMaterial, deleteMaterial } =
    useMaterials();

  const [newMaterial, setNewMaterial] = useState({
    name: "",
    cost: "",
  });
  const [editingMaterialId, setEditingMaterialId] = useState(null);
  const [editingMaterial, setEditingMaterial] = useState({
    name: "",
    cost: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    getProducts()
      .then((data) => setProducts(data))
      .catch((err) => {
        console.error(err);
        executeBasicSweet(
          "Error",
          "No se pudieron cargar los productos",
          "error",
          "Cerrar",
        );
      });
  };

  const handleDelete = async (id) => {
    const result = await confirmSweetAlert({
      title: "¿Estás seguro de eliminar este producto?",
      confirmText: "Sí",
      denyText: "No",
    });

    if (result.isConfirmed) {
      try {
        await deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
        executeBasicSweet(
          "Producto eliminado",
          "El producto fue eliminado correctamente",
          "success",
          "Cerrar",
        );
      } catch (error) {
        console.error(error);
        executeBasicSweet(
          "Error",
          "No se pudo eliminar el producto",
          "error",
          "Cerrar",
        );
      }
    } else if (result.isDenied) {
      executeBasicSweet("Cancelado", "No se eliminó el producto", "info", "Ok");
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
    );
    setEditProduct(null);
  };

  const handleAdd = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  const handleAddMaterial = () => {
    if (!newMaterial.name.trim()) return;
    if (!newMaterial.cost || Number(newMaterial.cost) <= 0) return;

    addMaterial({
      name: newMaterial.name,
      cost: Number(newMaterial.cost),
    });

    setNewMaterial({
      name: "",
      cost: "",
    });
  };

  //edicion de catalogo de materiales-
  const handleStartEditMaterial = (material) => {
    setEditingMaterialId(material.id);
    setEditingMaterial({
      name: material.name,
      cost: material.cost,
    });
  };

  const handleSaveMaterial = () => {
    updateMaterial(editingMaterialId, {
      name: editingMaterial.name,
      cost: Number(editingMaterial.cost),
    });

    setEditingMaterialId(null);
    setEditingMaterial({
      name: "",
      cost: "",
    });
  };
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container className="my-4">
      <h2 className="text-center mb-4 cute-title">Administrar Productos</h2>

      <ProductForm
        mode={editProduct ? "edit" : "create"}
        initialData={editProduct}
        onSubmit={editProduct ? handleUpdate : handleAdd}
      />
 
      <Card className="p-3 mb-4">
       
        <div>
          <h4 className="mb-3 cute-title">Catálogo de materiales</h4>

          <div className="d-flex gap-2 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Material"
              value={newMaterial.name}
              onChange={(e) =>
                setNewMaterial({
                  ...newMaterial,
                  name: e.target.value,
                })
              }
            />

            <input
              type="number"
              className="form-control"
              placeholder="Precio"
              min="0"
              value={newMaterial.cost}
              onChange={(e) =>
                setNewMaterial({
                  ...newMaterial,
                  cost: e.target.value,
                })
              }
            />

            <Button onClick={handleAddMaterial}>Agregar</Button>
          </div>
          {materialsCatalog.map((material) => (
            <div
              key={material.id}
              className="d-flex justify-content-between align-items-center border-bottom py-2"
            >
              {editingMaterialId === material.id ? (
                <>
                  <div className="d-flex gap-2 flex-grow-1 me-3">
                    <input
                      type="text"
                      className="form-control"
                      value={editingMaterial.name}
                      onChange={(e) =>
                        setEditingMaterial({
                          ...editingMaterial,
                          name: e.target.value,
                        })
                      }
                    />

                    <input
                      type="number"
                      className="form-control"
                      value={editingMaterial.cost}
                      onChange={(e) =>
                        setEditingMaterial({
                          ...editingMaterial,
                          cost: e.target.value,
                        })
                      }
                    />
                  </div>

                  <Button
                    size="sm"
                    variant="success"
                    className="me-2"
                    onClick={handleSaveMaterial}
                  >
                    Guardar
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setEditingMaterialId(null);

                      setEditingMaterial({
                        name: "",
                        cost: "",
                      });
                    }}
                  >
                    Cancelar
                  </Button>
                </>
              ) : (
                <>
                  <span>
                    {material.name} — ${material.cost}
                  </span>

                  <div className="d-flex gap-2">
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => handleStartEditMaterial(material)}
                    >
                      Editar
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => deleteMaterial(material.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </Card>
      

      <h3 className="mt-5 mb-3 cute-title"> Catálogo de productos actuales</h3>

      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar producto por nombre..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Cards en lista vertical */}
      <div className="d-flex flex-column gap-4">
        {currentProducts.map((product) => (
          <Card
            key={product.id}
            className="shadow-sm d-flex flex-row align-items-center p-3 gap-3"
          >
            <div style={{ flex: "0 0 150px" }}>
              <Card.Img
                src={product.image}
                alt={product.name}
                style={{
                  height: "150px",
                  width: "150px",
                  objectFit: "cover",
                  borderRadius: "0.5rem",
                }}
              />
            </div>

            <div style={{ flex: "1" }}>
              <Card.Body className="p-0">
                <Card.Title className="mb-1">{product.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  ${product.price}
                </Card.Subtitle>
                <Card.Text className="mb-2">{product.description}</Card.Text>

                <div className="d-flex gap-2">
                  <Button variant="warning" onClick={() => handleEdit(product)}>
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(product.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </Card.Body>
            </div>
          </Card>
        ))}
      </div>

      {/* Paginador */}
      <div className="d-flex justify-content-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`btn mx-1 ${currentPage === index + 1 ? "btn-pag-active" : "btn-pag-inactive"}`}
            onClick={() => changePage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Botón scroll */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="btn btn-primary"
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            fontSize: "1.5rem",
            zIndex: 1000,
            backgroundColor: "#6f57cf",
            borderColor: "#6f57cf",
            color: "white",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          }}
        >
          ↑
        </button>
      )}
    </Container>
  );
}

export default AdminPanel;
