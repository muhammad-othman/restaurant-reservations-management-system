import React, { useContext, useEffect } from 'react'
import { Button } from 'react-bootstrap';
import { useNavigate, useHref } from 'react-router';
import AuthContext from '../contexts/AuthContext';
import LoadingContext from '../contexts/LoadingContext';
import RestaurantContext from '../contexts/RestaurantContext';

const ReportsPage = () => {
  const { logout, currentUser } = useContext(AuthContext);
  const { userRestaurant } = useContext(RestaurantContext);
  const { startLoading, stopLoading } = useContext(LoadingContext);
  const navigate = useNavigate();


  if (!currentUser || !userRestaurant) return null;

  return (
    <div>
      <h1>Reports Page test</h1>
    </div>
  )
};

export default ReportsPage;
