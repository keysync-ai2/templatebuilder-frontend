'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '@/lib/api';

export const fetchBrand = createAsyncThunk(
  'brand/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await api.getBrandProfile();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const saveBrand = createAsyncThunk(
  'brand/save',
  async (profile, { rejectWithValue }) => {
    try {
      return await api.saveBrandProfile(profile);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  profile: null,
  hasProfile: false,
  loading: false,
  saving: false,
  error: null,
  initialized: false,
};

const brandSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {
    clearBrandError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBrand.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchBrand.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload.brand_profile;
      state.hasProfile = action.payload.has_profile;
      state.initialized = true;
    });
    builder.addCase(fetchBrand.rejected, (state, action) => {
      state.loading = false;
      state.initialized = true;
      state.error = action.payload;
    });

    builder.addCase(saveBrand.pending, (state) => {
      state.saving = true;
      state.error = null;
    });
    builder.addCase(saveBrand.fulfilled, (state, action) => {
      state.saving = false;
      state.profile = action.payload.brand_profile;
      state.hasProfile = true;
    });
    builder.addCase(saveBrand.rejected, (state, action) => {
      state.saving = false;
      state.error = action.payload;
    });
  },
});

export const { clearBrandError } = brandSlice.actions;
export default brandSlice.reducer;
