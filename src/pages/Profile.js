// Profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import "../styles/Profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [rank, setRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const memberId = localStorage.getItem("memberId");
    if (!memberId) {
      navigate("/");
      return;
    }

    const fetchProfile = async () => {
      try {
        const approvedQ = query(
          collection(db, "users"),
          where("status", "==", "approved")
        );
        const snap = await getDocs(approvedQ);

        const users = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const sorted = [...users].sort(
          (a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0)
        );

        const me = sorted.find((u) => u.memberId === memberId);
        if (!me) {
          navigate("/");
          return;
        }

        setUser(me);
        setRank(sorted.findIndex((u) => u.memberId === memberId) + 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("memberId");
    navigate("/");
  };

  if (loading) return <div className="loading">جاري التحميل...</div>;
  if (!user) return null;

  return (
    <div className="profile-page" dir="rtl">
      <div className="profile-card">
        <div className="profile-avatar">
          {(user.name || "?").trim().charAt(0)}
        </div>

        <h2>{user.name || "مستخدم"}</h2>
        <p className="member-id">رقم العضوية: {user.memberId}</p>

        <div className="profile-stats">
          <div className="profile-stat">
            <span className="value">{user.totalScore ?? 0}</span>
            <span className="label">النقاط</span>
          </div>

          <div className="profile-stat">
            <span className="value">
              {(user.hearts ?? 5) > 0 ? "❤️".repeat(user.hearts ?? 5) : "🖤"}
            </span>
            <span className="label">القلوب</span>
          </div>

          <div className="profile-stat">
            <span className="value">#{rank}</span>
            <span className="label">الترتيب</span>
          </div>
        </div>

        {user.phone && (
          <p className="profile-phone">📱 {user.phone}</p>
        )}

        <button className="logout-btn" onClick={handleLogout}>
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
}
