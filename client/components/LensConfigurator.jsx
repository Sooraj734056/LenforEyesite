'use client';
import { useState } from 'react';
import styles from './LensConfigurator.module.css';

const POWER_TYPES = [
  { id: 'Zero Power', label: 'Zero Power', desc: 'No prescription. Fashion or Blue Cut only.', icon: '👓', price: 0 },
  { id: 'Single Vision', label: 'Single Vision', desc: 'For near or far-sightedness (most common)', icon: '🔭', price: 0 },
  { id: 'Bifocal', label: 'Bifocal', desc: 'Two zones: near & distance in one lens', icon: '🔬', price: 500 },
  { id: 'Progressive', label: 'Progressive', desc: 'Seamless multifocal — no visible line', icon: '✨', price: 1000 },
];

const LENS_PACKAGES = [
  { id: 'Basic', label: 'Basic', desc: 'Standard clarity lens', price: 0, icon: '🖼️', features: ['UV Protection', 'Scratch Resistant'] },
  { id: 'Basic Anti-Glare', label: 'Basic Anti-Glare', desc: 'Great for driving & office', price: 499, icon: '✨', features: ['Anti-Glare', 'UV Protection', 'Scratch Resistant'] },
  { id: 'Blue Cut', label: 'Blue Cut', desc: 'Blocks harmful blue light from screens', price: 799, icon: '💻', features: ['Blue Light Block', 'Anti-Glare', 'UV400', 'Digital Eye Strain Relief'], popular: true },
  { id: 'Photochromic', label: 'Photochromic / Transitions', desc: 'Auto-darkens outdoors, clear indoors', price: 1299, icon: '☀️', features: ['Light-Adaptive', 'UV Protection', 'Anti-Glare', '2-in-1 Convenience'] },
];

const POWER_STEPS = {
  sph: ['-6.00', '-5.75', '-5.50', '-5.25', '-5.00', '-4.75', '-4.50', '-4.25', '-4.00', '-3.75', '-3.50', '-3.25', '-3.00', '-2.75', '-2.50', '-2.25', '-2.00', '-1.75', '-1.50', '-1.25', '-1.00', '-0.75', '-0.50', '-0.25', '0.00', '+0.25', '+0.50', '+0.75', '+1.00', '+1.25', '+1.50', '+1.75', '+2.00', '+2.25', '+2.50', '+2.75', '+3.00', '+4.00', '+5.00', '+6.00'],
  cyl: ['0.00', '-0.25', '-0.50', '-0.75', '-1.00', '-1.25', '-1.50', '-1.75', '-2.00', '-2.25', '-2.50', '-2.75', '-3.00'],
  axis: Array.from({ length: 181 }, (_, i) => String(i)),
  add: ['0.00', '+0.75', '+1.00', '+1.25', '+1.50', '+1.75', '+2.00', '+2.25', '+2.50', '+2.75', '+3.00'],
};

