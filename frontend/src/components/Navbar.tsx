import { Link } from 'react-router';
import { useAuth } from '@/context';

const Navbar = () => {
    const { signedIn, user } = useAuth();

    return (
        <nav style={{
            padding: '15px',
            backgroundColor: '#f0f0f0',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <ul style={{
                listStyle: 'none',
                display: 'flex',
                gap: '20px',
                margin: 0,
                padding: 0
            }}>
                <li><Link to="/">Home</Link></li>
                {signedIn && <li><Link to="/dashboard">Dashboard</Link></li>}
                <li><Link to="/about">About</Link></li>
            </ul>
            <ul style={{
                listStyle: 'none',
                display: 'flex',
                gap: '20px',
                margin: 0,
                padding: 0,
                alignItems: 'center'
            }}>
                {signedIn && user ? (
                    <>
                        <li style={{ marginRight: '10px' }}>
                            Hello, {user.name}!
                        </li>
                        <li><Link to="/profile">Profile</Link></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;