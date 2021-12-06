import React, { useContext, useState } from 'react';
import { Field, Formik } from 'formik';
import { Button, Container, Form, Row, Col, Card, ButtonGroup, Image } from 'react-bootstrap';
import * as Yup from 'yup';
import './auth.scss';
import FormikCustomTextField from '../../components/FormikCustomTextField';
import { ILoginFormType } from '../../types';
import LoadingContext from '../../contexts/LoadingContext';
import { login } from '../../utils/api';
import AuthContext from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

// Schema for yup
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("*Must be a valid email address")
    .required("*Email is required"),
  password: Yup.string()
    .required("*Password is required"),
});

const LoginPage = () => {
  const { startLoading, stopLoading } = useContext(LoadingContext);
  const { setUserData } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const submitLogin = async (userData: ILoginFormType) => {
    startLoading();
    const loginResponse = await login(userData).catch(() => {
      setErrorMessage('Incorrect email or password');
      stopLoading();
    });
    if (loginResponse) {
      setUserData(loginResponse);
    }
    else {
      setErrorMessage('Incorrect email or password');
      stopLoading();
    }

  }

  return (
    <Container >

      <Row className="justify-content-center auth-form-container ">
        <Row className="justify-content-center m-4">
          <Image src="./logo.svg" style={{ maxHeight: '200px' }} />
        </Row>
        <Col xs="10" md="8" lg="6">
          <Card bg={'light'} >
            <Card.Header as="h5">Login</Card.Header>
            <Card.Body >
              <Form.Text className="text-danger">{errorMessage}</Form.Text>
              <br />
              <Formik<ILoginFormType>
                initialValues={{ email: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  setSubmitting(true);
                  await submitLogin(values);
                  setSubmitting(false);
                }}
              >
                {({ handleSubmit,
                  isSubmitting }) => (
                  <Form onSubmit={handleSubmit}>

                    <Field name="email"
                      component={FormikCustomTextField}
                      label="Email Address"
                      id="formEmail"
                      placeholder="Enter email" />


                    <Field name="password"
                      component={FormikCustomTextField}
                      label="Password"
                      id="formPassword"
                      placeholder="Enter password" />

                    <ButtonGroup className="d-flex">
                      <Button className="login-form-button mt-3" variant="primary" type="submit" disabled={isSubmitting}>
                        Login
                      </Button>

                    </ButtonGroup>
                    <div className="d-flex justify-content-center align-items-center mt-4">
                      You don't have an account? <Link to="/signup" className="ms-1">Sign Up</Link>
                    </div>
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


export default LoginPage;