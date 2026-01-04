import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const userEmail = localStorage.getItem("userEmail");

// 1. Fetch wishlist from the server
export const fetchWishlist = createAsyncThunk("wishlist/fetchWishlist", async () => {
  const res = await axios.get(`http://localhost:5000/users?email=${userEmail}`);
  const user = res.data[0];
  return user ? user.wishlist || [] : [];
});

// 2. Update wishlist on the server
export const updateWishlistOnServer = createAsyncThunk(
  "wishlist/updateWishlistOnServer",
  async (updatedWishlist, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:5000/users?email=${userEmail}`);
      const user = res.data[0];
      if (!user) throw new Error("User not found");

      await axios.patch(`http://localhost:5000/users/${user.id}`, {
        wishlist: updatedWishlist,
      });

      return updatedWishlist; // return new wishlist to Redux
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    // 🔹 Optimistic update — updates instantly on UI
    setWishlist: (state, action) => {
      state.items = action.payload;
    },
    // Toggle wishlist locally (before syncing)
    toggleWishlistLocal: (state, action) => {
      const product = action.payload;
      const exists = state.items.some((item) => item.id === product.id);
      state.items = exists
        ? state.items.filter((item) => item.id !== product.id)
        : [...state.items, product];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Update wishlist on server
      .addCase(updateWishlistOnServer.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(updateWishlistOnServer.rejected, (state, action) => {
        state.error = action.payload || "Failed to update wishlist";
      });
  },
});

export const { setWishlist, toggleWishlistLocal } = wishlistSlice.actions;
export default wishlistSlice.reducer;
