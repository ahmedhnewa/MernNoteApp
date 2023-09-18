import { useForm } from "react-hook-form";
import { SignUpInput, User } from "../../models/user";
import { signUp } from '../../api/auth_apis';
import { Alert, Button, Form, Modal } from "react-bootstrap";
import TextInputField from "../form/TextInputField";

import styleUtils from '../../styles/utils.module.css'
import { useState } from "react";
import { HttpError } from "../../core/errors/http.errors";
import { validateSignUpInput } from "../../utils/validators/auth";

interface SignUpModalProps {
    onDismiss: () => void,
    onSignUpSuccessful: (user: User) => void,
}

const SignUpModal = ({ onDismiss, onSignUpSuccessful }: SignUpModalProps) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpInput>()

    const [errorText, setErrorText] = useState<string | null>(null)

    async function onSubmit(input: SignUpInput) {
        try {
            const error = validateSignUpInput(input)
            if (error) {
                setErrorText(error)
                return
            }
            const newUser = await signUp(input)
            onSignUpSuccessful(newUser)
        } catch (error) {
            console.error(error)
            if (error instanceof HttpError) {
                setErrorText(error.message)
                return
            }
            alert(error)
        }
    }
    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Sign Up
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            { errorText &&
                <Alert variant="danger">
                    {errorText}
                </Alert>
                }
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name="username"
                        label="Username"
                        placeholder="Enter a username"
                        type="text"
                        register={register}
                        registerOptions={{ required: 'Please enter a username.' }}
                        error={errors.username?.message} />
                    <TextInputField
                        name="email"
                        label="Email"
                        placeholder="Enter a email address"
                        type="email"
                        register={register}
                        registerOptions={{
                            required: 'Please enter a email address.', pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Please enter valid emaill address.'
                            }
                        }}
                        error={errors.email?.message} />
                    <TextInputField
                        name="password"
                        label="Password"
                        placeholder="Enter a password"
                        type="password"
                        register={register}
                        registerOptions={{ required: 'Please enter a password.' }}
                        error={errors.password?.message} />
                    <Button
                        className={styleUtils.width100}
                        disabled={isSubmitting} type="submit">
                        Sign Up</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default SignUpModal;