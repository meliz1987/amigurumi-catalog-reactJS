import { createContext, useState, useContext, useEffect} from "react";

export const FavoritesContext =  createContext();

export function FavoritesProvider({children}) {
  const [favoriteProducts,
    setFavoriteProducts] =
    useState(() => {
      const storedFavorites =
        localStorage.getItem(
          "favoriteProducts"
        );

      return storedFavorites
        ? JSON.parse(
            storedFavorites
          )
        : [];
    });

  useEffect(() => {
    localStorage.setItem(
      "favoriteProducts",
      JSON.stringify(
        favoriteProducts
      )
    );
  }, [favoriteProducts]);

  /* agregar favorito */
  const addFavorite = (
    product
  ) => {
    const exists =
      favoriteProducts.find(
        (p) =>
          p.id === product.id
      );

    if (!exists) {
      setFavoriteProducts([
        ...favoriteProducts,
        product,
      ]);
    }
  };

  /* eliminar uno */
  const deleteFavorite = (
    id
  ) => {
    const updatedFavorites =
      favoriteProducts.filter(
        (p) => p.id !== id
      );

    setFavoriteProducts(
      updatedFavorites
    );
  };

  /* vaciar todos */
  const clearFavorites =
    () => {
      setFavoriteProducts(
        []
      );
    };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteProducts,
        addFavorite,
        deleteFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  return useContext(FavoritesContext);
}