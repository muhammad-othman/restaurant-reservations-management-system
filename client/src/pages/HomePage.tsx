import React, { useContext, useEffect } from 'react'
import { Button, Row } from 'react-bootstrap';
import { useNavigate, useHref } from 'react-router';
import GridCell from '../components/GridCell';
import AuthContext from '../contexts/AuthContext';
import LoadingContext from '../contexts/LoadingContext';
import RestaurantContext from '../contexts/RestaurantContext';
import { generateGridArray } from '../utils/functions';

const HomePage = () => {
  const { logout, currentUser } = useContext(AuthContext);
  const { userRestaurant } = useContext(RestaurantContext);
  const { startLoading, stopLoading } = useContext(LoadingContext);
  const navigate = useNavigate();


  if (!currentUser || !userRestaurant) return null;

  return (
    <div>
      <Row xs={10}>
        {generateGridArray(userRestaurant.tables).map((table, index) => (
          <GridCell key={index + 1} table={table} index={index + 1} />
        ))}
      </Row>
    </div>
  )
};

export default HomePage;
