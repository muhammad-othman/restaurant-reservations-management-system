import React, { useContext, useState } from 'react';
import { Field, Formik } from 'formik';
import { Button, Container, Form, Row, Col, Card, ButtonGroup, Image } from 'react-bootstrap';
import * as Yup from 'yup';
import './auth.scss';
import FormikCustomTextField from '../../components/FormikCustomTextField';
import { ISignUpFormType } from '../../types';
import LoadingContext from '../../contexts/LoadingContext';
import { signUp } from '../../utils/api';
import AuthContext from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

// Schema for yup
const validationSchema = Yup.object().shape({
  name: Yup
    .string()
    .required('Your name is required'),
  email: Yup.string()
    .email("*Must be a valid email address")
    .required("*Email is required"),
  password: Yup.string()
    .required("*Password is required")
    .min(8, 'Password is too short - should be 8 chars minimum'),
  confirmPassword: Yup
    .string()
    .required('Confirm Password is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const SignUpPage = () => {
  const { startLoading, stopLoading } = useContext(LoadingContext);
  const { setUserData } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const submitSignUp = async (userData: ISignUpFormType) => {
    startLoading();
    const signUpResponse = await signUp(userData).catch(() => {
      setErrorMessage('Email is already taken');
      stopLoading();
    });
    if (signUpResponse) {
      setUserData(signUpResponse);
    }
    else {
      setErrorMessage('Email is already taken');
      stopLoading();
    }

  }

  return (
    <Container >
      <Row className="justify-content-center auth-form-container ">

        <Col xs="10" md="8" lg="6">
          <Row xs="10" className="justify-content-center m-4">
            <Image src="./logo.svg" style={{ maxHeight: '250px' }} />
          </Row>
          <Card bg={'light'} >
            <Card.Header as="h5">SignUp</Card.Header>
            <Card.Body >
              <Form.Text className="text-danger">{errorMessage}</Form.Text>
              <br />
              <br />
              <Formik<ISignUpFormType>
                initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  setSubmitting(true);
                  await submitSignUp(values);
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
                    <Field name="name"
                      component={FormikCustomTextField}
                      label="Name"
                      id="formName"
                      placeholder="Enter your name" />

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

                    <Field name="confirmPassword"
                      component={FormikCustomTextField}
                      label="Confirm Password"
                      id="formConfirmPassword"
                      placeholder="Enter confirm password" />

                    <ButtonGroup className="d-flex">
                      <Button className="login-form-button mt-3" variant="primary" type="submit" disabled={isSubmitting}>
                        SignUp
                      </Button>
                    </ButtonGroup>

                    <div className="d-flex justify-content-center align-items-center mt-4">
                      Already has an account? <Link to="/login" className="ms-1">Login</Link>
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


export default SignUpPage;