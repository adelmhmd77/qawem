import React, { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Register() {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedPhone = phone.trim();
    if (!/^\+?\d{8,15}$/.test(trimmedPhone)) {
      setError("رقم الهاتف غير صحيح، تأكد من كتابته مع رمز الدولة");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await addDoc(collection(db, "users"), {
        name: name.trim(),
        birthDate: birthDate,
        phone: trimmedPhone,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setShowPopup(true);
      setName("");
      setBirthDate("");
      setPhone("");
    } catch (err) {
      console.error("Error adding document: ", err);
      alert("حصل خطأ حاول تاني");
    }

    setLoading(false);
  };

  const tohome = () => {
    window.location = "/";
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img className="logo" src="/logo-light.png" alt="Qawem Logo" />

        <h2>انضم لمجتمع قاوم</h2>
        <p className="subtitle">سجّل بياناتك وسنتواصل معك بعد المراجعة</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>الاسم</label>
            <input
              type="text"
              placeholder="اسمك"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>تاريخ الميلاد</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>رقم الهاتف</label>
            <input
              type="tel"
              placeholder="رقم تيليفونك مع رمز الدولة"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "جاري الإرسال..." : "ارسل بياناتك"}
          </button>
        </form>

        <a className="auth-link" href="/">
          انت جزء من مجتمع قاوم؟ <span>سجل دخول الآن</span>
        </a>
      </div>

      {showPopup && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>تم تسجيلك بنجاح 🎉</h2>
            <p>
              سيتم مراجعة بياناتك بعناية وستستلم رسالة على الواتساب بالـ ID
              الخاص بك
            </p>
            <button onClick={tohome}>العودة للصفحة الرئيسية</button>
          </div>
        </div>
      )}
    </div>
  );
}
