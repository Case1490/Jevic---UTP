import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserProvider } from "./context/UserContext.jsx";
import { ProductProvider } from "./context/ProductContext.jsx"; // 👈

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <ProductProvider>
        <App />
      </ProductProvider>
    </UserProvider>
  </StrictMode>
);
