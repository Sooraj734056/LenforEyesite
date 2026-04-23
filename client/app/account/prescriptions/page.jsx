'use client';
import { useState, useRef } from 'react';
import useAuthStore from '@/store/authStore';
import Link from 'next/link';
import { resolveMediaUrl } from '@/lib/media';
import toast from 'react-hot-toast';

export default function PrescriptionsPage() {
  const { user } = useAuthStore();
  const [prescriptions, setPrescriptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    label: '',
    doctorName: '',
    date: '',
    notes: '',
  });
  const fileInputRef = useRef();

  const handleFileSelect = (file) => {
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      toast.error('Only JPG, PNG, WEBP, or PDF files are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB.');
      return;
    }
    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreview('pdf');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a prescription file first.');
      return;
    }
    if (!form.label.trim()) {
      toast.error('Please enter a label for this prescription.');
      return;
    }

    setUploading(true);
    try {
      // Simulate save – store in localStorage for now
      const newPrescription = {
        id: Date.now(),
        label: form.label,
        doctorName: form.doctorName,
        date: form.date,
        notes: form.notes,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        preview: preview,
        uploadedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      };

      await new Promise(r => setTimeout(r, 800)); // simulate API delay

      setPrescriptions(prev => [newPrescription, ...prev]);
      toast.success('Prescription uploaded successfully!');
      handleCloseModal();
    } catch (err) {
      toast.error('Failed to upload. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFile(null);
    setPreview(null);
    setForm({ label: '', doctorName: '', date: '', notes: '' });
  };

  const handleDelete = (id) => {
    setPrescriptions(prev => prev.filter(p => p.id !== id));
    toast.success('Prescription removed.');
  };

  return (
    <div className="container section">
      {/* Header */}
      <div className="flex-between" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="section-title">My Prescriptions</h1>
          <p className="section-subtitle">Manage and view your eyewear prescriptions</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          ➕ Upload Prescription
        </button>
      </div>

      {/* Prescriptions List or Empty State */}
      {prescriptions.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📋</div>
          <h3>No Prescriptions Found</h3>
          <p style={{ maxWidth: '400px', margin: '8px auto 24px' }}>
            You haven't added any prescriptions yet. Upload your prescription to easily order glasses online.
          </p>
          <div className="flex-center" style={{ gap: '16px' }}>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>Upload Now</button>
            <Link href="/contact#appointment" className="btn btn-outline">Book Eye Test</Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-3">
          {prescriptions.map(p => (
            <div key={p.id} className="card" style={{ padding: '24px' }}>
              {p.preview && p.preview !== 'pdf' ? (
                <img src={resolveMediaUrl(p.preview)} alt={p.label} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }} />
              ) : (
                <div style={{ width: '100%', height: '160px', background: 'var(--off-white)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', fontSize: '3rem' }}>📄</div>
              )}
              <h4 style={{ marginBottom: '4px' }}>{p.label}</h4>
              {p.doctorName && <p className="text-sm text-muted">Dr. {p.doctorName}</p>}
              {p.date && <p className="text-xs text-muted">Date: {p.date}</p>}
              <p className="text-xs text-muted" style={{ marginTop: '4px' }}>Uploaded: {p.uploadedAt}</p>
              {p.notes && <p className="text-sm" style={{ marginTop: '8px', fontStyle: 'italic', color: 'var(--gray)' }}>{p.notes}</p>}
              <div className="flex-between" style={{ marginTop: '16px' }}>
                <button className="btn btn-outline btn-sm">View</button>
                <button className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--error)' }} onClick={() => handleDelete(p.id)}>Delete</button>
              </div>
            </div>
          ))}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px dashed var(--border)', background: 'var(--off-white)' }} onClick={() => setShowModal(true)}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>➕</div>
            <p className="fw-600">Add New Prescription</p>
          </div>
        </div>
      )}

      {/* Info Cards */}
      <div style={{ marginTop: '48px' }}>
        <h4>Why save your prescription?</h4>
        <div className="grid grid-3" style={{ marginTop: '24px' }}>
          {[
            { icon: '🚀', title: 'Faster Checkout', desc: 'No need to enter details every time you buy.' },
            { icon: '📅', title: 'Track History', desc: 'Monitor how your vision changes over time.' },
            { icon: '🛡️', title: 'Expert Review', desc: 'Our optometrists verify details for 100% accuracy.' }
          ].map(feat => (
            <div key={feat.title} className="card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '12px' }}>{feat.icon}</div>
              <h5 style={{ marginBottom: '8px' }}>{feat.title}</h5>
              <p className="text-sm">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && handleCloseModal()}>
          <div className="animate-scale-in" style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '560px', padding: '40px', margin: '16px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex-between" style={{ marginBottom: '28px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Upload Prescription</h2>
                <p className="text-sm text-muted">Accepted: JPG, PNG, WEBP, PDF (max 5MB)</p>
              </div>
              <button onClick={handleCloseModal} style={{ fontSize: '1.5rem', padding: '4px 12px', borderRadius: '50%', background: 'var(--off-white)', border: 'none', cursor: 'pointer', fontWeight: 700, color: 'var(--gray)' }}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Drag & Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${dragOver ? 'var(--primary)' : selectedFile ? 'var(--success)' : 'var(--border)'}`,
                  borderRadius: '16px',
                  padding: '40px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: dragOver ? 'var(--primary-glow)' : selectedFile ? 'rgba(16,185,129,0.06)' : 'var(--off-white)',
                  transition: 'all 0.25s ease',
                  marginBottom: '24px',
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*,application/pdf"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                />
                {selectedFile ? (
                  <>
                    {preview && preview !== 'pdf' && (
                      <img src={preview} alt="preview" style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }} />
                    )}
                    {preview === 'pdf' && <div style={{ fontSize: '3rem', marginBottom: '8px' }}>📄</div>}
                    <p className="fw-600" style={{ color: 'var(--success)' }}>✅ {selectedFile.name}</p>
                    <p className="text-xs text-muted">Click to change file</p>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>☁️</div>
                    <p className="fw-600">Drag & Drop or Click to Upload</p>
                    <p className="text-sm text-muted" style={{ marginTop: '4px' }}>JPG, PNG, PDF supported</p>
                  </>
                )}
              </div>

              {/* Form Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Label / Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. My Current Prescription – May 2025"
                    value={form.label}
                    onChange={(e) => setForm(f => ({ ...f, label: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid grid-2" style={{ gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Doctor's Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Dr. Sharma"
                      value={form.doctorName}
                      onChange={(e) => setForm(f => ({ ...f, doctorName: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Prescription Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={form.date}
                      onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Notes (Optional)</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Any additional notes about the prescription..."
                    value={form.notes}
                    onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
                    style={{ minHeight: '80px' }}
                  />
                </div>

                <div className="flex-between" style={{ marginTop: '8px', gap: '12px' }}>
                  <button type="button" className="btn btn-outline" onClick={handleCloseModal} style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={uploading} style={{ flex: 2 }}>
                    {uploading ? '⏳ Uploading...' : '📤 Save Prescription'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
