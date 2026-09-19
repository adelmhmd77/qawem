// Home.jsx
import React, { useEffect, useState, useMemo } from "react";
import { db } from "../firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import "../styles/Home.css";

/* ================= CONSTANTS ================= */

const RAMADAN_START_DATE = new Date("2026-02-19");

const DAILY_CHALLENGES = [
  "ابتسم في وجه 5 أشخاص اليوم",
  "اتصل بشخص لم تكلمه منذ فترة",
  "تصدق ولو بمبلغ بسيط",
  "اقرأ 10 صفحات إضافية",
  "ساعد أحد أفراد عائلتك بدون طلب",
  "قل أذكار النوم كاملة",
  "امتنع عن الغيبة طوال اليوم",
  "ادعُ لشخص تحبه دعاء خاص",
  "نظف مكاناً في بيتك",
  "اقرأ عن سيرة صحابي",
  "صلِّ ركعتين شكر لله",
  "اكتب 5 نعم تشكر الله عليها",
  "أفطر صائماً",
  "حافظ على تكبيرة الإحرام",
  "اقرأ تفسير سورة قصيرة",
  "أرسل رسالة طيبة لشخص",
  "استمع لدرس ديني 20 دقيقة",
  "سامح شخصاً أخطأ في حقك",
  "أكثر من الاستغفار 200 مرة",
  "ادعُ لوالديك 50 مرة",
  "احفظ آية جديدة",
  "ابتعد عن السوشيال ميديا ساعتين",
  "ساعد محتاجاً",
  "حافظ على قيام الليل",
  "أصلح بين شخصين",
  "اقرأ أذكار بعد الصلاة كاملة",
  "تجنب أي جدال اليوم",
  "قل لا إله إلا الله 300 مرة",
  "أدخل السرور على طفل",
  "اختم يومك بمحاسبة النفس",
];

const TASKS = [
  { name: "صلاة الفجر", points: 15 },
  { name: "أذكار الصباح", points: 8 },
  { name: "قراءة جزء من القرآن", points: 12 },
  { name: "قراءة تفسير بسيط لما قرأت", points: 10 },
  { name: "صلاة الظهر", points: 12 },
  { name: "صلاة العصر", points: 12 },
  { name: "أذكار المساء", points: 8 },
  { name: "الاستغفار 100 مرة", points: 10 },
  { name: "الصلاة على النبي ﷺ 100 مرة", points: 10 },
  { name: "صدقة يومية", points: 15 },
  { name: "مساعدة شخص أو عمل خير", points: 15 },
  { name: "صلاة المغرب + الدعاء قبل الإفطار", points: 12 },
  { name: "صلاة العشاء", points: 12 },
  { name: "التراويح / قيام الليل", points: 20 },
  { name: "التحدي اليومي", points: 25 }, // index 14
];

/* ================= COMPONENT ================= */

