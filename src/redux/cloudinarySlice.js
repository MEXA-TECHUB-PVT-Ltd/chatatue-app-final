import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import CryptoJS from 'crypto-js';

// Cloudinary configuration (store these in a .env file for security)
const cloudName = 'dlifdwxou';
const apiKey = '737415776825168';
const apiSecret = 'ZGuXZQCWlwTlSZM1144MyzlSFEI';
const uploadPreset = 'mtechub_chatatue_preset';  // Optional

// Async action to upload an image to Cloudinary
export const uploadImage = createAsyncThunk(
  'cloudinary/uploadImage',
  async (imageUri, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',  // or other file types if needed
        name: 'upload.jpg',
      });
      formData.append('upload_preset', uploadPreset);
      formData.append('api_key', apiKey);
      const timestamp = Math.round((new Date()).getTime() / 1000);
      formData.append('timestamp', timestamp.toString());

      // Make the request to Cloudinary
      const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data; // Will contain image URL and public_id
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async action to delete an image from Cloudinary
export const deleteImage = createAsyncThunk(
  'cloudinary/deleteImage',
  async (publicId, { rejectWithValue }) => {
    try {
      const timestamp = Math.round((new Date()).getTime() / 1000);
      const signatureString = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
      const signature = CryptoJS.SHA1(signatureString).toString(CryptoJS.enc.Hex);

      // Make the request to Cloudinary
      const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
        public_id: publicId,
        api_key: apiKey,
        timestamp: timestamp,
        signature: signature,
      });

      if (response.data.result === 'ok') {
        return publicId;
      } else {
        throw new Error('Failed to delete image');
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Redux slice
const cloudinarySlice = createSlice({
  name: 'cloudinary',
  initialState: {
    images: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Upload image cases
    builder.addCase(uploadImage.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(uploadImage.fulfilled, (state, action) => {
      state.loading = false;
      state.images.push(action.payload); // Add new image to state
    });
    builder.addCase(uploadImage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Delete image cases
    builder.addCase(deleteImage.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteImage.fulfilled, (state, action) => {
      state.loading = false;
      // Remove the deleted image from state
      state.images = state.images.filter((image) => image.public_id !== action.payload);
    });
    builder.addCase(deleteImage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default cloudinarySlice.reducer;
