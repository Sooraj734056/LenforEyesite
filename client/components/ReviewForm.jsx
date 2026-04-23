'use client';
import { useState } from 'react';
import useAuthStore from '@/store/authStore';
import toast from 'react-hot-toast';

export default function ReviewForm({ productId, onReviewAdded }) {
  const { user } = useAuthStore();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to write a review');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token is in localStorage
        },
        body: JSON.stringify({ rating, comment })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Review added successfully!');
        setComment('');
        setRating(5);
        if (onReviewAdded) onReviewAdded(data.reviews, data.ratings);
      } else {
        toast.error(data.message || 'Failed to add review');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div style={{ padding: '20px', borderRadius: '12px', background: 'var(--off-white)', textAlign: 'center' }}>
        <p>You must be logged in to post a review.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '24px', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
      <h4 style={{ marginBottom: '16px' }}>Write a Review</h4>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Rating</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[1, 2, 3, 4, 5].map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setRating(s)}
              style={{
                fontSize: '1.5rem',
                color: s <= rating ? '#F59E0B' : '#D1D5DB',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {s <= rating ? '★' : '☆'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            fontFamily: 'inherit',
            fontSize: '0.9rem'
          }}
          required
        />
      </div>

      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={submitting}
      >
        {submitting ? 'Posting...' : 'Post Review'}
      </button>
    </form>
  );
}
