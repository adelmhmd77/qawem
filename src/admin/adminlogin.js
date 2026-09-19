// adminlogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Hardcoded admin credentials (for demo / small project only)
  const validAdmins = [
    { username: 'adel', password: 'adel123' },
    { username: 'hazem', password: 'hazem456' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const matchedAdmin = validAdmins.find(
      admin => admin.username === username.trim().toLowerCase() &&
               admin.password === password
    );

    if (matchedAdmin) {
      localStorage.setItem('isAdminLoggedIn', 'true');
      localStorage.setItem('adminUsername', username.trim().toLowerCase());
      navigate('/admin');
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>تسجيل دخول الإدارة</h2>
        <p className="subtitle">فقط لـ عادل وحازم</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>اسم المستخدم</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="adel أو hazem"
              required
              autoFocus
            />
          </div>

          <div className="auth-field">
            <label>كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              required
            />
          </div>

          <button type="submit" className="btn-submit">
            تسجيل الدخول
          </button>
        </form>

        <a className="auth-link" href="/">
          العودة إلى الصفحة الرئيسية
        </a>
      </div>
    </div>
  );
}
