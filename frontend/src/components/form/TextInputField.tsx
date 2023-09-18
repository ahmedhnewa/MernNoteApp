import { Form } from "react-bootstrap";
import { RegisterOptions, UseFormRegister } from "react-hook-form";

interface TextInputFieldProps {
    name: string,
    label: string,
    placeholder: string,
    register: UseFormRegister<any>,
    registerOptions?: RegisterOptions,
    error?: string,
    [x: string]: any,
}

const TextInputField = ({ name, label, placeholder, register, registerOptions, error, ...props }: TextInputFieldProps) => {
    return (
        <Form.Group className="mb-3" controlId={name + 'Input'}>
            <Form.Label htmlFor={name + 'Input'}>{label}</Form.Label>
            <Form.Control
                id={name + 'Input'}
                {...props}
                placeholder={placeholder}
                {...register(name, registerOptions)}
                isInvalid={!!error}
            />
            <Form.Control.Feedback type="invalid">
                {error}
            </Form.Control.Feedback>
        </Form.Group>
    );
}

export default TextInputField;
