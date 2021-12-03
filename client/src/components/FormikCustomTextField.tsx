import React from 'react'
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";

const FormikCustomTextField = ({
    field,
    form: { touched, errors, setFieldValue, submitCount },
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

            {type === 'date' ?

                <DatePicker
                    id={id}
                    {...field} {...props}
                    selected={field.value}
                    onChange={d => setFieldValue(field.name, d)}
                    showTimeSelect
                    filterTime={d => d.getMinutes() === 0}

                    dateFormat="M/d/yyyy, h aa"
                    className={(touched[field.name] || submitCount > 0) && errors[field.name] ? "form-control error-input" : 'form-control mb-4'}

                /> :

                <Form.Control
                    id={id}
                    {...field} {...props}
                    as={type === 'textarea' ? "textarea" : 'input'} rows={5}
                    type={isPassword ? 'password' : (type || 'text')}
                    className={(touched[field.name] || submitCount > 0) && errors[field.name] ? "error-input" : 'mb-4'}
                />

            }

            {(touched[field.name] || submitCount > 0) && errors[field.name] && (
                <Form.Text className="text-danger">{errors[field.name]}</Form.Text>
            )}
        </Form.Group>
    );
};
export default FormikCustomTextField;
