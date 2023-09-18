import { Container } from "react-bootstrap";
import NotesPageLoggedInView from "./NotesPageLoggedInView";
import NotesPageLoggedOutView from "./NotesPageLoggedOutView";
import styles from './styles/NotePage.module.css'
import { User } from "../../models/user";

interface NotesPageProps {
    currentUser: User | null
}

const NotesPage = ({ currentUser }: NotesPageProps) => {
    return (
        <Container className={styles.notesPage}>
            <>
                {currentUser ?
                    <NotesPageLoggedInView /> :
                    <NotesPageLoggedOutView />
                }
            </>
        </Container>
    );
}

export default NotesPage;