import React, { useContext, useEffect, useState } from 'react'
import { Button, Row } from 'react-bootstrap';
import EmptyGridCell from '../components/EmptyGridCell';
import TableGridCell from '../components/TableGridCell';
import AuthContext from '../contexts/AuthContext';
import LoadingContext from '../contexts/LoadingContext';
import RestaurantContext from '../contexts/RestaurantContext';
import { ITable } from '../types';
import { generateGridArray } from '../utils/functions';

const HomePage = () => {
  const { logout, currentUser } = useContext(AuthContext);
  const { userRestaurant, setUserRestaurant } = useContext(RestaurantContext);
  const { startLoading, stopLoading } = useContext(LoadingContext);
  const [cardHeight, setCardHeight] = useState<number>(110);

  const handleDrop = (table: ITable, index: number) => {

    setUserRestaurant(restaurant => ({
      ...restaurant,
      tables: [
        ...restaurant.tables.filter(t => t._id !== table._id),
        { ...table, index }
      ]
    }));
  }
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
              cardHeight={cardHeight}
              setCardHeight={setCardHeight}
              onClick={() => console.log(table)}
            /> :
            <EmptyGridCell
              key={index + 1}
              index={index + 1}
              cardHeight={cardHeight}
              onDrop={(table: ITable) => handleDrop(table, index + 1)}
            />
        ))}
      </Row>
    </div>
  )
};

export default HomePage;
