import React from 'react'
import { Form } from 'react-bootstrap';


const FormikCustomTextField = ({
    field, // { name, value, onChange, onBlur }
    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
    label,
    id,
    type,
    optional,
    ...props
}) => {
    const isPassword = field.name?.toLowerCase().indexOf('password') >= 0;

    return (
        <Form.Group className="mb-1">
            <Form.Label htmlFor={id}>{label} {!optional && <sup>*</sup>}</Form.Label>
            <Form.Control
                id={id}
                {...field} {...props}

                as={type === 'textarea' ? "textarea" : 'input'} rows={5}
                type={isPassword ? 'password' : (type || 'text')}
                className={touched[field.name] && errors[field.name] ? "error-input" : 'mb-4'}
            />

            {touched[field.name] && errors[field.name] && (
                <Form.Text className="text-danger">{errors[field.name]}</Form.Text>
            )}
        </Form.Group>
    );
};
export default FormikCustomTextField;
