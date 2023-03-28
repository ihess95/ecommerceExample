import Layout from "../components/Layout";
import { useContext, useEffect, useState } from "react";
import { ProductsContext } from "../components/ProductsContext";

export default function CheckoutPage() {
  const { selectedProducts, setSelectedProducts } = useContext(ProductsContext);
  const [productsInfos, setProductsInfos] = useState([]);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // This console log is showing that when the page is first loaded, productsInfos.length is 0
  // Which is what it should be when cart is 0. And the No items in cart message displays for a second
  // Then the productsInfos.length updates to total number of products in db
  // TODO: fix that
  // It is my understanding that useEffect() automatically updates any time there is changes
  // This may be the cause, but I think [selectedProducts] at the end is supposed to fix that
  // Why isn't it?
  // Is it because the array is changing, which would cause the function to re-execute?
  // How do I stop that?
  // Upon testing, setSelected products is preventing an infinite loop. but not doing what I think it needs to
  // Maybe thats not the issue.
  // Changed  ProductsInfos in first line of Layout to selectedProducts and now the message displays
  // Now for a split second a 0 is displayed on load

  useEffect(() => {
    const uniqIds = [...new Set(selectedProducts)];
    fetch("/api/products?ids=" + uniqIds.join(","))
      .then((response) => response.json())
      .then((json) => setProductsInfos(json));
  }, [selectedProducts]);

  function moreOfThisProduct(id) {
    setSelectedProducts((prev) => [...prev, id]);
  }

  function lessOfThisProduct(id) {
    const pos = selectedProducts.indexOf(id);
    if (pos !== -1) {
      setSelectedProducts((prev) => {
        return prev.filter((value, index) => index !== pos);
      });
    }
  }

  const deliveryPrice = 5;
  let subtotal = 0;
  if (selectedProducts?.length) {
    for (let id of selectedProducts) {
      const price = productsInfos.find((p) => p._id === id)?.price || 0;
      subtotal += Math.round((price * 100) / 100);
    }
  }

  let total = subtotal + deliveryPrice;

  return (
    <Layout>
      {/* Change made on line below selectedProduct*/}
      {!productsInfos.length && <div>No Products in your shopping cart</div>}
      {productsInfos.length &&
        productsInfos.map((productInfo) => {
          const amount = selectedProducts.filter(
            (id) => id === productInfo._id
          ).length;
          if (amount === 0) return;
          return (
            <div className="flex mb-5" key={productInfo._id}>
              <div className="bg-gray-200 p-3 rounded-xl shrink-0">
                <img className="w-24" src={productInfo.picture} alt="" />
              </div>
              <div className="pl-4">
                <h3 className="font-bold text-lg">{productInfo.name}</h3>
                <p className="text-sm leading-4 text-gray-600">
                  {productInfo.description}
                </p>
                <div className="flex">
                  <div className="grow">${productInfo.price}</div>
                  <div>
                    <button
                      onClick={() => lessOfThisProduct(productInfo._id)}
                      className="border border-emerald-500 px-2 rounded-lg text-emerald-500"
                    >
                      -
                    </button>
                    <span className="px-2">
                      {
                        selectedProducts.filter((id) => id === productInfo._id)
                          .length
                      }
                    </span>
                    <button
                      onClick={() => moreOfThisProduct(productInfo._id)}
                      className="bg-emerald-500 px-2 rounded-lg text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      <form action="/api/checkout" method="POST">
        <div className="mt-4">
          <input
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-gray-200 w-full rounded-lg px-4 py-2 mb-2"
            type="text"
            placeholder="Street address, number"
          />
          <input
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-gray-200 w-full rounded-lg px-4 py-2 mb-2"
            type="text"
            placeholder="City and postal code"
          />
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-200 w-full rounded-lg px-4 py-2 mb-2"
            type="text"
            placeholder="Your name"
          />
          <input
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-200 w-full rounded-lg px-4 py-2 mb-2"
            type="text"
            placeholder="Email address"
          />
        </div>
        <div className="mt-4">
          <div className="flex my-3 font-bold">
            <h3 className="grow font-bold text-gray-500">Subtotal:</h3>
            <h3>{subtotal.toFixed(2)}</h3>
          </div>
          <div className="flex my-3 font-bold">
            <h3 className="grow font-bold text-gray-500">Delivery:</h3>
            <h3>{deliveryPrice.toFixed(2)}</h3>
          </div>
          <div className="flex font-bold my-3 border-t-2 pt-3 border-dashed border-emerald-500">
            <h3 className="grow font-bold text-gray-500">Total:</h3>
            <h3>{total.toFixed(2)}</h3>
          </div>
        </div>

        <input
          type="hidden"
          name="products"
          value={selectedProducts.join(",")}
        />

        <button
          type="submit"
          className="bg-emerald-500 text-white w-full px-5 py-2 rounded-xl font-bold my-4 shadow-emerald-300 shadow-xl"
        >
          Pay ${total.toFixed(2)}
        </button>
      </form>
    </Layout>
  );
}
