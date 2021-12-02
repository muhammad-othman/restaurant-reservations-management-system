import React, { useContext, useEffect } from 'react'
import { Button, Row } from 'react-bootstrap';
import { useNavigate, useHref } from 'react-router';
import EmptyGridCell from '../components/EmptyGridCell';
import TableGridCell from '../components/TableGridCell';
import TableModal from '../components/TableModal';
import AuthContext from '../contexts/AuthContext';
import LoadingContext from '../contexts/LoadingContext';
import RestaurantContext from '../contexts/RestaurantContext';
import { ITable } from '../types';
import { generateGridArray } from '../utils/functions';

const ReservationsPage = () => {
  const { logout, currentUser } = useContext(AuthContext);
  const { userRestaurant } = useContext(RestaurantContext);
  const { startLoading, stopLoading } = useContext(LoadingContext);
  const navigate = useNavigate();


  if (!currentUser || !userRestaurant) return null;

  return (
    <div>
      <Row xs={10}>
        {generateGridArray(userRestaurant.tables).map((table, index) => (
          table ?
            <TableGridCell
              key={index + 1}
              table={table}
              index={index + 1}
              onClick={() => console.log(table)}
            /> :
            <EmptyGridCell
              key={index + 1}
              index={index + 1}
            />
        ))}
      </Row>

    </div>
  )
};

export default ReservationsPage;
