// I'm not a big fan of relative paths
// it will works for now, but not for a real project

import SignUpModal from '../components/auth/SignUpModal';
import SignInModal from '../components/auth/SignInModal';
import NavBar from '../components/navbar/NavBar';
import { useEffect, useState } from 'react';
import { User } from '../models/user';
import { getCurrentLoggedInUser } from '../api/auth_apis';
import NotesPage from '../pages/note/NotesPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import PrivacyPage from '../pages/privacy/PrivacyPage';
import NotFoundPage from '../pages/not_found/NotFound';
import styles from '../styles/App.module.css'

function App() {

  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [showSignInModal, setShowSignInModal] = useState(false)

  // Not the best way to do it but it works for toy projects
  useEffect(() => {
    async function fetchCurrentAuthenticatedUser() {
      try {
        const user = await getCurrentLoggedInUser()
        setCurrentUser(user)
      } catch (error) {
        console.error(error)
      }
    }
    fetchCurrentAuthenticatedUser()
  }, [])

  return (
    <BrowserRouter >
      <div>
        <NavBar loggedInUser={currentUser}
          onSignInClicked={() => setShowSignInModal(true)}
          onSignUpClicked={() => setShowSignUpModal(true)}
          onLogoutSuccessful={() => setCurrentUser(null)} />

        <Container className={styles.pageContainer}>
          <Routes>
            <Route path='/'
              element={
                <NotesPage currentUser={currentUser} />
              }
            />
            <Route path='/privacy'
              element={
                <PrivacyPage />
              }
            />
            <Route
              path='/*'
              element={<NotFoundPage />}
            />
          </Routes>
        </Container>

        {showSignUpModal &&
          <SignUpModal
            onDismiss={() => setShowSignUpModal(false)}
            onSignUpSuccessful={(user) => {
              setCurrentUser(user)
              setShowSignUpModal(false)
            }} />
        }
        {showSignInModal &&
          <SignInModal
            onDismiss={() => setShowSignInModal(false)}
            onSignInSuccessful={(user) => {
              setCurrentUser(user)
              setShowSignInModal(false)
            }} />
        }
      </div>
    </BrowserRouter>
  );
}

export default App;
