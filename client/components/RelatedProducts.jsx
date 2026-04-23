'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { resolveMediaUrl } from '@/lib/media';
import styles from './ProductCard.module.css';

export default function RelatedProducts({ category, excludeId }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!category) return;
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    fetch(`${API}/products?category=${category}&limit=4`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setProducts(data.products.filter(p => p._id !== excludeId).slice(0, 4));
        }
      })
      .catch(() => {});
  }, [category, excludeId]);

  if (products.length === 0) return null;

  return (
    <div style={{ marginTop: '32px', paddingBottom: '64px' }}>
      <h3 style={{ marginBottom: '20px' }}>Related Frames You May Like</h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '24px' 
      }}>
        {products.map(p => (
          <Link key={p._id} href={`/product/${p._id}`} className="card" style={{ padding: '16px', textDecoration: 'none', color: 'inherit' }}>
            <img 
              src={resolveMediaUrl(p.variants?.[0]?.images?.[0]) || '/img/placeholder.png'} 
              alt={p.name} 
              style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase' }}>{p.brand}</div>
            <h5 style={{ marginBottom: '8px' }}>{p.name}</h5>
            <div style={{ fontWeight: 700 }}>₹{p.price.toLocaleString('en-IN')}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
