import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TBurgerConstructor, TOrder } from '../utils/types';
import {
  getOrdersApi,
  orderBurgerApi,
  getOrderByNumberApi,
  getIngredientsApi,
  getFeedsApi
} from '../utils/burger-api';
import { v4 as randomId } from 'uuid';

interface BurgerState {
  ingrediens: TIngredient[];
  feeds: TOrder[];
  orders: TOrder[];
  burgerConstructor: TBurgerConstructor;
  isLoading: boolean;
  currentOrder: TOrder | null;
}

const initialState: BurgerState = {
  ingrediens: [],
  feeds: [],
  orders: [],
  burgerConstructor: {
    bun: null,
    ingredients: [],
    orderRequest: false,
    orderModalData: null
  },
  isLoading: false,
  currentOrder: null
};

export const fetchIngredients = createAsyncThunk('fetchIngredients', async () =>
  getIngredientsApi()
);

export const fetchFeeds = createAsyncThunk('fetchFeeds', async () =>
  getFeedsApi()
);

export const orderBurger = createAsyncThunk(
  'orderBurger',
  async (data: string[]) => orderBurgerApi(data)
);

export const fetchOrders = createAsyncThunk('fetchOrders', async () =>
  getOrdersApi()
);

export const getOrder = createAsyncThunk('getOrder', async (num: number) =>
  getOrderByNumberApi(num)
);

const burgerSlice = createSlice({
  name: 'burgers',
  initialState,
  reducers: {
    setBun: (state, action: PayloadAction<TIngredient>) => {
      state.burgerConstructor.bun = action.payload;
    },
    setOrderModalData: (state, action: PayloadAction<TOrder | null>) => {
      if (!action.payload) {
        state.burgerConstructor.ingredients = [];
        state.burgerConstructor.bun = null;
      }
      state.burgerConstructor.orderModalData = action.payload;
    },
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.burgerConstructor.ingredients.push({
        ...action.payload,
        id: randomId()
      });
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.burgerConstructor.ingredients =
        state.burgerConstructor.ingredients.filter(
          (el) => el.id != action.payload
        );
    },
    upIngredient: (state, action: PayloadAction<string>) => {
      for (let i = 1; i < state.burgerConstructor.ingredients.length; i++)
        if (state.burgerConstructor.ingredients[i].id === action.payload) {
          const temp = state.burgerConstructor.ingredients[i - 1];
          state.burgerConstructor.ingredients[i - 1] =
            state.burgerConstructor.ingredients[i];
          state.burgerConstructor.ingredients[i] = temp;
          break;
        }
    },
    downIngredient: (state, action: PayloadAction<string>) => {
      for (let i = 0; i < state.burgerConstructor.ingredients.length - 1; i++)
        if (state.burgerConstructor.ingredients[i].id === action.payload) {
          const temp = state.burgerConstructor.ingredients[i + 1];
          state.burgerConstructor.ingredients[i + 1] =
            state.burgerConstructor.ingredients[i];
          state.burgerConstructor.ingredients[i] = temp;
          break;
        }
    }
  },
  selectors: {
    selectIngrediens: (sliceState) => sliceState.ingrediens,
    selectBuns: (sliceState) =>
      sliceState.ingrediens.filter((el) => el.type === 'bun'),
    selectMain: (sliceState) =>
      sliceState.ingrediens.filter((el) => el.type === 'main'),
    selectSauce: (sliceState) =>
      sliceState.ingrediens.filter((el) => el.type === 'sauce'),
    selectburgerConstructor: (sliceState) => sliceState.burgerConstructor,
    selectFeeds: (sliceState) => sliceState.feeds,
    selectOrders: (sliceState) => sliceState.orders,
    selectIsDataLoading: (sliceState) => sliceState.isLoading,
    selectOrderRequest: (sliceState) =>
      sliceState.burgerConstructor.orderRequest,
    selectOrderModalData: (sliceState) =>
      sliceState.burgerConstructor.orderModalData
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchIngredients.rejected, (state, _) => {
        state.isLoading = false;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingrediens = action.payload;
      })
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFeeds.rejected, (state, _) => {
        state.isLoading = false;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feeds = action.payload.orders;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrders.rejected, (state, _) => {
        state.isLoading = false;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(orderBurger.pending, (state) => {
        state.burgerConstructor.orderRequest = true;
      })
      .addCase(orderBurger.rejected, (state, _) => {
        state.burgerConstructor.orderRequest = false;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.burgerConstructor.orderModalData = action.payload.order;
        state.burgerConstructor.orderRequest = false;
      })
      .addCase(getOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrder.rejected, (state, _) => {
        state.isLoading = false;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload.orders[0];
      });
  }
});

export const {
  selectOrderModalData,
  selectOrderRequest,
  selectIsDataLoading,
  selectOrders,
  selectIngrediens,
  selectBuns,
  selectFeeds,
  selectMain,
  selectSauce,
  selectburgerConstructor
} = burgerSlice.selectors;
export const {
  setOrderModalData,
  setBun,
  addIngredient,
  removeIngredient,
  upIngredient,
  downIngredient
} = burgerSlice.actions;
export default burgerSlice.reducer;
