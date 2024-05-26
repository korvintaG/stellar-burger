import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useDispatch } from 'react-redux';
import { useSelector, AppDispatch } from '../../services/store';

import {
  selectOrders,
  selectIngrediens,
  selectFeeds,
  selectCurrentOrder,
  getOrder
} from '../../slices/burgersSlice';
import { useLocation } from 'react-router';

export const OrderInfo: FC = () => {
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  //let orders: TOrder[] = [];
  const dispatch: AppDispatch = useDispatch();
  const orderData = useSelector(selectCurrentOrder);
  const ingredients = useSelector(selectIngrediens);

  useEffect(() => {
    dispatch(getOrder(Number(pathParts[pathParts.length - 1])));
  }, []);

  /*if (pathParts[pathParts.length - 2] === 'feed')
    orders = useSelector(selectFeeds);
  else orders = useSelector(selectOrders);

  const orderData = orders.find(
    (el) => String(el.number) === pathParts[pathParts.length - 1]
  );*/
  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
