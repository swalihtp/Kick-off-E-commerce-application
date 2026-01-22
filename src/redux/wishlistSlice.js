import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import api from '../api/axios'

const userEmail = localStorage.getItem('userEmail')

// 1. Fetch wishlist from the server
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async () => {
    const res = await api.get(`wishlist/`)
    return res.data
  }
)

export const addToWishlist = createAsyncThunk(
  'wishlist/add',
  async (product, { rejectWithValue }) => {
    
    try {
      const res = await api.post('wishlist/', {
        product: product.id
      })
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

export const removeFromWishlist=createAsyncThunk(
  'wishlist/delete',
  async (id,{rejectWithValue})=>{
    console.log('called remove');
    
    try{
      const res = await api.delete(`wishlist/${id}/delete/`)
      return res.data
    }catch(err){
      return rejectWithValue
    }
  }
)

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {
    // Optimistic update — updates instantly on UI
    setWishlist: (state, action) => {
      state.items = action.payload
    },
    // Toggle wishlist locally (before syncing)
    toggleWishlistLocal: (state, action) => {
      const product = action.payload
      const exists = state.items.some(item => item.id === product.id)
      state.items = exists
        ? state.items.filter(item => item.id !== product.id)
        : [...state.items, product]
    }
  },
  extraReducers: builder => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
        
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(addToWishlist.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(removeFromWishlist.pending,(state,action)=>{
        state.status='loading'
      })
      .addCase(removeFromWishlist.fulfilled,(state,action)=>{
        state.status='succeeded'
        state.items=action.payload
      })      .addCase(removeFromWishlist.rejected,(state,action)=>{
        state.status='failed'
        state.items=action.error.message
      })

  }
})

export const { setWishlist, toggleWishlistLocal } = wishlistSlice.actions
export default wishlistSlice.reducer
