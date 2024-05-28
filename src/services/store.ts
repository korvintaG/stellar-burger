import { configureStore } from '@reduxjs/toolkit';
import burgersSliceReducer from '../slices/burgersSlice';
import userSliceReducer from '../slices/userSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

export const store = configureStore({
  reducer: {
    burgers: burgersSliceReducer, // слайс по основным данным
    user: userSliceReducer // слайс по авторизации и регистрации
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;
export const useDispatch: () => AppDispatch = () => dispatchHook();
export default store;
