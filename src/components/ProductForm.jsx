import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { executeBasicSweet } from "../assets/SweetAlert";
import { addProduct, updateProduct } from "../assets/requests";
import { useAuthContext } from "../contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import "../styles/login.css";
import { ProductsContext } from "../contexts/ProductsContext";
import Footer from "./Footer";
import { useSettings } from "../contexts/SettingsContext";
import { useMaterials } from "../contexts/MaterialsContext";

function ProductForm({ mode = "create", initialData = null, onSubmit }) {
  const { admin } = useAuthContext();
  const { settings } = useSettings();
  const { materialsCatalog } = useMaterials();
  const { addProduct: addToContext, editProduct: editInContext } =
    useContext(ProductsContext);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    productionTime: "",
    timeSpent: 0,
    materials: [],
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setProduct({
        name: "",
        price: "",
        description: "",
        image: "",
        productionTime: "",
        timeSpent: 0,
        materials: [],
        ...initialData,
      });
    }
  }, [initialData, mode]);

  const validateForm = () => {
    if (!product.name.trim()) return "El nombre es obligatorio.";
    if (!product.price || product.price <= 0)
      return "El precio debe ser mayor a 0.";
    if (!product.description.trim() || product.description.length < 10)
      return "La descripción debe tener al menos 10 caracteres.";
    if (!product.image.trim())
      return "La URL de la imagen no debe estar vacía.";
    if (!product.productionTime) {
      return "Debe indicar un tiempo de elaboración.";
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const materialsCost = (product.materials || []).reduce(
    (total, material) => total + Number(material.cost || 0),
    0,
  );

  const laborCost = Number(product.timeSpent || 0) * settings.hourlyRate;

  const suggestedPrice = (laborCost + materialsCost) * settings.profitIndex;

  const addMaterial = () => {
    setProduct({
      ...product,
      materials: [...product.materials, { name: "", cost: 0 }],
    });
  };

  const handleMaterialChange = (index, field, value) => {
    const updatedMaterials = [...product.materials];

    updatedMaterials[index][field] = field === "cost" ? Number(value) : value;

    setProduct({
      ...product,
      materials: updatedMaterials,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valid = validateForm();
    if (valid !== true) {
      executeBasicSweet("Error en el formulario", valid, "error", "Cerrar");
      return;
    }

    try {
      if (mode === "edit") {
        const productToSave = {
          ...product,
          price: Number(suggestedPrice.toFixed(2)),
        };
        const updated = await updateProduct(product.id, productToSave);
        editInContext(updated); // sincroniza con contexto global
        executeBasicSweet(
          "Producto actualizado",
          "Los cambios fueron guardados",
          "success",
          "Cerrar",
        );
        onSubmit?.(updated);
      } else {
        const productToSave = {
          ...product,
          price: Number(suggestedPrice.toFixed(2)),
        };

        const newProduct = await addProduct(productToSave);
        addToContext(newProduct); // sincroniza con contexto global
        executeBasicSweet(
          "Producto agregado",
          "Se agregó correctamente",
          "success",
          "Cerrar",
        );
        setProduct({ name: "", price: "", description: "", image: "" });
        onSubmit?.(newProduct);
      }
    } catch (error) {
      executeBasicSweet(
        "Error",
        error.message || "Ocurrió un problema",
        "error",
        "Cerrar",
      );
    }
  };

  if (!admin) return <Navigate to="/login" replace />;

  return (
    <div>
      <Container className="d-flex justify-content-center align-items-center mt-4">
        <Card
          className="login-card p-4"
          style={{ width: "100%", maxWidth: "600px" }}
        >
          <div className="card-header text-center">
            <h3>{mode === "edit" ? "Editar Producto" : "Agregar Producto"}</h3>
          </div>
          <Form onSubmit={handleSubmit} className="mt-3">
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                placeholder="Nombre del producto"
                required
              />
            </Form.Group>

            <Form.Group controlId="image" className="mb-3">
              <Form.Label>URL de la Imagen</Form.Label>
              <Form.Control
                type="text"
                name="image"
                value={product.image}
                onChange={handleChange}
                placeholder="https://..."
                required
              />
              {product.image.trim() && (
                <div className="text-center mt-3">
                  <img
                    src={product.image}
                    alt="Vista previa"
                    style={{
                      height: "120px",
                      width: "120px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      border: "2px solid white",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                    }}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              )}
            </Form.Group>
            <Form.Group controlId="description" className="mb-4">
              <Form.Label>Descripción</Form.Label>

              <Form.Control
                as="textarea"
                name="description"
                value={product.description}
                onChange={handleChange}
                rows={3}
                required
              />
            </Form.Group>

            <Form.Group controlId="timeSpent" className="mb-3">
              <Form.Label>Horas trabajadas</Form.Label>
              <Form.Control
                type="number"
                name="timeSpent"
                value={product.timeSpent}
                onChange={handleChange}
                min="0"
                step="0.1"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Materiales</Form.Label>

              {product.materials.map((material, index) => (
                <div key={index} className="d-flex gap-2 mb-2">
                  <Form.Select
                    value={material.name}
                    onChange={(e) => {
                      const selectedMaterial = materialsCatalog.find(
                        (m) => m.name === e.target.value,
                      );

                      const updatedMaterials = [...product.materials];

                      updatedMaterials[index] = {
                        name: selectedMaterial.name,
                        cost: selectedMaterial.cost,
                      };

                      setProduct({
                        ...product,
                        materials: updatedMaterials,
                      });
                    }}
                  >
                    <option value="">Seleccionar material</option>

                    {materialsCatalog.map((catalogMaterial) => (
                      <option
                        key={catalogMaterial.id}
                        value={catalogMaterial.name}
                      >
                        {catalogMaterial.name}
                      </option>
                    ))}
                  </Form.Select>

                  <Form.Control type="number" value={material.cost} readOnly />
                </div>
              ))}
              <div>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={addMaterial}
                  className="mt-2"
                >
                  + Agregar material
                </Button>
              </div>
            </Form.Group>

            {/* Tiempo de elaboración */}
            <Form.Group className="mb-3">
              <Form.Label>Plazo estimado de entrega</Form.Label>

              <Form.Select
                name="productionTime"
                value={product.productionTime}
                onChange={handleChange}
              >
                <option value="">Seleccionar plazo...</option>

                <option value="Disponible para entrega inmediata">
                  Disponible para entrega inmediata
                </option>

                <option value="3 a 5 días hábiles">3 a 5 días hábiles</option>

                <option value="7 días hábiles">7 días hábiles</option>

                <option value="10 a 15 días hábiles">
                  10 a 15 días hábiles
                </option>

                <option value="15 a 20 días hábiles">
                  15 a 20 días hábiles
                </option>

                <option value="Más de 20 días hábiles">
                  Más de 20 días hábiles
                </option>
              </Form.Select>
            </Form.Group>

            <Card className="p-3 mt-4 mb-4">
              <h5 className="mb-3">Resumen de costos</h5>

              <div>
                Mano de obra: {laborCost.toFixed(2)} {settings.currency}
              </div>

              <div>
                Materiales: {materialsCost.toFixed(2)} {settings.currency}
              </div>

              <hr />

              <strong>
                Precio sugerido: {suggestedPrice.toFixed(2)} {settings.currency}
              </strong>

              <Form.Group controlId="price" className="mb-4">
                <Form.Label>Precio final calculado</Form.Label>

                <Form.Control
                  type="number"
                  name="price"
                  value={suggestedPrice.toFixed(2)}
                  readOnly
                />
              </Form.Group>
            </Card>

            <div className="d-flex justify-content-between align-items-center">
              <Link to="/productos" className="btn btn-secondary">
                Volver al catálogo
              </Link>
              <Button variant="primary" type="submit" className="btn">
                {mode === "edit" ? "Actualizar Producto" : "Agregar Producto"}
              </Button>
            </div>
          </Form>
        </Card>
      </Container>
    </div>
  );
}

export default ProductForm;
