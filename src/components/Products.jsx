import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useRef, useState } from "react";
import { addToCart, removeFromCart } from "../redux/cartSlice";

export const Products = ({ products, CartPage }) => {
  const [selected, setSelected] = useState(null);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const ref = useRef();

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setSelected(null);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <div className="row m-2 gap-2 justify-content-center">
        <style>
          {`
                            .card{background:none; color:white;}
                            .card:hover{ background:wheat; color:black; }
                            .card:hover img{ transform: scale(1.1); transition:0.3s; box-shadow: 0 0 35px black }
                        
                            
                            .btn{background:darkslategray; display:none}
                            .card .qty{display:none}
                            .card:hover .btn,
                            .card:hover .qty{display:block}
                            .qty-btn {box-shadow:0 2px 2px black}
                            .qty-btn:active {box-shadow:0 2px 5px black}
                            `}
        </style>
        {products.map((product) => (
          <div
            className={
              CartPage
                ? `card d-grid col-12 col-md-8  shadow align-content-center justify-content-space-evenly w-100`
                : `card col-12 col-sm-6 col-md-4 shadow align-content-center justify-content-center`
            }
            style={{ background: "", padding: "0.7rem 0.7rem" }}
            key={product.id}
          >
            <img
              className={
                CartPage
                  ? `rounded position-absolute m-2`
                  : `rounded align-self-center`
              }
              role="button"
              onDoubleClick={() => dispatch(addToCart(product.id))}
              onClick={() => setSelected(product)}
              src={product.image}
              alt={product.name}
              style={
                CartPage
                  ? {
                      width: "50px",
                      height: "35px",
                      objectFit: "cover",
                    }
                  : { width: "100%", height: "100px", objectFit: "cover" }
              }
            />
            <p className="card-title fs-6 fs-sm-5 fs-md-4 mx-5">
              {product.name}
            </p>

            <h2
              className={
                CartPage
                  ? "rounded-pill p-2 "
                  : " shadow qty w-75 bg-light rounded-pill"
              }
              style={
                CartPage
                  ? {
                      position: "relative",
                      width: "11rem",
                      right: "-10%",
                      alignSelf: "center",
                      color: "yellowgreen",
                    }
                  : { alignSelf: "center", color: "yellowgreen" }
              }
            >
              <button
                className="qty-btn"
                title="Remove from cart"
                onClick={() => dispatch(removeFromCart(product.id))}
                style={{
                  background: "white",
                  borderRadius: "15px 0 0 15px",
                  padding: "0 17px",
                  position: "absolute",
                  left: "20px",
                  color: "yellowgreen",
                  border: "none",
                }}
              >
                -
              </button>
              {cart[product.id]?.quantity || 0}
              <button
                className="qty-btn"
                title="Add to cart"
                onClick={() => dispatch(addToCart(product.id))}
                style={{
                  background: "white",
                  borderRadius: "0 0 15px 0",
                  padding: "0 17px",
                  position: "absolute",
                  right: "20px",
                  color: "yellowgreen",
                  border: "none",
                }}
              >
                +
              </button>
              {CartPage && (
                <span className="position-absolute" style={{ right: "-100%" }}>
                  {product.price}
                </span>
              )}
            </h2>
          </div>
        ))}
      </div>

      {/*MODAL*/}
      {selected && (
        <div
          className="card model-overlay d-flex flex-column w-100 align-items-center justify-content-center"
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            backdropFilter: "blur(5px)",
            zIndex: 99,
            background: "rgb(0,0,0,0.2 )",
          }}
        >
          <h1
            className="bg-dark shadow"
            style={{ position: "absolute", top: 0, right: 0 }}
          >
            X
          </h1>
          <img
            className="rounded"
            src={selected.image}
            style={{
              width: "50%",
              maxHeight: "35vw",
              objectFit: "cover",
            }}
            onClick={(e) => e.stopPropagation()} // Prevent bubbling up to overlay
          />
          <h3
            className="bg-dark text-success w-50 x shadow"
            style={{ zIndex: 999 }}
          >
            {selected.name}
          </h3>
          <ul className="list-unstyled text-white">
            <li>
              <strong>Origin:</strong> {selected.origin}
            </li>
            <li>
              <strong>Practices:</strong> {selected.practices}
            </li>
            <li>
              <strong>Certifications:</strong> {selected.certifications}
            </li>
            <li>
              <strong>Season:</strong> {selected.availability}
            </li>
          </ul>
          <button
            className=" w-50 "
            style={{ zIndex: 9999 }}
            onClick={(e) => {
              e.stopPropagation();
              dispatch(addToCart(selected.id));
            }}
          >
            Add to Cart +{" "}
            <span className="bg-success p-2 rounded ">
              {" "}
              {cart[selected.id]?.quantity || 0}
            </span>
          </button>
        </div>
      )}
    </>
  );
};
