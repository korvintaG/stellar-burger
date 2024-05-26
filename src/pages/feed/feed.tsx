import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector, AppDispatch } from '../../services/store';
import {
  selectFeeds,
  fetchFeeds,
  selectIsDataLoading
} from '../../slices/burgersSlice';
import { isLoadingType } from '../../utils/checkLoading';

export const Feed: FC = () => {
  const orders = useSelector(selectFeeds);
  const isLoadind = useSelector(selectIsDataLoading);

  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    if (orders.length === 0) dispatch(fetchFeeds());
  }, []);

  return isLoadingType(isLoadind, 'fetchFeeds') ? (
    <Preloader />
  ) : (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
