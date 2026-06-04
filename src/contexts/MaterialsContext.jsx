import React, { createContext, useContext, useState, useEffect } from "react";

const MaterialsContext = createContext();

const defaultMaterials = [
  { id: 1, name: "Lana (1 ovillo)", cost: 4700 },
  { id: 2, name: "Vellón", cost: 800 },
  { id: 3, name: "Ojos de seguridad n° 14", cost: 500 },
  { id: 4, name: "Packaging", cost: 1000 },
];

export const MaterialsProvider = ({ children }) => {
  const [materialsCatalog, setMaterialsCatalog] = useState(() => {
    const savedMaterials = localStorage.getItem("materialsCatalog");

    return savedMaterials ? JSON.parse(savedMaterials) : defaultMaterials;
  });

  useEffect(() => {
    localStorage.setItem("materialsCatalog", JSON.stringify(materialsCatalog));
  }, [materialsCatalog]);

  const addMaterial = (material) => {
    setMaterialsCatalog((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...material,
      },
    ]);
  };

  const updateMaterial = (id, updatedMaterial) => {
    setMaterialsCatalog((prev) =>
      prev.map((material) =>
        material.id === id ? { ...material, ...updatedMaterial } : material,
      ),
    );
  };

  const deleteMaterial = (id) => {
    setMaterialsCatalog((prev) =>
      prev.filter((material) => material.id !== id),
    );
  };

  return (
    <MaterialsContext.Provider
      value={{
        materialsCatalog,
        addMaterial,
        updateMaterial,
        deleteMaterial,
      }}
    >
      {children}
    </MaterialsContext.Provider>
  );
};

export const useMaterials = () => useContext(MaterialsContext);
