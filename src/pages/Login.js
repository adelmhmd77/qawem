import React, { useState } from "react";
import { db } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Login() {
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const checkId = async () => {
    const trimmedId = userId.trim();

    if (!trimmedId) {
      setError("من فضلك ادخل ال ID");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const q = query(
        collection(db, "users"),
        where("memberId", "==", trimmedId),
        where("status", "==", "approved")
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        const isDisabled = userData.disabled || (userData.hearts ?? 5) <= 0;

        localStorage.setItem("memberId", trimmedId);
        window.location = isDisabled ? "/wheel" : "/home";
      } else {
        setError("الرجاء التاكد من ال ID الخاص بك");
      }
    } catch (err) {
      console.error(err);
      setError("حدث خطأ حاول مرة اخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img className="logo" src="/logo-light.png" alt="Qawem Logo" />

        <h2>مرحباً بعودتك</h2>
        <p className="subtitle">ادخل رقم عضويتك للمتابعة في تحدي قاوم</p>

        {error && <div className="error">{error}</div>}

        <div className="auth-field">
          <label>رقم العضوية</label>
          <input
            type="text"
            placeholder="مثال: QW-123456"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && checkId()}
            disabled={loading}
          />
        </div>

        <button className="btn-submit" onClick={checkId} disabled={loading}>
          {loading ? "جاري التحقق..." : "ابدأ قاوم"}
        </button>

        <a className="auth-link" href="/register">
          ليس لديك حساب؟ <span>سجل هنا</span>
        </a>
      </div>
    </div>
  );
}
