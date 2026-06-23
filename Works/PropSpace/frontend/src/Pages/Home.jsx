import { useState, useEffect } from 'react';
import api from '../Api/api';
import { Search, MapPin, Home as HomeIcon, Sparkles } from 'lucide-react';

const PropertyCard = ({ property }) => (
    <div className="card glass">
        <img 
            src={property.imageUrls[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'} 
            alt={property.title} 
            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
        />
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{property.title}</h3>
                <span style={{ background: 'rgba(107, 33, 168, 0.15)', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem' }}>
                    {property.propertyType}
                </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <MapPin size={16} /> {property.location.city}, {property.location.country}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{property.price.toLocaleString()} FCFA</span>
                <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>by {property.author?.username}</span>
            </div>
        </div>
    </div>
);

const Home = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({ city: '', minPrice: '', maxPrice: '', type: '' });

    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            setError('');
            try {
                const queryParams = new URLSearchParams(filters).toString();
                const { data } = await api.get(`/properties?${queryParams}`);
                setProperties(data);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to connect to properties API');
                console.error('Error fetching properties:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, [filters]);

    return (
        <div style={{ paddingBottom: '4rem' }}>
            {/* Hero Section */}
            <div style={{
                position: 'relative',
                height: '70vh',
                minHeight: '600px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2rem',
                textAlign: 'center',
                overflow: 'hidden',
                marginBottom: '4rem',
                borderBottomLeftRadius: '3rem',
                borderBottomRightRadius: '3rem',
                backgroundImage: 'linear-gradient(to bottom, rgba(9, 9, 11, 0.4), #09090b), url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}>

                <div style={{
                    animation: 'fadeInUp 1s ease-out',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: '1200px'
                }}>
                    <span style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgba(107, 33, 168, 0.15)', 
                        color: 'var(--primary)', 
                        padding: '0.5rem 1.25rem', 
                        borderRadius: '2rem', 
                        fontSize: '0.875rem',
                        fontWeight: 600, 
                        marginBottom: '1.5rem',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(107, 33, 168, 0.3)',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase'
                    }}>
                        <Sparkles size={16} /> Elite Residence Portfolio
                    </span>
                    
                    <h1 style={{ 
                        fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', 
                        fontWeight: '800', 
                        marginBottom: '1.5rem', 
                        maxWidth: '900px',
                        lineHeight: '1.1',
                        color: '#ffffff',
                        textShadow: '0 4px 20px rgba(0,0,0,0.3)'
                    }}>
                        Step Into Your <span style={{ color: 'var(--primary)' }}>Next Chapter</span>
                    </h1>
                    
                    <p style={{ 
                        color: '#cbd5e1', 
                        fontSize: '1.125rem', 
                        marginBottom: '3.5rem', 
                        maxWidth: '650px',
                        lineHeight: '1.6',
                        textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                    }}>
                        Experience unparalleled luxury with our meticulously chosen global estates, premium villas, and upscale condominiums.
                    </p>

                    {/* Search Container */}
                    <div className="glass" style={{ 
                        padding: '1.5rem', 
                        width: '100%', 
                        maxWidth: '1000px',
                        borderRadius: '1.5rem',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <div style={{ position: 'relative' }}>
                                <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Where to?" 
                                    className="input-field" 
                                    style={{ paddingLeft: '3rem', height: '3.5rem' }}
                                    value={filters.city}
                                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                                />
                            </div>
                            <input 
                                type="number"
                                min="0"
                                placeholder="Min Price (FCFA)" 
                                className="input-field" 
                                style={{ height: '3.5rem' }}
                                value={filters.minPrice}
                                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                            />
                            <input 
                                type="number"
                                min="0"
                                placeholder="Max Price (FCFA)" 
                                className="input-field" 
                                style={{ height: '3.5rem' }}
                                value={filters.maxPrice}
                                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                            />
                            <select 
                                className="input-field"
                                style={{ height: '3.5rem', appearance: 'none' }}
                                value={filters.type}
                                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                            >
                                <option value="">All Types</option>
                                <option value="Apartment">Apartment</option>
                                <option value="House">House</option>
                                <option value="Studio">Studio</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                    <div>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>Featured Properties</h2>
                        <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Explore our latest and most popular listings</p>
                    </div>
                </div>

                <style>{`
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes spin { 
                        to { transform: rotate(360deg); } 
                    }
                `}</style>

                {error ? (
                    <div className="glass" style={{ textAlign: 'center', padding: '4rem', borderRadius: '1rem', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#ef4444' }}>Gateway Error</h3>
                        <p style={{ color: '#94a3b8' }}>{error}</p>
                    </div>
                ) : loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <div style={{ 
                            width: '40px', height: '40px', border: '3px solid rgba(107, 33, 168, 0.3)',
                            borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite',
                            margin: '0 auto 1.5rem'
                        }}></div>
                        <p style={{ color: '#94a3b8' }}>Loading amazing properties...</p>
                    </div>
                ) : properties.length === 0 ? (
                    <div className="glass" style={{ textAlign: 'center', padding: '4rem', borderRadius: '1rem' }}>
                        <HomeIcon size={64} style={{ color: '#334155', marginBottom: '1.5rem' }} />
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No properties found</h3>
                        <p style={{ color: '#94a3b8' }}>Try adjusting your search criteria and explore other incredible places.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                        {properties.map(property => (
                            <PropertyCard key={property._id} property={property} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
