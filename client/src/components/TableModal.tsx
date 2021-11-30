import { Field, Form, Formik } from 'formik';
import React, { FC } from 'react'
import { Button, Modal } from 'react-bootstrap'
import * as Yup from 'yup';
import { ITable } from '../types'
import FormikCustomTextField from './FormikCustomTextField';


export interface ITableModalProps {
  index: number;
  table: ITable;
  onEditTable: (table: ITable) => Promise<void>;
  onAddTable: (index: number, seats: number) => Promise<void>;
  onDelete: (table: ITable) => void;
  onClose: () => void;
  isVisible: boolean;
}

const validationSchema = Yup.object().shape({
  seats: Yup.number()
    .required("* Number of seats is required")
    .min(1, "* Number of seats must be greater than 0")
});


const TableModal: FC<ITableModalProps> = ({
  index,
  table,
  onEditTable,
  onDelete,
  onClose,
  onAddTable,
  isVisible,
}) => {

  const submitModal = async (seats: number) => {
    if (table) {
      await onEditTable({ ...table, seats });
    }
    else {
      await onAddTable(index, seats);
    }
    onClose();
  }

  return (
    <Modal show={isVisible} onHide={onClose}>


      <Formik<{ seats: string }>
        initialValues={{ seats: table?.seats.toString() || '' }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          await submitModal(+values.seats);
          setSubmitting(false);
        }}
      >
        {({ values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>#{index}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Field name="seats"
                component={FormikCustomTextField}
                label="Number of Seats"
                id="formSeats"
                type="number"
                placeholder="Enter the number of seats" />
            </Modal.Body>


            <Modal.Footer>

              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>

              {table ? (<><Button disabled={isSubmitting} onClick={async () => {
                await onDelete(table);
                onClose();
              }} variant="dark">
                Delete Table
              </Button>
                <Button disabled={isSubmitting} type="submit" variant="success">
                  Save Changes
                </Button></>)
                : <Button disabled={isSubmitting} type="submit" variant="success">
                  Add Table
                </Button>}
            </Modal.Footer>

          </Form>
        )}
      </Formik>

    </Modal>
  )
}

export default TableModal
