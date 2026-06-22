import { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Home, User, PlusCircle, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navStyle = ({ isActive }) => ({
        color: isActive ? '#6b21a8' : '#cbd5e1',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        fontWeight: isActive ? '600' : '400',
        padding: '0.5rem 0.75rem',
        borderRadius: '0.5rem',
        background: isActive ? 'rgba(107, 33, 168, 0.1)' : 'transparent',
        transition: 'all 0.3s ease'
    });

    return (
        <nav className="glass" style={{ margin: '1rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '1rem', zIndex: 100 }}>
            <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Home className="text-primary" />
                Prop<span style={{ color: '#6b21a8' }}>Space</span>
            </Link>
            
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <NavLink to="/" style={navStyle}>Feed</NavLink>
                {user ? (
                    <>
                        <NavLink to="/my-listings" style={navStyle}>My Listings</NavLink>
                        <NavLink to="/create-listing" style={navStyle}>
                            <PlusCircle size={18} /> Add Property
                        </NavLink>
                        <NavLink to="/profile" style={navStyle}>
                            <User size={18} /> {user.username}
                        </NavLink>
                        <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', transition: 'background 0.3s' }} onMouseOver={(e) => e.currentTarget.style.background='rgba(239, 68, 68, 0.1)'} onMouseOut={(e) => e.currentTarget.style.background='none'}>
                            <LogOut size={18} /> Logout
                        </button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login" style={navStyle}>Login</NavLink>
                        <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', marginLeft: '0.5rem' }}>Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
