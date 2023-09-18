import { useEffect, useState } from 'react';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { FaPlus } from "react-icons/fa";
import * as NotesApi from '../../api/notes_apis';
import AddEditNoteDialog from './AddEditNoteDialog';
import { Note as NoteModel } from '../../models/note';
import styles from './/styles/NotePage.module.css';
import styleUtils from '../../styles/utils.module.css';
import NoteCard from './NoteCard';

const NotesPageLoggedInView = () => {
    const [notes, setNotes] = useState<NoteModel[]>([])
    const [isNotesLoading, setIsNotesLoading] = useState(true)
    const [notesLoadingError, setNotesLoadingError] = useState<string | null>()

    const [showAddNoteDialog, setShowAddNoteDialog] = useState(false)
    const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null)

    useEffect(() => {
        async function loadNotes() {
            try {
                setNotesLoadingError(null)
                setIsNotesLoading(true)
                const notes = await NotesApi.fetchNotes()
                setNotes(notes)
            } catch (error) {
                console.error(error)
                setNotesLoadingError(error as string)
            } finally {
                setIsNotesLoading(false)
            }
        }
        loadNotes()
    }, [])

    async function deleteNote(note: NoteModel) {
        try {
            await NotesApi.deleteNote(note._id)
            setNotes(notes.filter(currentNote => currentNote._id !== note._id))
        } catch (error) {
            console.error(error)
            alert(error)
        }
    }

    const notesGrid = <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
        {notes.map(note => (
            <Col key={note._id}>
                <NoteCard note={note}
                    className={styles.note}
                    onNoteClicked={setNoteToEdit}
                    onDeleteNote={deleteNote} />
            </Col>
        ))}
    </Row>

    return (
        <>
            <Button onClick={() => setShowAddNoteDialog(true)}
                className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}>
                <FaPlus />
                Add new note
            </Button>
            {isNotesLoading && <Spinner animation='border' variant='primary' />}
            {notesLoadingError && <p>{notesLoadingError.toString()}</p>}
            {!isNotesLoading && !notesLoadingError &&
                <>
                    {notes.length > 0
                        ? notesGrid : <p>You don't have any notes yet, try to add some</p>
                    }
                </>
            }
            {showAddNoteDialog &&
                <AddEditNoteDialog
                    onDismiss={() => setShowAddNoteDialog(false)}
                    onSaved={(note) => {
                        setNotes([...notes, note])
                        setShowAddNoteDialog(false)
                    }} />
            }
            {noteToEdit &&
                <AddEditNoteDialog
                    noteToEdit={noteToEdit}
                    onDismiss={() => setNoteToEdit(null)}
                    onSaved={(updatedNote) => {
                        setNotes(notes.map(currentNote => currentNote._id === updatedNote._id ? updatedNote : currentNote))
                        setNoteToEdit(null)
                    }}
                />
            }
        </>
    );
}

export default NotesPageLoggedInView;