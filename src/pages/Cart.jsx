import { useSelector } from "react-redux";
import products from "../data/data";
import { Products } from "../components/Products";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Cart = () => {
  const cart = useSelector((state) => state.cart.cart);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  const cartItems = products.filter((p) => cart[p.id]);

  const total = products.reduce((sum, product) => {
    const quantity = cart[product.id]?.quantity ?? 0;
    const rawPrice = product.price; // e.g. "₹80/kg"
    const priceMatch = rawPrice.match(/\d+(\.\d+)?/); // matches 80 or 80.50

    const price = priceMatch ? parseFloat(priceMatch[0]) : 0;
    return sum + price * quantity;
  }, 0);

  console.log("total: ", total);
  console.log("cart: ", cart);
  console.log("cartItems: ", cartItems);
  return (
    <>
      <h1>CART</h1>
      <Products products={cartItems} CartPage={true} />
      <h4 className="text-light p-2 m-5 shadow">
        Total Rs:{" "}
        <span
          className="bg-warning shadow text-dark"
          style={{ padding: "2px 14px" }}
        >
          {total}
        </span>
      </h4>
    </>
  );
};
