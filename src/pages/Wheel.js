// Wheel.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import "../styles/Wheel.css";

const REACTIVATION_HEARTS = 5;

const CHALLENGES = [
  { icon: "📖", text: "اقرأ صفحة كاملة من القرآن الآن" },
  { icon: "🙏", text: "صلِّ ركعتين شكر لله" },
  { icon: "🕊️", text: "استغفر الله 100 مرة" },
  { icon: "🤲", text: "تصدق ولو بمبلغ بسيط" },
  { icon: "📞", text: "اتصل بأحد والديك أو أقاربك الآن" },
  { icon: "✨", text: "احفظ آية جديدة من القرآن" },
  { icon: "💪", text: "أدِّ عملاً صالحاً لأي شخص اليوم" },
  { icon: "📚", text: "اقرأ عن سيرة أحد الصحابة" },
];

export default function Wheel() {
  const [userRef, setUserRef] = useState(null);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [challenge, setChallenge] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const memberId = localStorage.getItem("memberId");
    if (!memberId) {
      window.location.href = "/";
      return;
    }

    const fetchUser = async () => {
      try {
        const q = query(
          collection(db, "users"),
          where("memberId", "==", memberId)
        );
        const snap = await getDocs(q);

        if (snap.empty) {
          window.location.href = "/";
          return;
        }

        const userDoc = snap.docs[0];
        const data = userDoc.data();
        const isDisabled = data.disabled || (data.hearts ?? 5) <= 0;

        if (!isDisabled) {
          window.location.href = "/home";
          return;
        }

        setUserRef(doc(db, "users", userDoc.id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const spin = () => {
    if (spinning || challenge || !userRef) return;

    setSpinning(true);
    const extraSpins = 5 + Math.floor(Math.random() * 3); // 5-7 لفات
    const randomStop = Math.floor(Math.random() * 360);
    setRotation(prev => prev + extraSpins * 360 + randomStop);
  };

  const handleSpinEnd = () => {
    if (!spinning) return;
    setSpinning(false);

    // العجلة عليها 8 قطاعات كل واحد 45 درجة، والمؤشر ثابت فوق
    const landedIndex =
      Math.floor(((360 - (rotation % 360)) % 360) / 45) % CHALLENGES.length;

    setChallenge(CHALLENGES[landedIndex]);
  };

  const confirmChallenge = async () => {
    if (!userRef || done) return;

    try {
      await updateDoc(userRef, {
        disabled: false,
        hearts: REACTIVATION_HEARTS,
      });
      setDone(true);
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء تفعيل الحساب، حاول مرة أخرى");
    }
  };

  const goHome = () => {
    window.location.href = "/home";
  };

  if (loading) return <div className="loading">جاري التحميل...</div>;

  return (
    <div className="wheel-page" dir="rtl">
      <div className="wheel-card">
        <h2>حسابك متوقف مؤقتاً 💔</h2>
        <p className="wheel-subtitle">
          خسرت كل قلوبك. أدر العجلة وأدِّ التحدي الذي تحصل عليه لإعادة تفعيل حسابك.
        </p>

        <div className="wheel-wrap">
          <div className="wheel-pointer" />
          <div
            className="wheel"
            style={{ transform: `rotate(${rotation}deg)` }}
            onTransitionEnd={handleSpinEnd}
          >
            {CHALLENGES.map((c, i) => (
              <span
                key={i}
                className="wheel-segment"
                style={{ transform: `rotate(${i * 45}deg)` }}
              >
                {c.icon}
              </span>
            ))}
          </div>
        </div>

        {!challenge && (
          <button className="btn-submit" onClick={spin} disabled={spinning}>
            {spinning ? "جاري التدوير..." : "أدر العجلة"}
          </button>
        )}

        {challenge && !done && (
          <>
            <div className="wheel-challenge">
              <div className="wheel-challenge-icon">{challenge.icon}</div>
              <div>تحديك هو:</div>
              <strong>{challenge.text}</strong>
            </div>
            <button className="btn-submit" onClick={confirmChallenge}>
              أتممت التحدي، فعّل حسابي ✅
            </button>
          </>
        )}

        {done && (
          <>
            <div className="wheel-success">
              🎉 تم تفعيل حسابك من جديد بـ {REACTIVATION_HEARTS} قلوب!
            </div>
            <button className="btn-submit" onClick={goHome}>
              الذهاب للصفحة الرئيسية
            </button>
          </>
        )}
      </div>
    </div>
  );
}
