import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login, loginWithGoogle, loginWithFacebook } from "@/services/auth";
import * as usersApi from "@/services/users";
import { seed, deltCookie } from "@/utils/helpers/sessionHelper";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      return await login(payload);
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);

export const loginGoogleUser = createAsyncThunk(
  "auth/login/google",
  async (payload, { rejectWithValue }) => {
    try {
      return await loginWithGoogle(payload);
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);

export const loginFacebookUser = createAsyncThunk(
  "auth/login/facebook",
  async (payload, { rejectWithValue }) => {
    try {
      return await loginWithFacebook(payload);
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);

export const currentUser = createAsyncThunk(
  "auth/me",
  async (payload, { rejectWithValue }) => {
    try {
      return await usersApi.me();
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    user: {},
    accessToken: null,
    isLoading: false,
    error: {},
  },
  reducers: {
    logout: (state) => {
      state.user = {};
      state.accessToken = null;
      state.isLoggedIn = false;
      state.isLoading = false;
      deltCookie();
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.accessToken = action.payload?.data?.token;
      state.isLoading = false;
      state.isLoggedIn = true;
      state.error = {};
      seed(action.payload?.data?.token);
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(loginGoogleUser.fulfilled, (state, action) => {
      state.user = action.payload?.data;
      state.accessToken = action.payload?.data?.token;
      state.isLoading = false;
      state.isLoggedIn = true;
      seed(action.payload?.data?.token);
    });
    builder.addCase(loginGoogleUser.rejected, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(loginFacebookUser.fulfilled, (state, action) => {
      state.user = action.payload?.user;
      state.accessToken = action.payload?.access_token;
      state.isLoading = false;
      state.isLoggedIn = true;
      seed(action.payload?.accessToken);
    });
    builder.addCase(loginFacebookUser.rejected, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(currentUser.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(currentUser.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.user = data;
      state.isLoading = false;
      state.error = {};
    });
    builder.addCase(currentUser.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});

export const { logout, setUser } = authSlice.actions;

export default authSlice.reducer;
