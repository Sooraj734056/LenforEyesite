'use client';
import useWishlistStore from '@/store/wishlistStore';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export default function WishlistPage() {
  const { items } = useWishlistStore();

  return (
    <div className="container section">
      <div style={{ marginBottom: '32px' }}>
        <h1 className="section-title">My Wishlist ({items.length})</h1>
        <p className="section-subtitle">Keep track of the frames you love</p>
      </div>

      {items.length === 0 ? (
        <div className="card" style={{ padding: '64px', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>❤️</div>
          <h3>Your Wishlist is Empty</h3>
          <p style={{ maxWidth: '400px', margin: '8px auto 24px' }}>
            Explore our collection and save your favorite frames to view them later.
          </p>
          <Link href="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="grid grid-4" style={{ gap: '24px' }}>
          {items.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
