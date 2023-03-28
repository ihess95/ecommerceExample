import { useState, useContext, useEffect } from "react";
import { ProductsContext } from "./ProductsContext";
import Footer from "./Footer";

export default function Layout({ children }) {
  const { setSelectedProducts } = useContext(ProductsContext);
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    if (window.location.href.includes("success")) {
      setSelectedProducts([]);
      setSuccess(true);
    }
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-5">
        {success && (
          <div className="mb-5 bg-green-400 text-white text-lg p-5 rounded-xl">
            Thanks for your order!
          </div>
        )}
        {children}
      </div>
      <Footer />
    </div>
  );
}
