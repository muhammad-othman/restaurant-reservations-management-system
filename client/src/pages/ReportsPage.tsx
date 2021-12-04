import React, { useContext, useEffect, useState } from 'react'
import { Col, Form, Row, Tab, Table, Tabs } from 'react-bootstrap'
import { IReservation } from '../types'
import AuthContext from '../contexts/AuthContext';
import RestaurantContext from '../contexts/RestaurantContext';
import LoadingContext from '../contexts/LoadingContext';
import { getDateReservations } from '../utils/api';
import { toast } from 'react-toastify';
import { getDateString } from '../utils/functions';
import DatePicker from "react-datepicker";


const ReportsPage = () => {
  const { currentUser } = useContext(AuthContext);
  const { userRestaurant } = useContext(RestaurantContext);
  const { stopLoading, startLoading } = useContext(LoadingContext);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [tablesReservations, setTablesReservations] = useState<{ referenceNumber: number, reservations: IReservation[] }[]>([]);

  useEffect(() => {
    if (!startDate || !endDate || !userRestaurant) return;
    getReservations(startDate, endDate);
  }, [startDate, endDate]);


  const getReservations = async (start: Date, end: Date) => {
    startLoading();

    const reservations = (await getDateReservations(start.toISOString(), end.toISOString()))
      .map(r => ({ ...r, date: new Date(r.date) }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    const tablesReservationsArray: { referenceNumber: number, reservations: IReservation[] }[] = [];

    reservations.forEach(r => {
      const table = userRestaurant.tables.find(t => t._id === r.table);
      if (table) {
        const tableReservations = tablesReservationsArray.find(tr => tr.referenceNumber === table.referenceNumber);
        if (tableReservations) {
          tableReservations.reservations.push(r);
        } else {
          tablesReservationsArray.push({ referenceNumber: table.referenceNumber, reservations: [r] });
        }
      }
    });

    setTablesReservations(tablesReservationsArray);
    stopLoading();
  }


  if (!currentUser || !userRestaurant) return null;

  return (
    <>
      <Row className="my-3">
        <Col>
          <Form.Group>
            <Form.Label htmlFor="startDatePicker">Start Date</Form.Label>
            <DatePicker className="form-control" selected={startDate} onChange={(date) => setStartDate(date as Date)} />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label htmlFor="endDatePicker">End Date</Form.Label>
            <DatePicker className="form-control" selected={endDate} onChange={(date) => setEndDate(date as Date)} />
          </Form.Group>
        </Col>
      </Row>

      <Tabs>
        {tablesReservations.map(({ referenceNumber, reservations }) => (
          <Tab eventKey={referenceNumber} title={`#${referenceNumber}`}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Customer Name</th>
                  <th>Customer Email</th>
                  <th>Customer Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(reservation => (
                  <tr key={reservation._id}>
                    <td>{getDateString(reservation.date)}</td>
                    <td>{reservation.customerName}</td>
                    <td>{reservation.customerEmail}</td>
                    <td>{reservation.customerPhoneNumber}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Tab>))}
      </Tabs>
    </>
  );
}

export default ReportsPage;
