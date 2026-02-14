// adminlogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // make sure you have react-router-dom installed
import '../styles/AdminLogin.css'; // optional styling file

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

    // Find matching admin
    const matchedAdmin = validAdmins.find(
      admin => admin.username === username.trim().toLowerCase() &&
               admin.password === password
    );

    if (matchedAdmin) {
      // Success - save login state
      localStorage.setItem('isAdminLoggedIn', 'true');
      localStorage.setItem('adminUsername', username.trim().toLowerCase());

      // Redirect to admin dashboard (change path as needed)
      navigate('/admin'); // or '/manageusers' or wherever your admin pages are
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="admin-login-container" dir="rtl">
      <div className="login-box">
        <h2>تسجيل دخول الإدارة</h2>
        <p className="subtitle">فقط لـ adel و hazem</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
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

          <div className="form-group">
            <label>كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              required
            />
          </div>

          <button type="submit" className="login-btn">
            تسجيل الدخول
          </button>
        </form>

        <div className="back-link">
          <a href="/">العودة إلى الصفحة الرئيسية</a>
        </div>
      </div>
    </div>
  );
}