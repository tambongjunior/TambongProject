import { useState, useEffect } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, Home } from 'lucide-react';

const MyListings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMyListings = async () => {
            try {
                setError('');
                const { data } = await api.get('/properties/mine');
                setListings(data);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to load your listings');
                console.error('Error fetching my listings:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyListings();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this listing?')) {
            try {
                setError('');
                await api.delete(`/properties/${id}`);
                setListings(listings.filter(l => l._id !== id));
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to delete listing');
            }
        }
    };

    return (
        <div style={{ paddingTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>My Property Portfolio</h1>
                <Link to="/create-listing" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                    <Plus size={20} /> Create New Listing
                </Link>
            </div>

            {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                    {error}
                </div>
            )}

            {loading ? (
                <p>Loading your listings...</p>
            ) : listings.length === 0 ? (
                <div className="glass" style={{ textAlign: 'center', padding: '4rem' }}>
                    <Home size={48} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
                    <h3>No listings yet</h3>
                    <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Start by adding your first property.</p>
                    <Link to="/create-listing" className="btn-primary" style={{ textDecoration: 'none' }}>Add Property</Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {listings.map(item => (
                        <div key={item._id} className="card glass">
                            <img 
                                src={item.imageUrls[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'} 
                                alt={item.title} 
                                style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                            />
                            <div style={{ padding: '1rem' }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{item.title}</h3>
                                <p style={{ color: '#6b21a8', fontWeight: '600', marginBottom: '1rem' }}>{item.price.toLocaleString()} FCFA</p>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Link to={`/edit-listing/${item._id}`} className="glass" style={{ flex: 1, textAlign: 'center', padding: '0.5rem', color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                                        <Edit size={16} /> Edit
                                    </Link>
                                    <button onClick={() => handleDelete(item._id)} className="glass" style={{ flex: 1, padding: '0.5rem', color: '#ef4444', border: '1px solid #ef444444', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyListings;
