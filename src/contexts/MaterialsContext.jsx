import React, { createContext, useContext, useState } from "react";

const MaterialsContext = createContext();

export const MaterialsProvider = ({ children }) => {
  const [materialsCatalog, setMaterialsCatalog] = useState([
    { id: 1, name: "Lana", cost: 4700 },
    { id: 2, name: "Vellón", cost: 800 },
    { id: 3, name: "Ojos de seguridad", cost: 500 },
    { id: 4, name: "Packaging", cost: 1000 },
  ]);

  const addMaterial = (material) => {
    setMaterialsCatalog((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...material
      }
    ]);
  };

  const updateMaterial = (id, updatedMaterial) => {
    setMaterialsCatalog((prev) =>
      prev.map((material) =>
        material.id === id
          ? { ...material, ...updatedMaterial }
          : material
      )
    );
  };

  const deleteMaterial = (id) => {
    setMaterialsCatalog((prev) =>
      prev.filter((material) => material.id !== id)
    );
  };

  return (
    <MaterialsContext.Provider
      value={{
        materialsCatalog,
        addMaterial,
        updateMaterial,
        deleteMaterial
      }}
    >
      {children}
    </MaterialsContext.Provider>
  );
};

export const useMaterials = () => useContext(MaterialsContext);