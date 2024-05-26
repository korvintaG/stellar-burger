import {
  ConstructorPage,
  Feed,
  NotFound404,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader } from '@components';

import '../../index.css';
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route/index';
import { Modal } from '../modal';
import { OrderInfo } from '../../components/order-info';
import { IngredientDetails } from '../../components/ingredient-details';
import { AppDispatch, useSelector } from '../../services/store';
import { useDispatch } from 'react-redux';
import { getUser, selectIsUserDataLoading } from '../../slices/userSlice';
import { fetchIngredients } from '../../slices/burgersSlice';
import { useNavigate, useLocation } from 'react-router';
import { getCookie } from '../../utils/cookie';
import { isLoadingType } from '../../utils/checkLoading';

const App = () => {
  const location = useLocation();
  const background = location.state?.background;
  const isUselLoading = useSelector(selectIsUserDataLoading);

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const modalClose = () => {
    navigate(-1);
  };

  useEffect(() => {
    const atoken = getCookie('accessToken');
    if (atoken && !isLoadingType(isUselLoading, 'getUser')) dispatch(getUser());
    dispatch(fetchIngredients());
  }, []);

  return (
    <div className={styles.app}>
      <Routes location={background || location}>
        <Route
          path='/'
          element={
            <>
              <AppHeader />
              <ConstructorPage />
            </>
          }
        />
        <Route
          path='/feed'
          element={
            <>
              <AppHeader />
              <Feed />
            </>
          }
        />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <>
                <AppHeader />
                <Login />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <>
                <AppHeader />
                <Register />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <>
                <AppHeader />
                <ForgotPassword />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <>
                <AppHeader />
                <ResetPassword />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <>
                <AppHeader />
                <Profile />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <>
                <AppHeader />
                <ProfileOrders />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path='/feed/:number'
          element={
            <>
              <AppHeader />
              <OrderInfo />
            </>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <>
              <AppHeader />
              <IngredientDetails />
            </>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <>
                <AppHeader />
                <OrderInfo />
              </>
            </ProtectedRoute>
          }
        />
        <Route path='/*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='' onClose={modalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='' onClose={modalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title='' onClose={modalClose}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
