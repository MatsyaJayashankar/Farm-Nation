import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';

export const loginUser = createAsyncThunk('auth/login', async ({ email, password }, thunkAPI) => {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    return { uid: userCred.user.uid, email: userCred.user.email };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const signupUser = createAsyncThunk('auth/signup', async ({ email, password }, thunkAPI) => {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    return { uid: userCred.user.uid, email: userCred.user.email };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await signOut(auth);
    return null;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;