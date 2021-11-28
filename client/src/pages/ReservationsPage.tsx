import React, { useContext, useEffect } from 'react'
import { Button } from 'react-bootstrap';
import { useNavigate, useHref } from 'react-router';
import AuthContext from '../contexts/AuthContext';
import LoadingContext from '../contexts/LoadingContext';
import RestaurantContext from '../contexts/RestaurantContext';

const ReservationsPage = () => {
  const { logout, currentUser } = useContext(AuthContext);
  const { userRestaurant } = useContext(RestaurantContext);
  const { startLoading, stopLoading } = useContext(LoadingContext);
  const navigate = useNavigate();


  if (!currentUser || !userRestaurant) return null;

  return (
    <div>
      <h1>Reservations Page test</h1>
      <h1>{currentUser.name}</h1>
      <h1>{currentUser.email}</h1>
      <h1>{userRestaurant.name}</h1>
      <h1>{userRestaurant.manager}</h1>
    </div>
  )
};

export default ReservationsPage;
