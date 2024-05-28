import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { Preloader, ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { logoutUser } from '../../slices/userSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };
  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
