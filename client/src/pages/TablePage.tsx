import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, Col, Image, Row, Tab, Table, Tabs } from 'react-bootstrap'
import { IReservation, ITable } from '../types'
import { useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import RestaurantContext from '../contexts/RestaurantContext';
import ReservationModal from '../components/ReservationModal';
import LoadingContext from '../contexts/LoadingContext';
import { createReservation, deleteReservation, getTableReservations, updateReservation } from '../utils/api';
import { toast } from 'react-toastify';
import { getDateString } from '../utils/functions';


const TableReservationsModal = () => {
  const { currentUser } = useContext(AuthContext);
  const { userRestaurant } = useContext(RestaurantContext);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [tableReservations, setTableReservations] = useState<IReservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<IReservation>();
  const { stopLoading, startLoading } = useContext(LoadingContext);
  const [table, setTable] = useState<ITable>();
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userRestaurant) return;
    if (!params.tableId)
      navigate('/');

    const currentTable = userRestaurant.tables.find(t => t._id === params.tableId);
    if (!currentTable)
      navigate('/');

    setTable(currentTable);
    getReservations(currentTable._id);
  }, [params.tableId, userRestaurant, navigate]);

  const getReservations = async (id: string) => {
    startLoading();
    const reservations = (await getTableReservations(id))
      .map(r => ({ ...r, date: new Date(r.date) }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    setTableReservations(reservations);
    stopLoading();
  }

  const handleAddReservation = async (reservation: IReservation) => {
    startLoading();
    let addedReservation = await createReservation(table._id, reservation).catch((error) => {
      if (error?.response?.data)
        toast.error(error.response.data);
    });
    if (addedReservation) {
      addedReservation = { ...addedReservation, date: new Date(addedReservation.date) };
      setTableReservations([...tableReservations, addedReservation]
        .sort((a, b) => a.date.getTime() - b.date.getTime()));

      setShowReservationModal(false);
    }
    stopLoading();
  }

  const editReservation = async (reservation: IReservation) => {
    setSelectedReservation(reservation);
    setShowReservationModal(true);
  }

  const handleEditReservation = async (reservation: IReservation) => {
    startLoading();
    let editedReservation = await updateReservation(table._id, reservation).catch((error) => {
      if (error?.response?.data)
        toast.error(error.response.data);
    });
    if (editedReservation) {
      editedReservation = { ...editedReservation, date: new Date(editedReservation.date) };

      setTableReservations([...tableReservations.filter(r => r._id !== reservation._id), editedReservation]
        .sort((a, b) => a.date.getTime() - b.date.getTime()));

      setShowReservationModal(false);
      setSelectedReservation(null);
    }
    stopLoading();
  }

  const removeReservation = async (reservation: IReservation) => {
    startLoading();
    const deletedReservation = await deleteReservation(table._id, reservation._id).catch((error) => {
      if (error?.response?.data)
        toast.error(error.response.data);
    });
    if (deletedReservation)
      setTableReservations([...tableReservations.filter(r => r._id !== reservation._id)]);
    stopLoading();
  }


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

      <Button className="my-3" onClick={() => setShowReservationModal(true)} type="submit" variant="success">
        Add New Reservation
      </Button>

      <Tabs defaultActiveKey="future" >
        <Tab eventKey="future" title="Future Reservations">
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
              {tableReservations.filter(e => e.date.getTime() >= new Date().getTime()).map(reservation => (
                <tr key={reservation._id}>
                  <td>{getDateString(reservation.date)}</td>
                  <td>{reservation.customerName}</td>
                  <td>{reservation.customerEmail}</td>
                  <td>{reservation.customerPhoneNumber}</td>
                  <td>
                    <Button variant="warning" className="me-2" onClick={() => editReservation(reservation)}>Edit</Button>
                    <Button variant="dark" onClick={() => removeReservation(reservation)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="past" title="Past Reservations">
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
              {tableReservations.filter(e => e.date.getTime() < new Date().getTime()).map(reservation => (
                <tr key={reservation._id}>
                  <td>{getDateString(reservation.date)}</td>
                  <td>{reservation.customerName}</td>
                  <td>{reservation.customerEmail}</td>
                  <td>{reservation.customerPhoneNumber}</td>
                  <td>
                    <Button variant="warning" className="me-2" onClick={() => editReservation(reservation)}>Edit</Button>
                    <Button variant="dark" onClick={() => removeReservation(reservation)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>

      <ReservationModal
        onEditReservation={handleEditReservation}
        onAddReservation={handleAddReservation}
        onClose={() => setShowReservationModal(false)}
        isVisible={showReservationModal}
        tableId={table._id}
        reservation={selectedReservation}
      />
    </>
  );
}

export default TableReservationsModal;
