import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const userEmail = localStorage.getItem("userEmail");

// 🛒 1. Fetch cart from server
export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`http://localhost:5000/users?email=${userEmail}`);
    const users = res.data;
    if (!users.length) throw new Error("User not found");
    return users[0].cart || [];
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// 🛠️ 2. Update cart on server (used for qty and remove)
export const updateCartOnServer = createAsyncThunk(
  "cart/updateCartOnServer",
  async (updatedCart, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:5000/users?email=${userEmail}`);
      const user = res.data[0];
      if (!user) throw new Error("User not found");

      await axios.patch(`http://localhost:5000/users/${user.id}`, {
        cart: updatedCart,
      });

      return updatedCart;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ➕ 3. Add new product to cart
export const addToCart = createAsyncThunk("cart/addToCart", async (product, { rejectWithValue }) => {
  try {
    const res = await axios.get(`http://localhost:5000/users?email=${userEmail}`);
    const user = res.data[0];
    if (!user) throw new Error("User not found");

    const existingCart = user.cart || [];
    const existingItem = existingCart.find((item) => item.productId === product.id);

    const updatedCart = existingItem
      ? existingCart.map((item) =>
          item.productId === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      : [
          ...existingCart,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            qty: 1,
          },
        ];

    await axios.patch(`http://localhost:5000/users/${user.id}`, { cart: updatedCart });
    return updatedCart;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Add to Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update Cart
      .addCase(updateCartOnServer.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(updateCartOnServer.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setCart } = cartSlice.actions;
export default cartSlice.reducer;
