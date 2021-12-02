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
  const [selectedReferenceNumber, setSelectedReferenceNumber] = useState<number>();
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


  const handleAddTable = async (index: number, referenceNumber: number, seats: number) => {
    startLoading();
    const addedTable = await createTable(index, referenceNumber, seats).catch(() => startLoading());
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

  const generateNewReferenceNumber = (tables: ITable[]): number => {
    const tableNumbers = tables.map(t => t.referenceNumber).sort((a, b) => a - b);
    let referenceNumber = 1;
    for (let i = 0; i < tableNumbers.length; i++) {
      if (tableNumbers[i] !== referenceNumber)
        return referenceNumber;
      else
        referenceNumber++;
    }
    return referenceNumber;
  }

  if (!currentUser || !userRestaurant) return null;

  return (
    <div>
      <Row xs={10}>
        {generateGridArray(userRestaurant.tables).map((table, index) => (
          table ?
            <TableGridCell
              key={table._id}
              table={table}
              onClick={() => {
                setSelectedTable(table);
                setSelectedIndex(index);
                setSelectedReferenceNumber(table.referenceNumber);
                setShowTableModal(true);
              }}
            /> :
            <EmptyGridCell
              key={index}
              onDrop={(table: ITable) => handleDrop(table, index)}
              onClick={() => {
                setSelectedTable(table);
                setSelectedIndex(index);
                setSelectedReferenceNumber(generateNewReferenceNumber(userRestaurant.tables));
                setShowTableModal(true);
              }}
            />
        ))}
      </Row>

      <TableModal
        onDelete={handleDeleteTable}
        onEditTable={handleEditTable}
        onAddTable={(r, s) => handleAddTable(selectedIndex, r, s)}
        onClose={() => setShowTableModal(false)}
        isVisible={showTableModal}
        table={selectedTable}
        referenceNumber={selectedReferenceNumber}
      />
    </div>
  )
};

export default HomePage;
