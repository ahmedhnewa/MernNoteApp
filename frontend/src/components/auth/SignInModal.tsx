import { useForm } from "react-hook-form";
import { SignInInput, User } from "../../models/user";
import { signIn } from '../../api/auth_apis';
import { Alert, Button, Form, Modal } from "react-bootstrap";
import TextInputField from "../form/TextInputField";

import styleUtils from '../../styles/utils.module.css'
import { useState } from "react";
import { HttpError } from "../../core/errors/http.errors";
import { validateSignInInput } from "../../utils/validators/auth";

interface SignInModalProps {
    onDismiss: () => void,
    onSignInSuccessful: (user: User) => void,
}

const SignInModal = ({ onDismiss, onSignInSuccessful }: SignInModalProps) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInInput>()

    const [errorText, setErrorText] = useState<string | null>(null)

    async function onSubmit(input: SignInInput) {
        try {
            const error = validateSignInInput(input)
            if (error) {
                setErrorText(error)
                return
            }
            const newUser = await signIn(input)
            onSignInSuccessful(newUser)
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
                    Sign In
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
                        Sign In</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default SignInModal;