export default function Home() {
  const [userName, setUserName] = useState("");
  const [hearts, setHearts] = useState(5);
  const [totalScore, setTotalScore] = useState(0);
  const [dailyProgress, setDailyProgress] = useState({});
  const [userRef, setUserRef] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH USER ================= */

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

        if (data.disabled || (data.hearts ?? 5) <= 0) {
          window.location.href = "/wheel";
          return;
        }

        const ref = doc(db, "users", userDoc.id);

        setUserRef(ref);
        setUserName(data.name || "مستخدم");
        setHearts(Math.max(0, data.hearts ?? 5));
        setTotalScore(data.totalScore ?? 0);
        setDailyProgress(data.dailyProgress ?? {});
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  /* ================= CURRENT DAY ================= */

  // 0  = التحدي لسه ما بدأش
  // -1 = التحدي انتهى (استنى رمضان القادم)
  // 1..30 = يوم التحدي الحالي
  const currentRamadanDay = useMemo(() => {
    const now = new Date();
    const diffMs = now - RAMADAN_START_DATE;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 0;
    if (diffDays > 29) return -1;
    return diffDays + 1;
  }, []);

  const isSeasonActive = currentRamadanDay >= 1 && currentRamadanDay <= 30;

  /* ================= MARK TASK ================= */

  const markTask = async (dayStr, taskIndex, isDone) => {
    if (!userRef) return;
    if (Number(dayStr) !== currentRamadanDay) return;

    const dayData = dailyProgress[dayStr] || { completed: [] };

    if (dayData.completed.some(v => Math.abs(v) === taskIndex + 1)) return;

    const markValue = isDone ? taskIndex + 1 : -(taskIndex + 1);
    const pointsToAdd = isDone ? TASKS[taskIndex].points : 0;
    const updatedCompleted = [...dayData.completed, markValue];

    // كل مرة تدوس X بتخسر قلب واحد
    const newHearts = isDone ? hearts : Math.max(0, hearts - 1);
    const accountDisabled = !isDone && newHearts === 0;

    const updates = {
      [`dailyProgress.${dayStr}`]: { completed: updatedCompleted },
      totalScore: totalScore + pointsToAdd,
    };

    if (!isDone) updates.hearts = newHearts;
    if (accountDisabled) updates.disabled = true;

    await updateDoc(userRef, updates);

    if (accountDisabled) {
      localStorage.removeItem("memberId");
      window.location.href = "/";
      return;
    }

    setDailyProgress(prev => ({
      ...prev,
      [dayStr]: { completed: updatedCompleted },
    }));

    setTotalScore(prev => prev + pointsToAdd);
    if (!isDone) setHearts(newHearts);
  };

  /* ================= TASK STATUS ================= */

  const getTaskStatus = (dayStr, taskIndex) => {
    const dayData = dailyProgress[dayStr] || { completed: [] };
    const value = dayData.completed.find(
      v => Math.abs(v) === taskIndex + 1
    );

    if (value !== undefined) return value > 0 ? "done" : "missed";

    // لم يتم تسجيل أي شيء لهذه المهمة، ولو اليوم فات يبقى فاتك
    return Number(dayStr) < currentRamadanDay ? "expired" : "pending";
  };

  /* ================= DAY PROGRESS ================= */

  const getDayProgress = (dayStr) => {
    const dayData = dailyProgress[dayStr] || { completed: [] };
    const doneCount = dayData.completed.filter(v => v > 0).length;
    const percent = Math.round((doneCount / TASKS.length) * 100);
    return { doneCount, percent };
  };

  /* ================= DAY ORDER (اليوم الحالي يظهر الأول) ================= */

  const isCurrentDayComplete =
    isSeasonActive &&
    (dailyProgress[currentRamadanDay.toString()]?.completed.length ?? 0) >=
      TASKS.length;

  const dayOrder = useMemo(() => {
    const days = Array.from({ length: 30 }, (_, i) => i + 1);
    if (isSeasonActive && !isCurrentDayComplete) {
      return [currentRamadanDay, ...days.filter(d => d !== currentRamadanDay)];
    }
    return days;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRamadanDay, isSeasonActive, isCurrentDayComplete]);

  if (loading) return <div className="loading">جاري التحميل...</div>;

  /* ================= UI ================= */

  return (
    <div className="home-container" dir="rtl">
      <div className="home-header">
        <h2>مرحباً بك {userName}</h2>
        <h3>تحدي رمضان ٣٠ يوم</h3>
      </div>

      <div className="summary-grid">
        <div className="summary-card day">
          <div className="summary-icon">🌙</div>
          <div className="summary-value">{currentRamadanDay}</div>
          <div className="summary-label">اليوم الحالي</div>
        </div>

        <div className="summary-card hearts">
          <div className="summary-icon">
            {hearts > 0 ? "❤️".repeat(hearts) : "🖤"}
          </div>
          <div className="summary-value">{hearts}</div>
          <div className="summary-label">القلوب المتبقية</div>
        </div>

        <div className="summary-card score">
          <div className="summary-icon">⭐</div>
          <div className="summary-value">{totalScore}</div>
          <div className="summary-label">مجموع النقاط</div>
        </div>
      </div>

      {!isSeasonActive && (
        <div className="season-banner">
          {currentRamadanDay === 0
            ? "🌙 التحدي لسه ما بدأش، تابعنا لمعرفة الموعد"
            : "🌙 التحدي انتهى لهذا العام، نراكم في رمضان القادم"}
        </div>
      )}

      <div className="accordion-days">
        {dayOrder.map((dayNum) => {
          const dayStr = dayNum.toString();
          const isPastOrToday = isSeasonActive && dayNum <= currentRamadanDay;
          const isToday = dayNum === currentRamadanDay;
          const isNextRamadanStart = !isSeasonActive && dayNum === 1;
          const { doneCount, percent } = getDayProgress(dayStr);

          return (
            <details
              key={dayNum}
              open={isToday}
              className={!isPastOrToday ? "locked" : undefined}
            >
              <summary>
                <span className="day-title">
                  {isToday && <span className="today-badge">اليوم</span>}
                  {isNextRamadanStart && (
                    <span className="today-badge next-badge">
                      رمضان القادم
                    </span>
                  )}
                  اليوم {dayNum}
                </span>

                {isPastOrToday ? (
                  <span className="day-progress">
                    <span className="day-progress-track">
                      <span
                        className="day-progress-fill"
                        style={{ width: `${percent}%` }}
                      />
                    </span>
                    <span className="day-progress-label">
                      {doneCount}/{TASKS.length}
                    </span>
                  </span>
                ) : (
                  <span className="day-locked-label">
                    {isNextRamadanStart
                      ? "🌙 يبدأ هنا التحدي القادم"
                      : "🔒 لم يحن بعد"}
                  </span>
                )}
              </summary>

              <div className="tasks-list">
                {TASKS.map((task, idx) => {
                  const status = getTaskStatus(dayStr, idx);
                  const disabled = !isToday || status !== "pending";

                  const taskName =
                    idx === 14
                      ? DAILY_CHALLENGES[dayNum - 1]
                      : task.name;

                  const statusIcon =
                    status === "done"
                      ? "✅"
                      : status === "missed"
                      ? "❌"
                      : status === "expired"
                      ? "⌛"
                      : "⏳";

                  return (
                    <div key={idx} className={`task-row ${status}`}>
                      <span className="task-name">
                        <span className="task-status-icon">{statusIcon}</span>
                        {taskName}
                      </span>

                      <div className="task-controls">
                        <button
                          className="btn-done"
                          onClick={() => markTask(dayStr, idx, true)}
                          disabled={disabled}
                        >
                          ✓
                        </button>

                        <button
                          className="btn-miss"
                          onClick={() => markTask(dayStr, idx, false)}
                          disabled={disabled}
                        >
                          X
                        </button>

                        <span className="task-points">
                          +{task.points}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
