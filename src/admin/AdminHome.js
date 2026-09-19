// AdminHome.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs, // added for manual debug fetch
} from "firebase/firestore";
import "../styles/AdminHome.css";

export default function AdminHome() {
  const [verifiedCount, setVerifiedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0); // extra debug stat
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const adminUsername = localStorage.getItem("adminUsername") || "الإداري";

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminUsername");
    navigate("/adminlogin");
  };

  useEffect(() => {
    let unsubscribeVerified;
    let unsubscribePending;
    let unsubscribeAll;

    try {
      // ── Verified count ────────────────────────────────
      const verifiedQ = query(
        collection(db, "users"),
        where("status", "==", "approved"),
      );

      unsubscribeVerified = onSnapshot(
        verifiedQ,
        (snap) => {
          setVerifiedCount(snap.size);
        },
        (err) => {
          console.error("[AdminHome] Verified onSnapshot error:", err);
          setError("خطأ في جلب المستخدمين الموثقين: " + err.message);
        },
      );

      // ── Pending count ─────────────────────────────────
      const pendingQ = query(
        collection(db, "users"),
        where("status", "==", "pending"),
      );

      unsubscribePending = onSnapshot(
        pendingQ,
        (snap) => {
          setPendingCount(snap.size);
          setLoading(false);
        },
        (err) => {
          console.error("[AdminHome] Pending onSnapshot error:", err);
          setError("خطأ في جلب المستخدمين المعلقين: " + err.message);
        },
      );

      // ── Total users (debug) ───────────────────────────
      const allUsersQ = query(collection(db, "users"));
      unsubscribeAll = onSnapshot(allUsersQ, (snap) => {
        setTotalUsers(snap.size);
      });
    } catch (err) {
      console.error("[AdminHome] Setup error:", err);
      setError("حدث خطأ عام: " + err.message);
      setLoading(false);
    }

    return () => {
      if (unsubscribeVerified) unsubscribeVerified();
      if (unsubscribePending) unsubscribePending();
      if (unsubscribeAll) unsubscribeAll();
    };
  }, []);

  // Manual fetch button for extra debug
  const debugFetch = async () => {
    try {
      const snap = await getDocs(collection(db, "users"));
      console.log("[Debug Fetch] Total documents:", snap.size);
      snap.forEach((doc) => {
        console.log("→", doc.id, "status:", doc.data().status);
      });
      alert(`تم جلب ${snap.size} مستخدم. انظر إلى وحدة التحكم`);
    } catch (err) {
      console.error("[Debug Fetch] Error:", err);
      alert("خطأ: " + err.message);
    }
  };

  if (loading) {
    return <div className="admin-loading">جاري التحميل...</div>;
  }

  if (error) {
    return (
      <div className="admin-error">
        <h3>حدث خطأ</h3>
        <p>{error}</p>
        <p style={{ color: "#e74c3c", fontWeight: "bold" }}>
          تحقق من قواعد الأمان في Firebase Firestore
        </p>
        <button onClick={debugFetch}>اختبار يدوي (Debug Fetch)</button>
      </div>
    );
  }

  return (
    <div className="admin-home" dir="rtl">
      <div className="welcome-section">
        <h1>مرحباً بك، {adminUsername === "adel" ? "عادل" : "حازم"} 👋</h1>
        <p>لوحة تحكم الإدارة – قاوم</p>
        <button className="logout-link" onClick={handleLogout}>
          تسجيل الخروج
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card verified">
          <div className="stat-number">{verifiedCount}</div>
          <div className="stat-label">مستخدمين موثقين</div>
        </div>

        <div className="stat-card pending">
          <div className="stat-number">{pendingCount}</div>
          <div className="stat-label">مستخدمين في الانتظار</div>
        </div>

        <div className="stat-card total">
          <div className="stat-number">{totalUsers}</div>
          <div className="stat-label">إجمالي المستخدمين</div>
        </div>
      </div>

      <div className="action-buttons">
        <button
          className="admin-btn manage"
          onClick={() => navigate("/manage-users")}
        >
          <span className="icon">👥</span>
          إدارة المستخدمين
        </button>

        <button
          className="admin-btn verify"
          onClick={() => navigate("/verify")}
        >
          <span className="icon">✅</span>
          التحقق من المستخدمين الجدد
        </button>

        <button
          className="admin-btn add"
          onClick={() => navigate("/add-user")}
        >
          <span className="icon">➕</span>
          إضافة مستخدم يدوياً
        </button>
      </div>

      <div className="extra-info">
        <small>آخر تحديث: {new Date().toLocaleTimeString("ar-EG")}</small>
        <button
          onClick={debugFetch}
          style={{ marginTop: "1rem", background: "#e67e22", color: "white" }}
        >
          اختبار جلب البيانات يدوياً
        </button>
      </div>
    </div>
  );
}
