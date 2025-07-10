import { useState, useEffect } from "react";
import products from "../data/data";
export const Filter = ({ setFilteredProducts }) => {
  const [priceRange, setPriceRange] = useState(700);

  useEffect(() => {
    const results = products.filter(
      (p) => Number(p.price.match(/\d+(\.\d+)?/)[0]) <= priceRange
    );
    setFilteredProducts(results);
  }, [priceRange, products]);

  return (
    <aside>
      <label htmlFor="priceRange" className="form-label fs-5 bg-white">
        Price Range:{priceRange}
      </label>
      <input
        type="range"
        className="form-range w-50"
        id="priceRange"
        name="priceRange"
        min="0"
        max="1000"
        step="100"
        value={priceRange}
        onChange={(e) => setPriceRange(e.target.value)}
        style={{ color: "red", margin: 20 }}
      />
    </aside>
  );
};
