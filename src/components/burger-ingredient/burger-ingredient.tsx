import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { AppDispatch } from '../../services/store';
import { useDispatch } from 'react-redux';
import { setBun, addIngredient } from '../../slices/burgersSlice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const appDispatch = useDispatch<AppDispatch>();

    const handleAdd = () => {
      if (ingredient.type === 'bun') appDispatch(setBun(ingredient));
      else appDispatch(addIngredient(ingredient));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
