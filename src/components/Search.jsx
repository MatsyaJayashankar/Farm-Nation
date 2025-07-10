import { useEffect, useState } from "react";
import products from "../data/data";

export const Search = ({ setFilteredProducts, filteredProducts }) => {
  
  const [query, setQuery] = useState("");
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    const results = products.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(results);
  }, [products, query]);

  return (
    <div className="w-md-auto m-10">
      <input
        className="form-control"
        placeholder="search"
        onChange={(e) => {
          setQuery(e.target.value);
          setDropdown(true);
        }}
      />
      {query && dropdown && (
        <ul className="list-group z-3">
          {filteredProducts.map((p) => (
            <li
              key={p.id}
              className="list-group-item list-group-action"
              style={{ cursor: "pointer" }}
              onMouseDown={() => {
                setQuery(p.name);
                setDropdown(false);
              }}
            >
              {p.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

