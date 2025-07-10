import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import products from "../data/data";
import { collection, deleteDoc, getDoc, getDocs, setDoc } from "firebase/firestore";

export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (uid, thunkAPI) => {
        const ref = collection(db, 'users', uid, 'cart');
        const snapshot = await getDocs(ref);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
);
export const addOrUpdateCartItem = createAsyncThunk(
    'cart/addOrUpdateCartItem',
    async ({ uid, item }, thunkAPI) => {
        const itemRef = doc(db, 'users', uid, 'farm-cart', item.id);
        await setDoc(itemRef, item);
        return item;
    }
);

// export const removeFromCart = createAsyncThunk(
//     'cart/removeFromCart',
//     async ({ uid, id }, thunkAPI) => {
//         try {
//             const itemRef = doc(db, 'users', uid, 'cart', id);
//             await deleteDoc(itemRef);
//             return id;
//         } catch (err) {
//             return thunkAPI.rejectWithValue(err.message);
//         }
//     }
// );


const initialState = {
    cart: {},
    products: [],
    total: 0,
}
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCart: (state, action) => { state.cart = action.payload },
        setProducts: (state, action) => { state.products = action.payload },
        setTotal: (state, action) => { state.total = action.payload },
        addToCart: (state, action) => {
            const id = action.payload;
            if (state.cart[id]) {
                state.cart[id].quantity += 1;
            } else {
                state.cart[id] = { id, quantity: 1 };
            }
        },
        removeFromCart: (state, action) => {
            const id = action.payload;
            if (state.cart[id]) {
                if (state.cart[id].quantity > 1) {
                    state.cart[id].quantity -= 1;
                } else {
                    delete state.cart[id];
                }
            }
        }
    },
    


});
const cartReducer = cartSlice.reducer;
export const { setCart, setProducts, setTotal, addToCart, removeFromCart } = cartSlice.actions;
export default cartReducer;