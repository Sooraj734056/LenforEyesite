'use client';
import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { resolveMediaUrl } from '@/lib/media';

export default function VirtualTryOn() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [framePos, setFramePos] = useState({ x: 50, y: 40, scale: 30, rotation: 0 });
  const fileInputRef = useRef();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`)
      .then(r => r.json())
      .then(data => { setProduct(data.product); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setUserPhoto(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div className="flex-center" style={{ minHeight: '60vh' }}><div className="spinner" /></div>;
  if (!product) return <div className="flex-center" style={{ minHeight: '60vh' }}><h2>Product not found</h2></div>;

  const frameImg = resolveMediaUrl(product.variants?.[0]?.images?.[0]) || '/img/placeholder.png';

  return (
    <div className="container section">
      <div className="flex-between" style={{ marginBottom: '32px' }}>
        <div>
          <button onClick={() => router.back()} className="btn btn-sm btn-outline" style={{ marginBottom: '16px' }}>← Back to Product</button>
          <h1 className="section-title">Virtual Try-On</h1>
          <p className="section-subtitle">See how <strong>{product.name}</strong> looks on your face</p>
        </div>
      </div>

      <div className="grid grid-2" style={{ gap: '40px', alignItems: 'start' }}>
        {/* Try-On Canvas */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          aspectRatio: '3/4', 
          background: '#f0f0f0', 
          borderRadius: '24px', 
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {userPhoto ? (
            <>
              <img src={userPhoto} alt="User Face" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {/* Frame Overlay */}
              <img 
                src={frameImg} 
                alt="Frame" 
                style={{ 
                  position: 'absolute', 
                  top: `${framePos.y}%`, 
                  left: `${framePos.x}%`, 
                  width: `${framePos.scale}%`,
                  transform: `translate(-50%, -50%) rotate(${framePos.rotation}deg)`,
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                  cursor: 'move'
                }} 
              />
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>👤</div>
              <h4>Upload a photo to start</h4>
              <p className="text-sm text-muted" style={{ marginBottom: '24px' }}>Use a front-facing photo with good lighting for the best result.</p>
              <button 
                className="btn btn-primary"
                onClick={() => fileInputRef.current.click()}
              >
                📸 Upload My Photo
              </button>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" style={{ display: 'none' }} />
        </div>

        {/* Controls */}
        <div className="card" style={{ padding: '32px' }}>
          <h3>Adjust Fit</h3>
          <p className="text-sm text-muted" style={{ marginBottom: '24px' }}>Fine-tune the position and size of the frame on your face.</p>

          {!userPhoto ? (
            <div style={{ opacity: 0.5, pointerEvents: 'none' }}>
              <p>Please upload a photo first to see controls.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Vertical Position</span>
                  <span>{framePos.y}%</span>
                </label>
                <input type="range" min="10" max="90" value={framePos.y} 
                  onChange={(e) => setFramePos({...framePos, y: e.target.value})} 
                  style={{ width: '100%' }} />
              </div>
              
              <div>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Horizontal Position</span>
                  <span>{framePos.x}%</span>
                </label>
                <input type="range" min="10" max="90" value={framePos.x} 
                  onChange={(e) => setFramePos({...framePos, x: e.target.value})} 
                  style={{ width: '100%' }} />
              </div>

              <div>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Frame Size</span>
                  <span>{framePos.scale}%</span>
                </label>
                <input type="range" min="10" max="80" value={framePos.scale} 
                  onChange={(e) => setFramePos({...framePos, scale: e.target.value})} 
                  style={{ width: '100%' }} />
              </div>

              <div>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Rotation</span>
                  <span>{framePos.rotation}°</span>
                </label>
                <input type="range" min="-45" max="45" value={framePos.rotation} 
                  onChange={(e) => setFramePos({...framePos, rotation: e.target.value})} 
                  style={{ width: '100%' }} />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button className="btn btn-outline" onClick={() => setUserPhoto(null)} style={{ flex: 1 }}>Reset Photo</button>
                <Link href={`/product/${id}`} className="btn btn-primary" style={{ flex: 1, textAlign: 'center' }}>Add to Cart</Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Guide */}
      <div style={{ marginTop: '48px' }}>
        <h4>Pro Tips for Virtual Try-On</h4>
        <div className="grid grid-3" style={{ marginTop: '24px' }}>
          {[
            { icon: '💡', title: 'Good Lighting', desc: 'Ensure your face is evenly lit and not in shadow.' },
            { icon: '📏', title: 'Align Eyes', desc: 'Position the frame so the bridge sits comfortably on your nose.' },
            { icon: '💇', title: 'Clear Face', desc: 'Keep hair away from your face for a better simulation.' }
          ].map(tip => (
            <div key={tip.title} className="card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '12px' }}>{tip.icon}</div>
              <h5 style={{ marginBottom: '8px' }}>{tip.title}</h5>
              <p className="text-sm text-muted">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
