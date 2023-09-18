import { Button, Navbar } from "react-bootstrap";
import { signOut } from "../../api/auth_apis";
import { User } from "../../models/user";

interface NavBarLoggedInViewProps {
    user: User,
    onLogoutSuccessful: () => void,
}

const NavBarLoggedInView = ({ user, onLogoutSuccessful }: NavBarLoggedInViewProps) => {

    async function logout() {
        try {
            await signOut()
            onLogoutSuccessful()
        } catch (error) {
            console.error(error)
            alert(error)
        }
    }
    return (
        <>
            <Navbar.Text className="me-2">
                Signed in as: {user.username}
            </Navbar.Text>
            <Button onClick={logout}>Log out</Button>
        </>
    );
}

export default NavBarLoggedInView;