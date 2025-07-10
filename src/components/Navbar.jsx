import { useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { logoutUser } from "../redux/auth.slice";
export const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const handleLogout = async () => {
    await logoutUser();
  };
  return (
    <nav className="navbar navbar-expand-lg bg-light position-absolute top-0 start-0 w-100">
      <style>
        {`
                .navbar-nav .nav-link {
                    color: inherit;
                    font-weight:500;
                    transition:  0.3s;
                }
                .navbar-nav .nav-link:hover {
                    color: green !important;
                    background: white !important;
                    font-size:large
                    
                }
            `}
      </style>
      <h4>
        <NavLink to="/" style={{ color: "yellowgreen" }}>
          FARM NATION
        </NavLink>
      </h4>
      <ul className="navbar-nav d-flex flex-row gap-3 mx-2">
        <li className="nav-item">
          <NavLink className="nav-link" to="/">
            Home
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/shop">
            Shop
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/cart">
            Cart
          </NavLink>
        </li>{" "}

        <li className="nav-item">
          {!user ? (
            <NavLink className="nav-link" to="/login">
              Login
            </NavLink>
          ) : (
            <NavLink className="nav-link" to="/" onClick={handleLogout}>
              Logout
            </NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
};
