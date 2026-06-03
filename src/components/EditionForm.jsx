import { executeBasicSweet } from "../assets/SweetAlert";
import { useEffect, useState } from "react";

function EditionForm({ SelectedProduct, onUpdate }) {
  const [product, setProduct] = useState(SelectedProduct);

  useEffect(() => {
    setProduct(SelectedProduct);
  }, [SelectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const answer = await fetch(
        `https://68100d8c27f2fdac24101f1f.mockapi.io/products/${product.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        },
      );
      if (!answer.ok) {
        throw new Error("Error al actualizar el producto.");
      }
      const data = await answer.json();
      onUpdate(data);
      alert("Producto actualizado correctamente.");
    } catch (error) {
      console.error(error.message);
      alert("Hubo un problema al actualizar el producto.");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2>Editar Producto</h2>
      <div>
        <label>Nombre:</label>
        <input
          type="text"
          name="name"
          value={product.name || ""}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Precio:</label>
        <input
          type="number"
          name="price"
          value={product.price || ""}
          onChange={handleChange}
          required
          min="0"
        />
      </div>
      <div>
        <label>Descripción:</label>
        <textarea
          name="description"
          value={product.description || ""}
          onChange={handleChange}
          required
        />
      </div>
      <div>
  <label>Plazo estimado de entrega (tiempo de elaboración)</label>

  <select
    name="productionTime"
    value={product.productionTime || ""}
    onChange={handleChange}
  >
    <option value="">Seleccionar...</option>

    <option value="Disponible para entrega inmediata">
      Disponible para entrega inmediata
    </option>

    <option value="3 a 5 días hábiles">
      3 a 5 días hábiles
    </option>

    <option value="7 días hábiles">
      7 días hábiles
    </option>

    <option value="10 a 15 días hábiles">
      10 a 15 días hábiles
    </option>

    <option value="20 días hábiles">
      20 días hábiles
    </option>
  </select>
</div>

      <button type="submit">Actualizar Producto</button>
    </form>
  );
}

export default EditionForm;
