import { Outlet } from 'react-router';
import Navbar from './Navbar';
import './Layout.scss';

const Layout = () => {
    return (
        <div className="root">
            <div className="layout">
                <Navbar />
                <main className="layout__main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout; 