import { initMongoose } from "@/lib/mongoose";
import { useEffect, useState } from "react";
import Product from "@/components/Product";

export default function Home() {
  const [productsInfo, setProductsInfo] = useState([]);
  useEffect(() => {
    fetch("/api/products")
      .then((response) => response.json())
      .then((json) => setProductsInfo(json));
  }, []);

  const categoriesNames = [...new Set(productsInfo.map((p) => p.category))];

  return (
    <div className="p-5">
      <div>
        {categoriesNames.map((categoryName) => (
          <div key={categoryName}>
            <h2 className="text-2xl capitalize">{categoryName}</h2>
            {productsInfo
              .filter((p) => p.category === categoryName)
              .map((productInfo) => (
                <div key={productInfo.id}>
                  <Product {...productInfo} />
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