export default function LensConfigurator({ product, onComplete, onSkip, onClose }) {
  const [step, setStep] = useState(1);
  const [powerType, setPowerType] = useState(null);
  const [lensPackage, setLensPackage] = useState(null);
  const [rxMethod, setRxMethod] = useState(null); // 'manual' | 'upload' | 'call'
  const [prescription, setPrescription] = useState({
    right: { sph: '0.00', cyl: '0.00', axis: '0', add: '0.00' },
    left: { sph: '0.00', cyl: '0.00', axis: '0', add: '0.00' },
    pd: '64'
  });
  const [uploadedPhoto, setUploadedPhoto] = useState(null);

  const totalLensPrice = (powerType?.price || 0) + (lensPackage?.price || 0);

  const handleRxChange = (eye, field, val) => {
    setPrescription(p => ({ ...p, [eye]: { ...p[eye], [field]: val } }));
  };

  const handleComplete = () => {
    const lensData = {
      powerType: powerType?.id,
      package: lensPackage?.id,
      price: totalLensPrice,
      prescription: rxMethod === 'manual' ? {
        rightEye: prescription.right,
        leftEye: prescription.left,
        pd: prescription.pd
      } : rxMethod === 'upload' ? { uploadedPhoto } : { callForPower: true }
    };
    onComplete(lensData);
  };

  const canProceed = () => {
    if (step === 1) return !!powerType;
    if (step === 2) return !!lensPackage;
    if (step === 3) {
      if (rxMethod === 'manual') return prescription.right.sph && prescription.left.sph;
      return !!rxMethod;
    }
    return false;
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Add Lenses</h2>
            <p className={styles.sub}>For: <strong>{product.name}</strong></p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} id="lens-config-close">✕</button>
        </div>

        {/* Step Indicator */}
        <div className={styles.steps}>
          {['Power Type', 'Lens Package', 'Prescription'].map((s, i) => (
            <div key={s} className={styles.stepItem}>
              <div className={`${styles.stepNum} ${step > i + 1 ? styles.done : step === i + 1 ? styles.active : ''}`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={styles.stepLabel}>{s}</span>
              {i < 2 && <div className={`${styles.stepLine} ${step > i + 1 ? styles.lineDone : ''}`} />}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className={styles.content}>

          {/* Step 1: Power Type */}
          {step === 1 && (
            <div className={styles.options}>
              {POWER_TYPES.map(pt => (
                <button key={pt.id} className={`${styles.option} ${powerType?.id === pt.id ? styles.optionActive : ''}`}
                  onClick={() => setPowerType(pt)} id={`power-${pt.id.toLowerCase().replace(/\s/g, '-')}`}>
                  <span className={styles.optionIcon}>{pt.icon}</span>
                  <div className={styles.optionInfo}>
                    <div className={styles.optionName}>{pt.label}</div>
                    <div className={styles.optionDesc}>{pt.desc}</div>
                  </div>
                  {pt.price > 0 && <span className={styles.optionPrice}>+₹{pt.price}</span>}
                  {pt.price === 0 && <span className={styles.optionFree}>Included</span>}
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Lens Package */}
          {step === 2 && (
            <div className={styles.packages}>
              {LENS_PACKAGES.map(pkg => (
                <button key={pkg.id} className={`${styles.package} ${lensPackage?.id === pkg.id ? styles.packageActive : ''}`}
                  onClick={() => setLensPackage(pkg)} id={`package-${pkg.id.toLowerCase().replace(/\s/g, '-')}`}>
                  {pkg.popular && <span className={styles.popularBadge}>Most Popular</span>}
                  <div className={styles.pkgVisual}>{pkg.icon}</div>
                  <div className={styles.pkgHeader}>
                    <div className={styles.pkgName}>{pkg.label}</div>
                    <div className={styles.pkgPrice}>{pkg.price === 0 ? 'Free' : `+₹${pkg.price}`}</div>
                  </div>
                  <p className={styles.pkgDesc}>{pkg.desc}</p>
                  <div className={styles.pkgFeatures}>
                    {pkg.features.map(f => <span key={f} className={styles.pkgFeature}>✓ {f}</span>)}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 3: Prescription */}
          {step === 3 && (
            <div className={styles.rxSection}>
              {powerType?.id === 'Zero Power' ? (
                <div className={styles.zeroPowerNote}>
                  ✅ No prescription needed for Zero Power lenses. You're all set!
                </div>
              ) : (
                <>
                  <div className={styles.rxMethods}>
                    {[
                      { id: 'manual', icon: '✏️', label: 'Enter Manually', desc: 'Type in your power values' },
                      { id: 'upload', icon: '📷', label: 'Upload Prescription', desc: 'Photo of your prescription card' },
                      { id: 'call', icon: '📞', label: 'Call Me for Power', desc: 'Our team will call you' },
                    ].map(m => (
                      <button key={m.id} className={`${styles.rxMethod} ${rxMethod === m.id ? styles.rxMethodActive : ''}`}
                        onClick={() => setRxMethod(m.id)} id={`rx-${m.id}`}>
                        <span style={{ fontSize: '1.5rem' }}>{m.icon}</span>
                        <div>
                          <div className={styles.rxMethodLabel}>{m.label}</div>
                          <div className={styles.rxMethodDesc}>{m.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {rxMethod === 'manual' && (
                    <div className={styles.rxGrid}>
                      {['right', 'left'].map(eye => (
                        <div key={eye} className={styles.eyeSection}>
                          <h4 className={styles.eyeLabel}>{eye === 'right' ? '👁️ Right Eye (OD)' : '👁️ Left Eye (OS)'}</h4>
                          <div className={styles.rxRow}>
                            {['sph', 'cyl', 'axis', 'add'].map(field => (
                              <div key={field} className={styles.rxField}>
                                <label className={styles.rxFieldLabel}>{field.toUpperCase()}</label>
                                <select
                                  value={prescription[eye][field]}
                                  onChange={e => handleRxChange(eye, field, e.target.value)}
                                  className={styles.rxSelect}
                                  id={`rx-${eye}-${field}`}
                                >
                                  {POWER_STEPS[field].map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      <div className={styles.pdField}>
                        <label className={styles.rxFieldLabel}>PD (Pupillary Distance)</label>
                        <select value={prescription.pd} onChange={e => setPrescription(p => ({ ...p, pd: e.target.value }))} className={styles.rxSelect} id="rx-pd">
                          {Array.from({ length: 30 }, (_, i) => String(55 + i)).map(v => <option key={v} value={v}>{v} mm</option>)}
                        </select>
                      </div>
                    </div>
                  )}

                  {rxMethod === 'upload' && (
                    <div className={styles.uploadArea}>
                      <input type="file" accept="image/*,application/pdf" onChange={e => setUploadedPhoto(e.target.files[0])} id="rx-upload" style={{ display: 'none' }} />
                      <label htmlFor="rx-upload" className={styles.uploadLabel}>
                        <span style={{ fontSize: '2rem' }}>📤</span>
                        <div>
                          {uploadedPhoto ? `✅ ${uploadedPhoto.name}` : 'Click to upload prescription photo'}
                        </div>
                        <span className={styles.uploadHint}>JPG, PNG, or PDF accepted</span>
                      </label>
                    </div>
                  )}

                  {rxMethod === 'call' && (
                    <div className={styles.callNote}>
                      📞 We'll call you within 24 hours to confirm your power. Your order will start processing after that.
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Price Summary */}
        {(powerType || lensPackage) && (
          <div className={styles.priceSummary}>
            <span>Frame: ₹{product.price.toLocaleString('en-IN')}</span>
            {powerType?.price > 0 && <span>+ Power type: ₹{powerType.price}</span>}
            {lensPackage?.price > 0 && <span>+ Lens package: ₹{lensPackage.price}</span>}
            <span className={styles.total}>Total: ₹{(product.price + totalLensPrice).toLocaleString('en-IN')}</span>
          </div>
        )}

        {/* Navigation */}
        <div className={styles.navButtons}>
          {step === 1 && <button className="btn btn-outline" onClick={onSkip} id="skip-lens">Add Frame Only (No Lens)</button>}
          {step > 1 && <button className="btn btn-outline" onClick={() => setStep(s => s - 1)}>← Back</button>}
          <div style={{ flex: 1 }} />
          {step < 3 ? (
            <button className="btn btn-primary" onClick={() => setStep(s => s + 1)} disabled={!canProceed()} id="next-step-btn">
              Continue →
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleComplete}
              disabled={powerType?.id !== 'Zero Power' && !rxMethod}
              id="add-with-lens-btn">
              ✅ Add to Cart with Lens
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
