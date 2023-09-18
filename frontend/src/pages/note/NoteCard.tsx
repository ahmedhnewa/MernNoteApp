import styles from './/styles/Note.module.css'
import styleUtils from '../../styles/utils.module.css'
import { Card } from "react-bootstrap"
import { Note as NoteModel } from "../../models/note"
import { formateDate } from '../../utils/formateDate'
import { MdDelete } from 'react-icons/md'

interface NoteCardProps {
    note: NoteModel,
    className?: string,
    onDeleteNote: (note: NoteModel) => void,
    onNoteClicked: (note: NoteModel) => void
}
// type MyNote = NoteProps

function NoteCard({ note, onNoteClicked, onDeleteNote, className }: NoteCardProps) {
    const {
        title,
        text,
        createdAt,
        updatedAt
    } = note

    let createdUpdatedText: string = `Created: ${formateDate(createdAt)}`
    if (updatedAt > createdAt) {
        createdUpdatedText = `Updated: ${formateDate(updatedAt)}`
    }

    return (
        <Card
            onClick={() => onNoteClicked(note)}
            className={`${styles.noteCard} ${className}`}>
            <Card.Body className={styles.cardBody}>
                <Card.Title className={styleUtils.flexCenter}>
                    {title}
                    <MdDelete
                        className='text-muted ms-auto'
                        onClick={(e) => {
                            onDeleteNote(note)
                            e.stopPropagation()
                        }}
                    />
                </Card.Title>
                <Card.Text className={styles.cardText}>
                    {text}
                </Card.Text>
            </Card.Body>
            <Card.Footer className='text-muted'>
                {createdUpdatedText}
            </Card.Footer>
        </Card>
    )
}

export default NoteCard