import { Button, Form, Modal } from "react-bootstrap"
import { Note, NoteInput } from "../../models/note"
import { useForm } from "react-hook-form"
import * as NotesApi from '../../api/notes_apis'
import TextInputField from "../../components/form/TextInputField"

interface AddEditNoteDialogProps {
    onDismiss: () => void,
    onSaved: (note: Note) => void,
    noteToEdit?: Note,
}

function AddEditNoteDialog({ onDismiss, onSaved, noteToEdit }: AddEditNoteDialogProps) {

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<NoteInput>({
        defaultValues: {
            title: noteToEdit?.title || '',
            text: noteToEdit?.text || ''
        }
    })

    async function onSubmit(input: NoteInput) {
        try {
            let noteResponse: Note
            if (noteToEdit) {
                noteResponse = await NotesApi.updateNote(noteToEdit._id, input)
            } else {
                noteResponse = await NotesApi.createNote(input)
            }

            onSaved(noteResponse)
        } catch (error) {
            console.error(error)
            alert(error)
        }
    }

    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {noteToEdit ? 'Edit note' : 'Add note'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id="saveNoteForm" onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name="title"
                        label="Title"
                        placeholder="Enter the title"
                        type="text"
                        register={register}
                        registerOptions={{ required: 'The title field is required.', }}
                        error={errors.title?.message}
                    />
                    <TextInputField
                        name="text"
                        label="Text"
                        placeholder="Enter the text"
                        type="text"
                        as="textarea"
                        rows={5}
                        register={register}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button type="submit" form="saveNoteForm"
                    disabled={isSubmitting}>Save</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddEditNoteDialog