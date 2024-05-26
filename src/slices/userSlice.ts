import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '../utils/types';
import {
  updateUserApi,
  logoutApi,
  getUserApi,
  TRegisterData,
  registerUserApi,
  TLoginData,
  loginUserApi
} from '../utils/burger-api';
import {
  Loadings,
  activateLoadingType,
  deactivateLoadingType
} from '../utils/checkLoading';
import { setCookie } from '../utils/cookie';

interface UserState {
  isLoading: Loadings; // идет процесс обмена информацией с сервером
  user: TUser | null; // данные о пользователе авторизованном, если есть, значит авторизация прошла
  loginError: string; // текстовое сообщение об ошибке авторизации, если пустое, нет ошибки
}

// начальное состояние для слайса
const initialState: UserState = {
  isLoading: null,
  user: null,
  loginError: ''
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
  reducers: {},
  selectors: {
    selectUser: (sliceState) => sliceState.user,
    selectIsUserDataLoading: (sliceState) => sliceState.isLoading,
    selectLoginError: (sliceState) => sliceState.loginError
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = activateLoadingType(state.isLoading, 'registerUser');
      })
      .addCase(registerUser.rejected, (state, _) => {
        state.isLoading = deactivateLoadingType(
          state.isLoading,
          'registerUser'
        );
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = deactivateLoadingType(
          state.isLoading,
          'registerUser'
        );
        state.user = action.payload.user;
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        setCookie('accessToken', action.payload.accessToken);
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = activateLoadingType(state.isLoading, 'updateUser');
      })
      .addCase(updateUser.rejected, (state, _) => {
        state.isLoading = deactivateLoadingType(state.isLoading, 'updateUser');
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = deactivateLoadingType(state.isLoading, 'updateUser');
        state.user = action.payload.user;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = activateLoadingType(state.isLoading, 'loginUser');
        state.loginError = '';
      })
      .addCase(loginUser.rejected, (state, _) => {
        state.isLoading = deactivateLoadingType(state.isLoading, 'loginUser');
        state.loginError = 'Запрос отклонен сервером';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = deactivateLoadingType(state.isLoading, 'loginUser');
        state.user = action.payload.user;
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        setCookie('accessToken', action.payload.accessToken);
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = activateLoadingType(state.isLoading, 'getUser');
        state.user = null;
      })
      .addCase(getUser.rejected, (state, _) => {
        state.isLoading = deactivateLoadingType(state.isLoading, 'getUser');
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = deactivateLoadingType(state.isLoading, 'getUser');
        state.user = action.payload.user;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = activateLoadingType(state.isLoading, 'logoutUser');
      })
      .addCase(logoutUser.rejected, (state, _) => {
        state.isLoading = deactivateLoadingType(state.isLoading, 'logoutUser');
      })
      .addCase(logoutUser.fulfilled, (state, _) => {
        state.isLoading = deactivateLoadingType(state.isLoading, 'logoutUser');
        state.user = null;
        localStorage.removeItem('refreshToken');
        setCookie('accessToken', '');
      });
  }
});

export const { selectLoginError, selectUser, selectIsUserDataLoading } =
  userSlice.selectors;
export default userSlice.reducer;
