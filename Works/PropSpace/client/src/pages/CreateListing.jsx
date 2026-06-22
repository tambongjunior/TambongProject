import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';
import { Save, ArrowLeft, X, ImagePlus, Loader } from 'lucide-react';

const CreateListing = ({ isEdit = false }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [dragActive, setDragActive] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        city: '',
        country: '',
        propertyType: 'Apartment',
        imageUrls: []
    });
    // Local preview files (not yet uploaded)
    const [pendingFiles, setPendingFiles] = useState([]);
    const [imageUrlInput, setImageUrlInput] = useState('');

    useEffect(() => {
        if (isEdit && id) {
            const fetchProperty = async () => {
                try {
                    const { data } = await api.get(`/properties/detail/${id}`);
                    setFormData({
                        title: data.title,
                        description: data.description,
                        price: data.price,
                        city: data.location.city,
                        country: data.location.country,
                        propertyType: data.propertyType,
                        imageUrls: data.imageUrls || []
                    });
                } catch (error) {
                    console.error('Error fetching property:', error);
                    navigate('/my-listings');
                } finally {
                    setFetching(false);
                }
            };
            fetchProperty();
        }
    }, [isEdit, id, navigate]);

    // Generate previews for pending files
    const previews = useMemo(() => pendingFiles.map(file => URL.createObjectURL(file)), [pendingFiles]);

    const totalImages = formData.imageUrls.length + pendingFiles.length;

    const addFiles = (files) => {
        const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
        const remaining = 6 - totalImages;
        if (remaining <= 0) {
            setErrorMsg('Maximum 6 images allowed');
            return;
        }
        const toAdd = imageFiles.slice(0, remaining);
        setPendingFiles(prev => [...prev, ...toAdd]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files.length) {
            addFiles(e.dataTransfer.files);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragActive(false);
    };

    const handleFileSelect = (e) => {
        if (e.target.files.length) {
            addFiles(e.target.files);
        }
        e.target.value = '';
    };

    const handleAddImageUrl = () => {
        if (!imageUrlInput.trim()) return;
        if (totalImages >= 6) {
            setErrorMsg('Maximum 6 images allowed');
            return;
        }
        setFormData(prev => ({
            ...prev,
            imageUrls: [...prev.imageUrls, imageUrlInput.trim()]
        }));
        setImageUrlInput('');
    };

    const removeExistingImage = (index) => {
        setFormData(prev => ({
            ...prev,
            imageUrls: prev.imageUrls.filter((_, i) => i !== index)
        }));
    };

    const removePendingFile = (index) => {
        setPendingFiles(prev => prev.filter((_, i) => i !== index));
    };

    const uploadFiles = async () => {
        if (pendingFiles.length === 0) return [];
        setUploading(true);
        try {
            const formPayload = new FormData();
            pendingFiles.forEach(file => formPayload.append('images', file));
            const { data } = await api.post('/upload', formPayload);
            return data.urls;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Image upload failed', { cause: error });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg(''); // Reset error
        
        // Frontend Validation
        if (!formData.title.trim()) return setErrorMsg('Title is required.');
        if (!formData.description.trim()) return setErrorMsg('Description is required.');
        if (Number(formData.price) <= 0) return setErrorMsg('Price must be greater than zero.');
        if (!formData.city.trim()) return setErrorMsg('City is required.');
        if (!formData.country.trim()) return setErrorMsg('Country is required.');
        const validTypes = ['Apartment', 'House', 'Studio'];
        if (!validTypes.includes(formData.propertyType)) return setErrorMsg('Invalid property type.');

        setLoading(true);
        try {
            // Upload pending files first
            const newUrls = await uploadFiles();
            const allImageUrls = [...formData.imageUrls, ...newUrls];

            const payload = { ...formData, imageUrls: allImageUrls };

            if (isEdit) {
                await api.put(`/properties/${id}`, payload);
            } else {
                await api.post('/properties', payload);
            }
            navigate('/my-listings');
        } catch (error) {
            setErrorMsg(error.response?.data?.message || error.message || 'Failed to save listing');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="container" style={{ paddingTop: '5rem' }}>Loading property details...</div>;

    return (
        <div style={{ paddingTop: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1.5rem' }}>
                <ArrowLeft size={18} /> Back
            </button>

            <div className="glass" style={{ padding: '2.5rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
                    {isEdit ? 'Edit Property Listing' : 'Create New Property Listing'}
                </h1>

                {errorMsg && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <X size={18} /> {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Property Title</label>
                        <input 
                            type="text" 
                            className="input-field" 
                            required
                            placeholder="e.g. Modern Luxury Apartment"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Description</label>
                        <textarea 
                            className="input-field" 
                            style={{ minHeight: '120px', resize: 'vertical' }}
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Price (FCFA)</label>
                            <input 
                                type="number" 
                                min="0"
                                className="input-field" 
                                required
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Property Type</label>
                            <select 
                                className="input-field"
                                value={formData.propertyType}
                                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                            >
                                <option value="Apartment">Apartment</option>
                                <option value="House">House</option>
                                <option value="Studio">Studio</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>City</label>
                            <input 
                                type="text" 
                                className="input-field" 
                                required
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Country</label>
                            <input 
                                type="text" 
                                className="input-field" 
                                required
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* ====== IMAGE UPLOAD SECTION ====== */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                            Property Images
                            <span style={{ color: '#94a3b8', marginLeft: '0.5rem' }}>({totalImages}/6)</span>
                        </label>

                        {/* URL Input Section */}
                        {totalImages < 6 && (
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                <input
                                    type="url"
                                    placeholder="Or paste an image URL instead..."
                                    className="input-field"
                                    value={imageUrlInput}
                                    onChange={(e) => setImageUrlInput(e.target.value)}
                                    style={{ flex: 1 }}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddImageUrl(); } }}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddImageUrl}
                                    className="btn-primary"
                                    style={{ whiteSpace: 'nowrap', padding: '0.75rem 1.5rem' }}
                                >
                                    Add URL
                                </button>
                            </div>
                        )}

                        {/* Drop Zone */}
                        {totalImages < 6 && (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                style={{
                                    border: `2px dashed ${dragActive ? '#6b21a8' : '#334155'}`,
                                    borderRadius: '0.75rem',
                                    padding: '2.5rem 1.5rem',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.25s ease',
                                    background: dragActive ? 'rgba(107, 33, 168, 0.05)' : 'rgba(255,255,255,0.02)',
                                    marginBottom: '1rem'
                                }}
                            >
                                <ImagePlus size={36} style={{ color: dragActive ? '#6b21a8' : '#64748b', marginBottom: '0.75rem' }} />
                                <p style={{ fontWeight: '600', marginBottom: '0.25rem', color: dragActive ? '#6b21a8' : '#e2e8f0' }}>
                                    {dragActive ? 'Drop images here' : 'Drag & drop images here'}
                                </p>
                                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                    or click to browse · JPEG, PNG, GIF, WebP · max 5MB each
                                </p>
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />

                        {/* Thumbnail Grid */}
                        {(formData.imageUrls.length > 0 || previews.length > 0) && (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                gap: '0.75rem'
                            }}>
                                {/* Existing (already uploaded) images */}
                                {formData.imageUrls.map((url, i) => (
                                    <div key={`existing-${i}`} style={{ position: 'relative', borderRadius: '0.5rem', overflow: 'hidden', aspectRatio: '1', border: '1px solid #334155' }}>
                                        <img src={url} alt={`Property ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button
                                            type="button"
                                            onClick={() => removeExistingImage(i)}
                                            style={{
                                                position: 'absolute', top: '4px', right: '4px',
                                                background: 'rgba(239, 68, 68, 0.85)', border: 'none', borderRadius: '50%',
                                                width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                cursor: 'pointer', color: 'white', padding: 0, transition: 'transform 0.15s ease'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
                                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                        >
                                            <X size={14} />
                                        </button>
                                        <span style={{
                                            position: 'absolute', bottom: '4px', left: '4px',
                                            background: 'rgba(107, 33, 168, 0.8)', color: '#fff', fontSize: '0.65rem',
                                            padding: '1px 6px', borderRadius: '4px'
                                        }}>
                                            Saved
                                        </span>
                                    </div>
                                ))}

                                {/* Pending (local preview) images */}
                                {previews.map((url, i) => (
                                    <div key={`pending-${i}`} style={{ position: 'relative', borderRadius: '0.5rem', overflow: 'hidden', aspectRatio: '1', border: '1px solid #334155' }}>
                                        <img src={url} alt={`New ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button
                                            type="button"
                                            onClick={() => removePendingFile(i)}
                                            style={{
                                                position: 'absolute', top: '4px', right: '4px',
                                                background: 'rgba(239, 68, 68, 0.85)', border: 'none', borderRadius: '50%',
                                                width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                cursor: 'pointer', color: 'white', padding: 0, transition: 'transform 0.15s ease'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
                                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                        >
                                            <X size={14} />
                                        </button>
                                        <span style={{
                                            position: 'absolute', bottom: '4px', left: '4px',
                                            background: 'rgba(100,116,139,0.8)', color: '#fff', fontSize: '0.65rem',
                                            padding: '1px 6px', borderRadius: '4px'
                                        }}>
                                            New
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading || uploading} style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                        {(loading || uploading) ? (
                            <>
                                <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                                {uploading ? 'Uploading Images...' : 'Saving Listing...'}
                            </>
                        ) : (
                            <>
                                <Save size={18} /> {isEdit ? 'Update Listing' : 'Create Listing'}
                            </>
                        )}
                    </button>
                </form>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default CreateListing;
