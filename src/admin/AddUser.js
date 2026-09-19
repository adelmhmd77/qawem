// AddUser.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "../styles/AddUser.css";

const generateRandomId = () => "QW-" + Math.floor(100000 + Math.random() * 900000);

export default function AddUser() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdId, setCreatedId] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    const memberId = generateRandomId();

    try {
      await addDoc(collection(db, "users"), {
        name: name.trim(),
        phone: phone.trim(),
        status: "approved",
        memberId,
        hearts: 5,
        totalScore: 0,
        createdAt: serverTimestamp(),
        verifiedAt: serverTimestamp(),
      });

      setCreatedId(memberId);
      setName("");
      setPhone("");
    } catch (err) {
      console.error("Error adding user manually:", err);
      alert("حدث خطأ أثناء إضافة المستخدم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-user" dir="rtl">
      <button className="backtoadmin" onClick={() => navigate("/admin")}>
        ← الرجوع إلى لوحة التحكم
      </button>

      <h2>إضافة مستخدم يدوياً</h2>
      <p className="hint">يُستخدم لإضافة مستخدم موثّق مباشرة بدون المرور بمرحلة المراجعة.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="اسم المستخدم"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="tel"
          placeholder="رقم الهاتف (اختياري)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "جاري الإضافة..." : "إضافة المستخدم"}
        </button>
      </form>

      {createdId && (
        <div className="success-box">
          تمت الإضافة بنجاح. رقم العضوية الخاص به: <strong>{createdId}</strong>
        </div>
      )}
    </div>
  );
}
