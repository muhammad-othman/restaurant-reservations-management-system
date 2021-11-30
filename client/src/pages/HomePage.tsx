import React, { useContext, useEffect, useState } from 'react'
import { Button, Row } from 'react-bootstrap';
import EmptyGridCell from '../components/EmptyGridCell';
import TableGridCell from '../components/TableGridCell';
import TableModal from '../components/TableModal';
import AuthContext from '../contexts/AuthContext';
import LoadingContext from '../contexts/LoadingContext';
import RestaurantContext from '../contexts/RestaurantContext';
import { ITable } from '../types';
import { createTable, deleteTable, updateTable } from '../utils/api';
import { generateGridArray } from '../utils/functions';

const HomePage = () => {
  const { currentUser } = useContext(AuthContext);
  const { userRestaurant, setUserRestaurant } = useContext(RestaurantContext);
  const { stopLoading, startLoading } = useContext(LoadingContext);

  const [showTableModal, setShowTableModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState<ITable>();
  const [selectedIndex, setSelectedIndex] = useState<number>();



  const handleDrop = (table: ITable, index: number) => {
    setUserRestaurant(restaurant => ({
      ...restaurant,
      tables: [
        ...restaurant.tables.filter(t => t._id !== table._id),
        { ...table, index }
      ]
    }));

    updateTable({ ...table, index }).catch(() => setUserRestaurant(restaurant => ({
      ...restaurant,
      tables: [
        ...restaurant.tables.filter(t => t._id !== table._id),
        table,
      ]
    })));
  }

  const handleDeleteTable = async (table: ITable) => {
    startLoading();
    await deleteTable(table._id).catch(() => startLoading());
    setUserRestaurant(restaurant => ({
      ...restaurant,
      tables: [
        ...restaurant.tables.filter(t => t._id !== table._id)
      ]
    }));
    stopLoading();
  }

  const handleEditTable = async (table: ITable) => {
    startLoading();
    const updatedTable = await updateTable(table).catch(() => startLoading());
    if (updatedTable)
      setUserRestaurant(restaurant => ({
        ...restaurant,
        tables: [
          ...restaurant.tables.filter(t => t._id !== table._id),
          updatedTable,
        ]
      }));
    stopLoading();
  }


  const handleAddTable = async (index: number, seats: number) => {
    startLoading();
    const addedTable = await createTable(index, seats).catch(() => startLoading());
    if (addedTable)
      setUserRestaurant(restaurant => ({
        ...restaurant,
        tables: [
          ...restaurant.tables,
          addedTable,
        ]
      }));
    stopLoading();
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
              onClick={() => {
                setSelectedTable(table);
                setSelectedIndex(index + 1);
                setShowTableModal(true);
              }}
            /> :
            <EmptyGridCell
              key={index + 1}
              index={index + 1}
              onDrop={(table: ITable) => handleDrop(table, index + 1)}
              onClick={() => {
                setSelectedTable(table);
                setSelectedIndex(index + 1);
                setShowTableModal(true);
              }}
            />
        ))}
      </Row>

      <TableModal
        onDelete={handleDeleteTable}
        onEditTable={handleEditTable}
        onAddTable={handleAddTable}
        onClose={() => setShowTableModal(false)}
        isVisible={showTableModal}
        table={selectedTable}
        index={selectedIndex}
      />
    </div>
  )
};

export default HomePage;
