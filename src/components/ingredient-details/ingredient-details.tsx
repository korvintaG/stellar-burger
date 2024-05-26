import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { selectIngrediens } from '../../slices/burgersSlice';
import { useLocation } from 'react-router';

export const IngredientDetails: FC = () => {
  const ingredientDatas = useSelector(selectIngrediens);
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const ingredientData = ingredientDatas.find(
    (el) => el._id == pathParts[pathParts.length - 1]
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
