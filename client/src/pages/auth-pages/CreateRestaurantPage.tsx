import React, { useContext } from 'react';
import { Field, Formik } from 'formik';
import { Button, Container, Form, Row, Col, Card, ButtonGroup, Image } from 'react-bootstrap';
import * as Yup from 'yup';
import './auth.scss';
import FormikCustomTextField from '../../components/FormikCustomTextField';
import LoadingContext from '../../contexts/LoadingContext';
import { createRestaurant } from '../../utils/api';
import AuthContext from '../../contexts/AuthContext';
import RestaurantContext from '../../contexts/RestaurantContext';

// Schema for yup
const validationSchema = Yup.object().shape({
  restaurantName: Yup.string()
    .required("* Restaurant Name is required"),
});

const CreateRestaurantPage = () => {
  const { startLoading, stopLoading } = useContext(LoadingContext);
  const { setUserRestaurant } = useContext(RestaurantContext);
  const { currentUser, updateUserData } = useContext(AuthContext);

  const submitCreateRestaurant = async (restaurantName: string) => {
    startLoading();
    const restaurant = await createRestaurant(restaurantName).catch(() => {
      stopLoading();
    });
    stopLoading();

    if (restaurant) {
      setUserRestaurant(restaurant);
      updateUserData({ ...currentUser, restaurant: restaurant._id });
    }

  }

  return (
    <Container >
      <Row className="justify-content-center auth-form-container ">
        <Row className="justify-content-center m-4">
          <Image src="./logo.svg" style={{ maxHeight: '250px' }} />
        </Row>
        <Col xs="10" md="8" lg="6">
          <Card bg={'light'} >
            <Card.Header as="h5">Create Restaurant</Card.Header>
            <Card.Body >
              <Formik<{ restaurantName: string }>
                initialValues={{ restaurantName: "" }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  setSubmitting(true);
                  await submitCreateRestaurant(values.restaurantName);
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
                    <Field name="restaurantName"
                      component={FormikCustomTextField}
                      label="Restaurant Name"
                      id="formName"
                      placeholder="Enter restaurant name" />


                    <ButtonGroup className="d-flex">
                      <Button className="login-form-button mt-3" variant="primary" type="submit" disabled={isSubmitting}>
                        Create Restaurant
                      </Button>
                    </ButtonGroup>
                  </Form>
                )}
              </Formik>
            </Card.Body >
          </Card >
        </Col >
      </Row >
    </Container >
  );
}


export default CreateRestaurantPage;