import { Button } from "react-bootstrap";

interface NavBarLoggedOutViewProps {
    onSignUpClicked: () => void,
    onSignInClicked: () => void,
}

const NavBarLoggedOutView = ({ onSignUpClicked, onSignInClicked }: NavBarLoggedOutViewProps) => {
    return ( 
        <>
        <Button onClick={onSignUpClicked}>Sign Up</Button>
        <Button onClick={onSignInClicked}>Sign In</Button>
        </>
     );
}

export default NavBarLoggedOutView;