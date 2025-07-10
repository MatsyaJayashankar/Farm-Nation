import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import { toast } from "react-toastify";

export const loginUser = createAsyncThunk('auth/login', async ({ email, password }, thunkAPI) => {
    try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        return { uid: userCred.user.uid, email: userCred.user.email }
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const signupUser = createAsyncThunk('auth/signup', async ({ email, password }, thunkAPI) => {
    try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        return { uid: userCred.user.uid, email: userCred.user.email };
    } catch (error) {
        return thunkAPI.rejectWithValue(error)
    }
});

export const logoutUser = createAsyncThunk('auth/logout', async (__dirname, thunkAPI) => {
    try {
        await signOut(auth);
        toast.success('logged out!')
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
})


const authSlice = createSlice({
    name: 'auth',
    initialState: { user: null, loading: false, error: null },
    reducers: {
        setUser(state, action) {
            state.user = action.payload,
            state.loading = false; // Assume if setting manually, not loading
            state.error = null;
            
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false; // CORRECTED: Should be false
                state.user = action.payload;
                state.error = null; // Clear any previous errors on success
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false; // CORRECTED: Should be false
                state.error = action.payload;
                state.user = null; // Clear user if login fails
            })

            .addCase(signupUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false; // CORRECTED: Should be false
                state.user = action.payload;
                state.error = null; // Clear any previous errors on success
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false; // CORRECTED: Should be false
                state.error = action.payload;
                state.user = null; // Clear user if signup fails
            })

            .addCase(logoutUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(logoutUser.fulfilled, (state) => { // No action.payload needed if you return true/void from thunk
                state.loading = false; // CORRECTED: Should be false
                state.user = null; // User should be null on logout
                state.error = null; // Clear any previous errors
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false; // CORRECTED: Should be false
                state.error = action.payload;
            })
    }
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;