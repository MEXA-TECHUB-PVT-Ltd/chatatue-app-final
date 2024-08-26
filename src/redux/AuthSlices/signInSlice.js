import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
import { ENDPOINTS } from '../../constant/endpoints';

const initialState = {
    authToken: null,
    role: null,
    user_id: null,
    userLoginInfo: null,
    loading: false,
    error: null,
};

export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { dispatch, rejectWithValue }) => {
        try {
            const data = await makeRequest('POST', ENDPOINTS.LOGIN, credentials, null, null);
            if (data?.success === true) {
                setTimeout(() => {
                    dispatch(setUserInfoAndToken({
                        authToken: data?.result?.authToken,
                        role: data?.result?.user_role,
                        user_id: data?.result?.id,
                        userLoginInfo: data?.result,
                    }));
                }, 3000);
            }
            return data;
        } catch (error) {
            return error
        }
    }
);

const signInSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.authToken = null;
            state.role = null;
            state.user_id = null;
            state.userLoginInfo = null;
        },
        updateUserLoginInfo(state, action) {
            if (state.userLoginInfo) {
                state.userLoginInfo = {
                    ...state.userLoginInfo,
                    user: {
                        ...state.userLoginInfo.user,
                        ...action.payload
                    }
                };
            }
        },

        setUserInfoAndToken(state, action) {
            state.authToken = action.payload.authToken;
            state.role = action.payload.role;
            state.user_id = action.payload.user_id;
            state.userLoginInfo = action.payload.userLoginInfo;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, updateUserLoginInfo, setUserInfoAndToken } = signInSlice.actions;
export default signInSlice.reducer;
