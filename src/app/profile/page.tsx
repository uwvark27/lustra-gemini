'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import NextImage from 'next/image';
import { Camera, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { getProfileData, updateProfile, changePassword } from '@/app/actions/profile';

const ROLE_BADGE: Record<string, string> = {
  admin:  'bg-red-500/20 text-red-300 border border-red-500/30',
  super:  'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  member: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  user:   'bg-slate-500/20 text-slate-300 border border-slate-500/30',
};

function StatusMsg({ ok, msg }: { ok: boolean; msg: string }) {
  if (!msg) return null;
  return (
    <div className={`flex items-center gap-2 text-sm mt-3 ${ok ? 'text-emerald-400' : 'text-red-400'}`}>
      {ok ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
      {msg}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Profile form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [profileMsg, setProfileMsg] = useState('');
  const [profileOk, setProfileOk] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);

  // Password form
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwMsg, setPwMsg] = useState('');
  const [pwOk, setPwOk] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    getProfileData().then((data) => {
      if (data) {
        setProfile(data);
        setName(data.user.name || '');
        setEmail(data.user.email || '');
        setAvatarPreview(data.user.avatarUrl || null);
      }
      setLoading(false);
    });
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg('');
    const fd = new FormData();
    fd.append('name', name);
    fd.append('email', email);
    if (avatarFile) fd.append('avatar', avatarFile);
    const res = await updateProfile(fd);
    setProfileSaving(false);
    setProfileOk(res.success);
    setProfileMsg(res.success ? 'Profile updated successfully.' : (res.error || 'Update failed.'));
    if (res.success) {
      setAvatarFile(null);
      router.refresh();
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg('');
    if (newPw !== confirmPw) { setPwOk(false); setPwMsg('New passwords do not match.'); return; }
    if (newPw.length < 8) { setPwOk(false); setPwMsg('Password must be at least 8 characters.'); return; }
    setPwSaving(true);
    const fd = new FormData();
    fd.append('currentPassword', currentPw);
    fd.append('newPassword', newPw);
    const res = await changePassword(fd);
    setPwSaving(false);
    setPwOk(res.success);
    setPwMsg(res.success ? 'Password changed successfully.' : (res.error || 'Failed to change password.'));
    if (res.success) { setCurrentPw(''); setNewPw(''); setConfirmPw(''); }
  };

  const initials = name ? name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : '?';
  const roleBadge = ROLE_BADGE[(profile?.role || 'user').toLowerCase()] || ROLE_BADGE.user;
  const isAdmin = profile?.role?.toLowerCase() === 'admin';

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
      You must be logged in to view this page.
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pb-16">
      {/* Banner */}
      <div className="h-36 bg-gradient-to-br from-slate-800 via-slate-900 to-blue-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_60%,rgba(59,130,246,0.18),transparent_65%)]" />
      </div>

      <div className="container mx-auto px-4 max-w-3xl -mt-14 relative">
        {/* Avatar row */}
        <div className="flex items-end gap-5 mb-8">
          <div className="relative shrink-0">
            <div
              className="w-28 h-28 rounded-full border-4 border-slate-950 overflow-hidden bg-slate-800 shadow-xl flex items-center justify-center cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              {avatarPreview ? (
                <NextImage src={avatarPreview} alt={name} fill sizes="112px" className="object-cover" unoptimized={avatarPreview.startsWith('blob:')} />
              ) : (
                <span className="text-3xl font-bold text-slate-300 select-none">{initials}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-950 transition-colors"
              title="Change avatar"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          <div className="pb-2">
            <h1 className="text-2xl font-bold text-slate-100 leading-tight">{profile.user.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${roleBadge}`}>
                {profile.role}
              </span>
              <span className="text-xs text-slate-500">
                Member since {new Date(profile.user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* ── Profile Info Card ── */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-100 mb-5 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-blue-500 rounded-full inline-block" />
              Profile Information
            </h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">User ID</label>
                <input
                  type="text"
                  value={profile.user.id}
                  disabled
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-3 py-2 text-slate-500 text-sm cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              {isAdmin && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Role <span className="text-red-400">(admin only)</span></label>
                    <input
                      type="text"
                      value={profile.role}
                      disabled
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-3 py-2 text-slate-500 text-sm cursor-not-allowed capitalize"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Entity ID <span className="text-red-400">(admin only)</span></label>
                    <input
                      type="text"
                      value={profile.user.entityId ?? 'None'}
                      disabled
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-3 py-2 text-slate-500 text-sm cursor-not-allowed"
                    />
                  </div>
                </>
              )}

              {avatarFile && (
                <p className="text-xs text-blue-400">New avatar selected: {avatarFile.name}</p>
              )}
              <button
                type="submit"
                disabled={profileSaving}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
              >
                {profileSaving ? 'Saving…' : 'Save Changes'}
              </button>
              <StatusMsg ok={profileOk} msg={profileMsg} />
            </form>
          </div>

          {/* ── Change Password Card ── */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-100 mb-5 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-blue-500 rounded-full inline-block" />
              <Lock className="w-4 h-4 text-slate-400" />
              Change Password
            </h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {[
                { label: 'Current Password', value: currentPw, set: setCurrentPw, show: showCurrent, toggle: setShowCurrent },
                { label: 'New Password', value: newPw, set: setNewPw, show: showNew, toggle: setShowNew },
                { label: 'Confirm New Password', value: confirmPw, set: setConfirmPw, show: showNew, toggle: setShowNew },
              ].map(({ label, value, set, show, toggle }) => (
                <div key={label}>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
                  <div className="relative">
                    <input
                      type={show ? 'text' : 'password'}
                      value={value}
                      onChange={(e) => set(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 pr-9 text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <button type="button" onClick={() => toggle(!show)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="submit"
                disabled={pwSaving}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
              >
                {pwSaving ? 'Updating…' : 'Change Password'}
              </button>
              <StatusMsg ok={pwOk} msg={pwMsg} />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
