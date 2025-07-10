import { useState } from "react";
import { useDispatch } from "react-redux";
import { signupUser } from "../redux/auth.slice";
import { toast } from "react-toastify";
import { useNavigate,NavLink } from "react-router-dom";

export const Signup = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(signupUser({ email, password }));
      if (res.error) {
        throw res.error;
      }
      console.log("success");
      toast.success("Registration Success");
      navigate("/login");
    } catch (error) {
      toast.error('User already exists or invalid input');
    }
  };

  return (
    <>
      <h1>Signup</h1>
      <form onSubmit={onSubmitHandler}>
        <div class="form-group">
          <label for="exampleInputEmail1">Email address</label>
          <input
            type="email"
            class="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <small id="emailHelp" class="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input
            type="password"
            class="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" class="btn btn-primary">
          Submit
        </button>
      </form>
      <NavLink to="/login">Registered Already? Login</NavLink>
    </>
  );
};
