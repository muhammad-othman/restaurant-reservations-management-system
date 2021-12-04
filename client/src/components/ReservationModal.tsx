import { Field, Form, Formik } from 'formik';
import React, { FC } from 'react'
import { Button, Modal } from 'react-bootstrap'
import * as Yup from 'yup';
import { IReservation } from '../types'
import FormikCustomTextField from './FormikCustomTextField';


export interface IReservationModalProps {
  tableId: string;
  reservation?: IReservation;
  onEditReservation: (reservation: IReservation) => Promise<void>;
  onAddReservation: (reservation: IReservation) => Promise<void>;
  onClose: () => void;
  isVisible: boolean;
}

const validationSchema = Yup.object().shape({
  customerName: Yup.string().required('Customer name is required'),
  customerEmail: Yup.string().email('Invalid email').required('Customer email is required'),
  customerPhoneNumber: Yup.string().required('Customer phone number is required'),
  date: Yup.date().nullable().required('Reservation date is required'),
});


const ReservationModal: FC<IReservationModalProps> = ({
  tableId,
  reservation,
  onEditReservation,
  onClose,
  onAddReservation,
  isVisible,
}) => {

  const submitModal = async (newReservation: IReservation) => {
    if (reservation) {
      await onEditReservation(newReservation);
    }
    else {
      await onAddReservation(newReservation);
    }
  }

  return (
    <Modal show={isVisible} onHide={onClose} centered>
      <Formik<IReservation>
        initialValues={{
          _id: reservation ? reservation._id : "",
          customerName: reservation ? reservation.customerName : "",
          customerEmail: reservation ? reservation.customerEmail : "",
          customerPhoneNumber: reservation ? reservation.customerPhoneNumber : "",
          date: reservation ? reservation.date : null,
          table: tableId,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          await submitModal(values);
          setSubmitting(false);
        }}
      >
        {({ handleSubmit,
          isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>{reservation ? 'Edit Reservation' : 'Add Reservation'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Field name="date"
                component={FormikCustomTextField}
                label="Reservation Date"
                id="formDate"
                type="date"
                placeholder="Enter the Reservation Date" />
              <Field name="customerName"
                component={FormikCustomTextField}
                label="Customer Name"
                id="formCustomerName"
                placeholder="Enter the Customer Name" />
              <Field name="customerEmail"
                component={FormikCustomTextField}
                label="Customer Email"
                id="formCustomerEmail"
                type="email"
                placeholder="Enter the Customer Email" />
              <Field name="customerPhoneNumber"
                component={FormikCustomTextField}
                label="Customer Phone Number"
                id="formCustomerPhoneNumber"
                placeholder="Enter the Customer Phone Number" />
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
              {reservation ?
                <Button disabled={isSubmitting} type="submit" variant="success">
                  Save Changes
                </Button>
                :
                <Button disabled={isSubmitting} type="submit" variant="success">
                  Add Reservation
                </Button>}
            </Modal.Footer>

          </Form>
        )}
      </Formik>

    </Modal>
  )
}

export default ReservationModal
