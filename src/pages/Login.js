import React, { useState } from "react";
import "../styles/Login.css";
import { db } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Login() {
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");

  const checkId = async () => {
    if (!userId) {
      setError("من فضلك ادخل ال ID");
      return;
    }

    try {
      const q = query(
        collection(db, "users"),
        where("memberId", "==", userId),
        where("status", "==", "approved")
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // ممكن تخزن بياناته في localStorage
        localStorage.setItem("memberId", userId);

        window.location = "/home";
      } else {
        setError("الرجاء التاكد من ال ID الخاص بك");
      }

    } catch (err) {
      console.error(err);
      setError("حدث خطأ حاول مرة اخرى");
    }
  };

  return (
    <div className="login-form">
      <img src="logo-light.png" alt="Qawem Logo" />

      {error && <div className="error">{error}</div>}

      <input
        type="text"
        placeholder="ادخل ال ID الخاص بك"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />

      <button onClick={checkId}>ابدء قاوم</button>

      <a href="/register">
        ليس لديك حساب؟ <span>سجل هنا</span>
      </a>
    </div>
  );
}
