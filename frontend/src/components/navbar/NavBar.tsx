import { Container, Nav, Navbar } from "react-bootstrap";
import { User } from "../../models/user";
import NavBarLoggedInView from "./NavBarLoggedInView";
import NavBarLoggedOutView from "./NavBarLoggedOutView";
import { Link } from 'react-router-dom'

interface NavBarProps {
    loggedInUser: User | null,
    onSignUpClicked: () => void,
    onSignInClicked: () => void,
    onLogoutSuccessful: () => void,
}

const NavBar = ({ loggedInUser, onSignUpClicked, onSignInClicked, onLogoutSuccessful }: NavBarProps) => {
    return (
        <Navbar bg="primary" variant="dark"
            expand="sm" sticky="top">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    My notes app
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="mainNavBar" />
                <Navbar.Collapse id="mainNavBar">
                    <Nav>
                        <Nav.Link as={Link} to="/privacy">
                            Privacy
                        </Nav.Link>
                    </Nav>
                    <Nav className="ms-auto">
                        {loggedInUser
                            ? <NavBarLoggedInView user={loggedInUser}
                                onLogoutSuccessful={onLogoutSuccessful} />
                            : <NavBarLoggedOutView
                                onSignInClicked={onSignInClicked}
                                onSignUpClicked={onSignUpClicked}
                            />
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;