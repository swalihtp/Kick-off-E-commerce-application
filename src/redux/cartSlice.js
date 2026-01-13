import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// Fetch cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("cart/");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Add to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await api.post("cart/add/", {
        product_id: productId,
        quantity: 1,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update quantity
export const updateCartItemQty = createAsyncThunk(
  "cart/updateQty",
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`cart/item/${itemId}/`, {
        quantity,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Remove item
export const removeCartItem = createAsyncThunk(
  "cart/removeItem",
  async (itemId, { rejectWithValue }) => {
    try {
      const res = await api.delete(`cart/item/${itemId}/delete/`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    total_price: 0,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total_price = action.payload.total_price;
        state.status = "succeeded";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total_price = action.payload.total_price;
      })
      .addCase(updateCartItemQty.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total_price = action.payload.total_price;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total_price = action.payload.total_price;
      });
  },
});

export default cartSlice.reducer;
