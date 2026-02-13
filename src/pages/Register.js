import React, { useState } from "react";
import "../styles/Register.css";
import { db } from "../firebase/config"; // عدل المسار حسب مشروعك
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Register() {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "users"), {
        name: name,
        birthDate: birthDate,
        phone: phone,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setShowPopup(true);
      setName("");
      setBirthDate("");
      setPhone("");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("حصل خطأ حاول تاني");
    }

    setLoading(false);
  };

  const tohome = () => {
    window.location = "/";
  };

  return (
    <div className="register-form">
      <img src="logo-light.png" alt="Qawem Logo" />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="اسمك"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          required
        />

        <input
          type="tel"
          placeholder="رقم تيليفونك مع رمز الدولة"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <input
          type="submit"
          value={loading ? "جاري الإرسال..." : "ارسل بياناتك"}
          disabled={loading}
        />
      </form>

      <a href="/">انت جزء من مجتمع قاوم؟ <span>سجل دخول الان</span></a>

      {showPopup && (
        <div className="popup">
          <h2>تم تسجيلك بنجاح</h2>
          <p>
            سيتم مراجعة بياناتك بعناية وستستلم رسالة علي الواتس اب بالid الخاص بك
          </p>
          <button onClick={tohome}>العودة للصفحة الرئيسية</button>
        </div>
      )}
    </div>
  );
}
