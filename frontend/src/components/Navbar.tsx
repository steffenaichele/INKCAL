import { Link } from 'react-router';
import { useAuth } from '@/context';
import './Navbar.scss';

const Navbar = () => {
    const { signedIn, user } = useAuth();

    return (
        <nav className="navbar">
            <ul className="navbar__list">
                {!signedIn && (
                    <li className="navbar__item">
                        <Link to="/" className="navbar__link">Home</Link>
                    </li>
                )}
                {signedIn && (
                    <li className="navbar__item">
                        <Link to="/dashboard" className="navbar__link">Dashboard</Link>
                    </li>
                )}
                <li className="navbar__item">
                    <Link to="/about" className="navbar__link">About</Link>
                </li>
            </ul>
            <ul className="navbar__list">
                {signedIn && user ? (
                    <>
                        <li className="navbar__user-greeting">
                            Hello, {user.name}!
                        </li>
                        <li className="navbar__item">
                            <Link to="/profile" className="navbar__link">Profile</Link>
                        </li>
                    </>
                ) : (
                    <>
                        <li className="navbar__item">
                            <Link to="/login" className="navbar__link">Login</Link>
                        </li>
                        <li className="navbar__item">
                            <Link to="/register" className="navbar__link">Register</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;