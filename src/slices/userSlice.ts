import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUserState, TUser } from '../utils/types';
import {
  updateUserApi,
  logoutApi,
  getUserApi,
  TRegisterData,
  registerUserApi,
  TLoginData,
  loginUserApi
} from '../utils/burger-api';
import { setCookie } from '../utils/cookie';

interface UserState {
  isLoading: boolean;
  user: TUser | null;
  userState: TUserState;
}

const initialState: UserState = {
  isLoading: false,
  user: null,
  userState: {
    isAuthChecked: false,
    isAuthenticated: false,
    loginUserRequest: false,
    loginError: ''
  }
};

export const loginUser = createAsyncThunk(
  'loginUser',
  async (data: TLoginData) => loginUserApi(data)
);

export const registerUser = createAsyncThunk(
  'registerUser',
  async (data: TRegisterData) => registerUserApi(data)
);

export const updateUser = createAsyncThunk(
  'updateUser',
  async (data: TRegisterData) => updateUserApi(data)
);

export const getUser = createAsyncThunk('getUser', async () => getUserApi());

export const logoutUser = createAsyncThunk('logoutUser', async () =>
  logoutApi()
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthFail: (state) => {
      state.userState.isAuthChecked = true;
      state.userState.isAuthenticated = false;
    }
  },
  selectors: {
    selectUser: (sliceState) => sliceState.user,
    selectIsAuthChecked: (sliceState) => sliceState.userState.isAuthChecked,
    selectIsUserDataLoading: (sliceState) => sliceState.isLoading,
    selectLoginError: (sliceState) => sliceState.userState.loginError
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.rejected, (state, _) => {
        state.isLoading = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        setCookie('accessToken', action.payload.accessToken);
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.rejected, (state, _) => {
        state.isLoading = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.userState.loginError = '';
      })
      .addCase(loginUser.rejected, (state, _) => {
        state.isLoading = false;
        state.userState.loginError = 'Запрос отклонен сервером';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        setCookie('accessToken', action.payload.accessToken);
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.userState.isAuthChecked = false;
      })
      .addCase(getUser.rejected, (state, _) => {
        state.isLoading = false;
        state.userState.isAuthChecked = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userState.isAuthChecked = true;
        state.user = action.payload.user;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.rejected, (state, _) => {
        state.isLoading = false;
      })
      .addCase(logoutUser.fulfilled, (state, _) => {
        state.isLoading = false;
        state.userState.isAuthChecked = false;
        state.user = null;
        localStorage.removeItem('refreshToken');
        setCookie('accessToken', '');
      });
  }
});

export const {
  selectLoginError,
  selectIsAuthChecked,
  selectUser,
  selectIsUserDataLoading
} = userSlice.selectors;
export const { setAuthFail } = userSlice.actions;
export default userSlice.reducer;
