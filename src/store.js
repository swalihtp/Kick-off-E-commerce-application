import { configureStore } from '@reduxjs/toolkit'
import productSlice from './redux/productSlice'
import wishlistSlice from './redux/wishlistSlice'
import cartSlice from './redux/cartSlice'
export const store = configureStore({
  reducer: {
    products: productSlice,
    wishlist:wishlistSlice,
    cart:cartSlice,
  },
})
