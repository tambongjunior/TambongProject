import { useState, useEffect, useContext } from 'react';
import api from '../Api/api';
import { AuthContext } from '../Context/AuthContext';
import { User, Save } from 'lucide-react';

const Profile = () => {
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({ 
        username: '', 
        phone: '', 
        avatar: '', 
        oldPassword: '', 
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/users/profile');
                setFormData(prev => ({ ...prev, username: data.username, phone: data.phone || '', avatar: data.avatar || '' }));
            } catch (err) {
                console.error('Error fetching profile:', err);
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password && formData.password !== formData.confirmPassword) {
            return setError('New passwords do not match');
        }
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const { data } = await api.put('/users/profile', formData);
            login(data);
            setSuccess('Profile updated successfully!');
            setFormData(prev => ({ ...prev, oldPassword: '', password: '', confirmPassword: '' }));
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ paddingTop: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <div className="glass" style={{ padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#1e293b', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid #6b21a8', overflow: 'hidden' }}>
                            {formData.avatar ? (
                                <img src={formData.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <User size={48} className="text-primary" />
                            )}
                        </div>
                    </div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginTop: '1rem' }}>Account Settings</h2>
                    <p style={{ color: '#94a3b8' }}>Manage your profile and security</p>
                </div>

                {error && <div style={{ background: '#ef444422', color: '#ef4444', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid #ef444444' }}>{error}</div>}
                {success && <div style={{ background: '#6b21a822', color: '#6b21a8', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid #6b21a844' }}>{success}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Username</label>
                            <input 
                                type="text" 
                                className="input-field" 
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Phone Number</label>
                            <input 
                                type="text" 
                                className="input-field" 
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Avatar URL</label>
                        <input 
                            type="text" 
                            className="input-field" 
                            placeholder="https://example.com/avatar.jpg"
                            value={formData.avatar}
                            onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                        />
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '0.5rem 0' }} />

                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Change Password</h3>
                    
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Current Password</label>
                        <input 
                            type="password" 
                            className="input-field" 
                            value={formData.oldPassword}
                            onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>New Password</label>
                            <input 
                                type="password" 
                                className="input-field" 
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Confirm New Password</label>
                            <input 
                                type="password" 
                                className="input-field" 
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                        <Save size={18} /> {loading ? 'Saving...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
