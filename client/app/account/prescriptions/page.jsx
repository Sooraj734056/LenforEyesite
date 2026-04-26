'use client';
import { useState, useEffect } from 'react';
import useAuthStore from '@/store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FiUserPlus, FiFileText, FiPlus, FiTrash2, FiEye, 
  FiClock, FiCheckCircle, FiChevronRight, FiUsers 
} from 'react-icons/fi';
import styles from './page.module.css';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function PrescriptionVault() {
  const { user, token } = useAuthStore();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', relation: 'Self' });

  const fetchVault = async () => {
    try {
      const { data } = await axios.get(`${API}/prescriptions/vault`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setMembers(data.familyMembers || []);
    } catch (err) {
      toast.error('Failed to load vault');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (token) fetchVault(); }, [token]);

  const addMember = async () => {
    if (!newMember.name) return toast.error('Enter name');
    try {
      const { data } = await axios.post(`${API}/prescriptions/family`, newMember, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setMembers(data.familyMembers);
      setShowAddMember(false);
      setNewMember({ name: '', relation: 'Self' });
      toast.success('Member added!');
    } catch (_) { toast.error('Error adding member'); }
  };

  const deleteMember = async (id) => {
    if (!window.confirm('Remove this member and their prescriptions?')) return;
    try {
      const { data } = await axios.delete(`${API}/prescriptions/member/${id}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setMembers(data.familyMembers);
      toast.success('Member removed');
    } catch (_) { toast.error('Error removing member'); }
  };

  if (!user) return <div className="flex-center" style={{ minHeight: 400 }}><Link href="/login" className="btn btn-primary">Login to access vault</Link></div>;

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Prescription Vault</h1>
          <p className={styles.subtitle}>Securely store and manage eye prescriptions for your entire family.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddMember(true)}>
          <FiUserPlus /> Add Family Member
        </button>
      </div>

      {loading ? (
        <div className="flex-center" style={{ padding: 80 }}><div className="spinner" /></div>
      ) : members.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}><FiUsers /></div>
          <h3>Your vault is empty</h3>
          <p>Add family members to start saving their eye prescriptions for easy checkout.</p>
          <button className="btn btn-outline" onClick={() => setShowAddMember(true)}>Add your first member</button>
        </div>
      ) : (
        <div className={styles.memberGrid}>
          {members.map(member => (
            <div key={member._id} className={styles.memberCard}>
              <div className={styles.memberHeader}>
                <div className={styles.memberInfo}>
                  <div className={styles.avatar}>{member.name[0]}</div>
                  <div>
                    <h3 className={styles.memberName}>{member.name}</h3>
                    <span className={styles.relationBadge}>{member.relation}</span>
                  </div>
                </div>
                <button className={styles.deleteMember} onClick={() => deleteMember(member._id)} title="Remove Member">
                  <FiTrash2 />
                </button>
              </div>

              <div className={styles.rxList}>
                <h4 className={styles.rxTitle}>Saved Prescriptions</h4>
                {member.prescriptions?.length === 0 ? (
                  <p className={styles.noRx}>No prescriptions saved yet.</p>
                ) : (
                  member.prescriptions.map((rx, i) => (
                    <div key={rx._id} className={styles.rxItem}>
                      <div className={styles.rxIcon}><FiFileText /></div>
                      <div className={styles.rxDetails}>
                        <div className={styles.rxDate}>Saved on {new Date(rx.addedAt).toLocaleDateString()}</div>
                        <div className={styles.rxMeta}>
                          {rx.uploadedPhoto ? 'Photo Upload' : 'Manual Entry'} • {rx.rightEye?.sph ? 'Power Details' : 'No power'}
                        </div>
                      </div>
                      <button className={styles.viewRx}><FiEye /></button>
                    </div>
                  ))
                )}
                <button className={styles.addRxBtn}>
                  <FiPlus /> Add New Prescription
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMember && (
        <div className={styles.modalOverlay} onClick={() => setShowAddMember(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: 20 }}>Add Family Member</h3>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                className="form-input" 
                placeholder="e.g. Rahul Sharma" 
                value={newMember.name}
                onChange={e => setNewMember({...newMember, name: e.target.value})}
              />
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Relation</label>
              <select 
                className="form-select"
                value={newMember.relation}
                onChange={e => setNewMember({...newMember, relation: e.target.value})}
              >
                {['Self', 'Spouse', 'Child', 'Parent', 'Other'].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowAddMember(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={addMember}>Add Member</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
