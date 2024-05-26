import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { AppDispatch } from '../../services/store';
import { useDispatch } from 'react-redux';
import {
  removeIngredient,
  upIngredient,
  downIngredient
} from '../../slices/burgersSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const appDispatch = useDispatch<AppDispatch>();
    const handleMoveDown = () => appDispatch(downIngredient(ingredient.id));
    const handleMoveUp = () => appDispatch(upIngredient(ingredient.id));
    const handleClose = () => appDispatch(removeIngredient(ingredient.id));

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
