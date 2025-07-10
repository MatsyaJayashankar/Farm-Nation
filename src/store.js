import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./redux/cartSlice";
import authReducer from "./redux/auth.slice";

export const store = configureStore({
    reducer: { cart: cartReducer, auth: authReducer }
})