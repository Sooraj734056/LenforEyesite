'use client';
import { motion } from 'framer-motion';

export const Skeleton = ({ width, height, borderRadius = '12px', className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      style={{
        width: width || '100%',
        height: height || '20px',
        borderRadius: borderRadius,
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
      }}
      className={className}
    />
  );
};

export const ProductSkeleton = () => (
  <div style={{ padding: '16px', background: 'white', borderRadius: '24px', boxShadow: 'var(--shadow-sm)' }}>
    <Skeleton height="200px" borderRadius="16px" />
    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Skeleton width="40%" height="12px" />
      <Skeleton width="90%" height="20px" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
        <Skeleton width="30%" height="24px" />
        <Skeleton width="20%" height="16px" />
      </div>
    </div>
  </div>
);

export const CollectionSkeleton = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px', width: '100%' }}>
    {Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)}
  </div>
);
