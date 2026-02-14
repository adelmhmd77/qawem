// Leaderboard.jsx (fixed version)
import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import "../styles/LeaderBoard.css";

export default function Leaderboard() {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "users"),
      where("status", "==", "approved"),
      // Removed orderBy & limit → we'll sort in JS
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const usersList = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .map((user) => ({
            ...user,
            totalScore: user.totalScore ?? 0, // fallback to 0 if missing
          }))
          .sort((a, b) => b.totalScore - a.totalScore); // client-side descending sort

        setTopUsers(usersList);
        setLoading(false);
        setErrorMsg(null);
      },
      (error) => {
        console.error("Leaderboard error:", error);
        setErrorMsg("خطأ في جلب البيانات: " + error.message);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="loading">جاري تحميل الترتيب...</div>;

  if (errorMsg) return <div className="error">{errorMsg}</div>;

  if (topUsers.length === 0) {
    return (
      <div className="leaderboard-empty">
        <h2>🏆 الترتيب</h2>
        <p>لا يوجد مستخدمين موثقين بعد</p>
        <small>رمضان يبدأ قريباً (19 فبراير 2026) – انتظر المشاركة!</small>
      </div>
    );
  }

  return (
    <div className="leaderboard" dir="rtl">
      <h2>🏆 الترتيب العام</h2>
      <p>بناءً على نقاط تحدي رمضان (حتى لو ٠ حالياً)</p>

      <div className="podium">
        {topUsers.length >= 2 && (
          <div className="podium-position silver">
            <div className="medal">🥈</div>
            <div className="rank">2</div>
            <div className="name">{topUsers[1].name || "مستخدم"}</div>
            <div className="score">{topUsers[1].totalScore} نقطة</div>
            <div className="hearts">{"❤️".repeat(topUsers[1].hearts ?? 0)}</div>
          </div>
        )}

        {topUsers.length >= 1 && (
          <div className="podium-position gold">
            <div className="medal">🥇</div>
            <div className="rank">1</div>
            <div className="name">{topUsers[0].name || "مستخدم"}</div>
            <div className="score">{topUsers[0].totalScore} نقطة</div>
            <div className="hearts">{"❤️".repeat(topUsers[0].hearts ?? 0)}</div>
          </div>
        )}

        {topUsers.length >= 3 && (
          <div className="podium-position bronze">
            <div className="medal">🥉</div>
            <div className="rank">3</div>
            <div className="name">{topUsers[2].name || "مستخدم"}</div>
            <div className="score">{topUsers[2].totalScore} نقطة</div>
            <div className="hearts">{"❤️".repeat(topUsers[2].hearts ?? 0)}</div>
          </div>
        )}
      </div>

      <div className="leaderboard-list">
        {topUsers.slice(3).map((user, index) => (
          <div key={user.id} className="leaderboard-item">
            <span className="rank-number">{index + 4}</span>
            <span className="name">{user.name || "مستخدم"}</span>
            <span className="score">{user.totalScore} نقطة</span>
            <span className="hearts-small">
              {"❤️".repeat(user.hearts ?? 0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
