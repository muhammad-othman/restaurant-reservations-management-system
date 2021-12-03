import React, { useContext } from 'react'
import { Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import EmptyGridCell from '../components/EmptyGridCell';
import TableGridCell from '../components/TableGridCell';
import AuthContext from '../contexts/AuthContext';
import RestaurantContext from '../contexts/RestaurantContext';
import { generateGridArray } from '../utils/functions';

const ReservationsPage = () => {
  const { currentUser } = useContext(AuthContext);
  const { userRestaurant } = useContext(RestaurantContext);
  const navigate = useNavigate();
  if (!currentUser || !userRestaurant) return null;

  return (
    <>
      <Row xs={10}>
        {generateGridArray(userRestaurant.tables).map((table, index) => (
          table ?
            <TableGridCell
              key={index + 1}
              table={table}
              onClick={() => navigate(`/table/${table._id}`)}
            /> :
            <EmptyGridCell
              key={index + 1}
            />
        ))}
      </Row>
    </>
  )
};

export default ReservationsPage;
