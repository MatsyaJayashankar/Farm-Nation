import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/auth.slice";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      toast.success("Login Success");
      navigate("/shop");
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <h1>LOGIN</h1>
      <form onSubmit={onSubmitHandler}>
        <div class="form-group m-2">
          <input
            type="email"
            class="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div class="form-group">
          <input
            type="password"
            class="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" class="btn btn-primary">
          Submit
        </button>
      </form>
      <NavLink to="/signup">New user? Signup</NavLink>
    </>
  );
};
