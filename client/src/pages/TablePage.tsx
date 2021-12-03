import { Field, Form, Formik } from 'formik';
import React, { FC, useContext, useEffect, useState } from 'react'
import { Button, Card, Col, Image, Modal, Row } from 'react-bootstrap'
import * as Yup from 'yup';
import { ITable } from '../types'
import FormikCustomTextField from '../components/FormikCustomTextField';
import { useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import RestaurantContext from '../contexts/RestaurantContext';


const validationSchema = Yup.object().shape({
  seats: Yup.number()
    .required("* Number of seats is required")
    .min(1, "* Number of seats must be greater than 0")
    .max(100, "* Number of seats must be less than 100")
});


const TableReservationsModal = () => {
  const { currentUser } = useContext(AuthContext);
  const { userRestaurant } = useContext(RestaurantContext);
  const [table, setTable] = useState<ITable>()
  const params = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentUser || !userRestaurant) return;
    if (!params.tableId)
      navigate('/');

    const currentTable = userRestaurant.tables.find(t => t._id === params.tableId);
    if (!currentTable)
      navigate('/');

    setTable(currentTable);

  }, [params.tableId, userRestaurant]);

  if (!currentUser || !userRestaurant || !table) return null;

  return (
    <>
      <Card
        bg='warning'
        text='dark'>
        <Row className="align-items-center justify-content-between py-2 px-4">
          <Col className="px-3">
            <h1 style={{ color: '#9c2525', fontWeight: 'bold' }}>#{table.referenceNumber}</h1>
          </Col>
          <Col className="d-flex justify-content-end align-items-center">
            <h2 style={{ color: '#9c2525' }} className="me-2 mb-0">{table.seats} x</h2>
            <Image src="/chair.svg" fluid style={{ maxHeight: '75px' }} />
          </Col>
        </Row>
      </Card>
      <h1>{table.referenceNumber}</h1>
      <h1>{table.index}</h1>
      <h1>{table.seats}</h1>
    </>
  );
}

export default TableReservationsModal
function useNavigation() {
  throw new Error('Function not implemented.');
}

