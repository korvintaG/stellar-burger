import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '../../utils/types';
import { getIngredientsApi } from '../../utils/burger-api';

export interface IngredientsState {
  ingredients: TIngredient[]; // инградинеты
  buns: TIngredient[]; // булочки
  mains: TIngredient[]; // основа
  sauces: TIngredient[]; // соусы
  isLoading: boolean; // процесс загрузки
  error: string;
}

// начальное состояние слайса
export const initialState: IngredientsState = {
  ingredients: [],
  buns: [],
  mains: [],
  sauces: [],
  isLoading: false,
  error: ''
};

/*export function addIngredientData(state: IngredientsState, ingredients: TIngredient[]) : IngredientsState {
  let newState ={...state};
  newState.ingredients = ingredients;
  newState.buns = newState.ingredients.filter((el) => el.type === 'bun');
  newState.mains = newState.ingredients.filter((el) => el.type === 'main');
  newState.sauces = newState.ingredients.filter((el) => el.type === 'sauce');
  return newState;
}*/

export function getBuns(ingredients: TIngredient[]): TIngredient[] {
  return ingredients.filter((el) => el.type === 'bun');
}

export function getMains(ingredients: TIngredient[]): TIngredient[] {
  return ingredients.filter((el) => el.type === 'main');
}

export function getSauces(ingredients: TIngredient[]): TIngredient[] {
  return ingredients.filter((el) => el.type === 'sauce');
}

/*export function addIngredientData(state: IngredientsState, ingredients: TIngredient[])  {
  state.ingredients = ingredients;
  state.buns = state.ingredients.filter((el) => el.type === 'bun');
  state.mains = state.ingredients.filter((el) => el.type === 'main');
  state.sauces = state.ingredients.filter((el) => el.type === 'sauce');
}*/

export const fetchIngredients = createAsyncThunk(
  'fetchIngredients',
  getIngredientsApi
);

/**
 * Слайс дла работы с основными данными
 */
const burgerSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectIngrediens: (sliceState) => sliceState.ingredients, // инградиенты
    selectBuns: (sliceState) => sliceState.buns, // булочки
    selectMain: (sliceState) => sliceState.mains, // основы
    selectSauce: (sliceState) => sliceState.sauces, // соусы
    selectIsDataLoading: (sliceState) => sliceState.isLoading // процесс згрузки
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.error = '';
        state.isLoading = true;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message!;
        //console.log(`Error - ${state.error}`);
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
        state.buns = getBuns(action.payload);
        state.mains = getMains(action.payload);
        state.sauces = getSauces(action.payload);
        state.error = '';
      });
  }
});

export const {
  selectIsDataLoading,
  selectIngrediens,
  selectBuns,
  selectMain,
  selectSauce
} = burgerSlice.selectors;
export default burgerSlice.reducer;
