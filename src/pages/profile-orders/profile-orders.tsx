import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { AppDispatch, useSelector } from '../../services/store';
import { useDispatch } from 'react-redux';
import {
  selectOrders,
  fetchOrders,
  selectIsDataLoading
} from '../../slices/burgersSlice';
import { Preloader } from '@ui';
import { isLoadingType } from '../../utils/checkLoading';

export const ProfileOrders: FC = () => {
  const orders = useSelector(selectOrders); // userDataSelector - селектор получения пользователя из store
  const isDataLoading = useSelector(selectIsDataLoading);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrders());
  }, []);

  if (isLoadingType(isDataLoading, 'fetchOrders')) return <Preloader />;
  else return <ProfileOrdersUI orders={orders} />;
};
