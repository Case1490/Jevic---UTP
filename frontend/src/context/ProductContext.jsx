import { createContext, useContext, useState, useEffect } from "react";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);

  const fetchProductos = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/productos?t=${Date.now()}`
      ); // evita cache
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error("❌ Error al obtener productos:", error);
    }
  };

  // Llamar una vez al montar
  useEffect(() => {
    fetchProductos();
  }, []);

  return (
    <ProductContext.Provider value={{ productos, fetchProductos }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductos = () => useContext(ProductContext);
