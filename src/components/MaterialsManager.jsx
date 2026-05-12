import { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { useMaterials } from "../contexts/MaterialsContext";

function MaterialsManager() {
  const {
    materialsCatalog,
    addMaterial,
    updateMaterial,
    deleteMaterial,
  } = useMaterials();

  const [newMaterial, setNewMaterial] = useState({
    name: "",
    cost: "",
  });

  const [editingMaterialId, setEditingMaterialId] = useState(null);

  const [editingMaterial, setEditingMaterial] = useState({
    name: "",
    cost: "",
  });

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

  const handleCancelEdit = () => {
    setEditingMaterialId(null);

    setEditingMaterial({
      name: "",
      cost: "",
    });
  };

  return (
    <Card className="shadow-sm border-0 rounded-4 p-4 mb-4">
      <h4 className="cute-title mb-4">
        Catálogo de materiales
      </h4>

      <div className="d-flex gap-2 mb-4">
        <Form.Control
          type="text"
          placeholder="Material"
          value={newMaterial.name}
          onChange={(e) =>
            setNewMaterial({
              ...newMaterial,
              name: e.target.value,
            })
          }
        />

        <Form.Control
          type="number"
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

        <Button onClick={handleAddMaterial}>
          Agregar
        </Button>
      </div>

      {materialsCatalog.map((material) => (
        <div
          key={material.id}
          className="d-flex justify-content-between align-items-center border-bottom py-2"
        >
          {editingMaterialId === material.id ? (
            <>
              <div className="d-flex gap-2 flex-grow-1 me-3">
                <Form.Control
                  type="text"
                  value={editingMaterial.name}
                  onChange={(e) =>
                    setEditingMaterial({
                      ...editingMaterial,
                      name: e.target.value,
                    })
                  }
                />

                <Form.Control
                  type="number"
                  value={editingMaterial.cost}
                  onChange={(e) =>
                    setEditingMaterial({
                      ...editingMaterial,
                      cost: e.target.value,
                    })
                  }
                />
              </div>

              <div className="d-flex gap-2">
                <Button
                  size="sm"
                  variant="success"
                  onClick={handleSaveMaterial}
                >
                  Guardar
                </Button>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleCancelEdit}
                >
                  Cancelar
                </Button>
              </div>
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
                  onClick={() =>
                    handleStartEditMaterial(material)
                  }
                >
                  Editar
                </Button>

                <Button
                  size="sm"
                  variant="danger"
                  onClick={() =>
                    deleteMaterial(material.id)
                  }
                >
                  Eliminar
                </Button>
              </div>
            </>
          )}
        </div>
      ))}
    </Card>
  );
}

export default MaterialsManager;