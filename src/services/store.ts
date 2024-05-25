import { configureStore } from '@reduxjs/toolkit';
import burgersSliceReducer from '../slices/burgersSlice';
import userSliceReducer from '../slices/userSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = () => {}; // Заменить на импорт настоящего редьюсера

export const store = configureStore({
  reducer: {
    burgers: burgersSliceReducer,
    user: userSliceReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});
/*const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});*/

/*export type RootState = ReturnType<typeof rootReducer>;

*/

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = dispatchHook;
export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
