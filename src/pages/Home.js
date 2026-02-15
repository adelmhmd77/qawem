// Home.jsx
import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";

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

const RAMADAN_START_DATE = new Date("2026-02-19"); // Turkey Ramadan start

const TASKS = [
  { name: "صلاة الفجر", points: 15 }, // 0 (heart)
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
  { name: "التحدي اليومي الخاص بك", points: 25 }, // 14 (heart)
];

/* ================= COMPONENT ================= */

export default function Home() {
  const [userName, setUserName] = useState("");
  const [hearts, setHearts] = useState(3);
  const [totalScore, setTotalScore] = useState(0);
  const [dailyProgress, setDailyProgress] = useState({});
  const [deductedDays, setDeductedDays] = useState([]);
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

        const ref = doc(db, "users", userDoc.id);

        setUserRef(ref);
        setUserName(data.name || "مستخدم");
        setHearts(Math.max(0, data.hearts ?? 3));
        setTotalScore(data.totalScore ?? 0);
        setDailyProgress(data.dailyProgress ?? {});
        setDeductedDays(data.lastHeartDeductionDays ?? []);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  /* ================= CURRENT DAY ================= */

  const currentRamadanDay = useMemo(() => {
    const now = new Date();

    const diffMs = now - RAMADAN_START_DATE;
    const diffDays = Math.floor(
      diffMs / (1000 * 60 * 60 * 24)
    );

    return Math.max(1, Math.min(30, diffDays + 1));
  }, []);

  /* ================= HEART DEDUCTION ================= */

  const checkAndDeductHearts = useCallback(async () => {
    if (!userRef || currentRamadanDay < 1) return;

    let totalLost = 0;

    const newDeducted = [...deductedDays];
    const updates = {};

    for (let day = 1; day <= currentRamadanDay; day++) {
      const dayStr = day.toString();

      if (newDeducted.includes(dayStr)) continue;

      const dayData =
        dailyProgress[dayStr] || { completed: [] };

      let dayLost = 0;

      /* Fajr (0) */
      const fajrStatus = dayData.completed.find(
        (v) => Math.abs(v) === 0
      );

      if (fajrStatus === undefined || fajrStatus < 0) {
        dayLost++;
      }

      /* Daily Challenge (14) */
      const dailyStatus = dayData.completed.find(
        (v) => Math.abs(v) === 14
      );

      if (
        dailyStatus === undefined ||
        dailyStatus < 0
      ) {
        dayLost++;
      }

      if (dayLost > 0) {
        totalLost += dayLost;
        newDeducted.push(dayStr);
      }
    }

    if (totalLost > 0) {
      const newHearts = Math.max(0, hearts - totalLost);

      updates.hearts = newHearts;
      updates.lastHeartDeductionDays = newDeducted;

      try {
        await updateDoc(userRef, updates);

        setHearts(newHearts);
        setDeductedDays(newDeducted);

        alert(
          `تم خصم ${totalLost} قلوب بسبب عدم إكمال صلاة الفجر أو التحدي اليومي`
        );
      } catch (err) {
        console.error("Heart deduction failed:", err);
      }
    }
  }, [
    userRef,
    currentRamadanDay,
    dailyProgress,
    deductedDays,
    hearts,
  ]);

  /* ================= AUTO CHECK ================= */

  useEffect(() => {
    if (!loading && userRef) {
      checkAndDeductHearts();

      const interval = setInterval(
        checkAndDeductHearts,
        30 * 60 * 1000
      );

      return () => clearInterval(interval);
    }
  }, [loading, userRef, checkAndDeductHearts]);

  /* ================= MARK TASK ================= */

  const markTask = async (dayStr, taskIndex, isDone) => {
    if (!userRef) return;

    const dayData =
      dailyProgress[dayStr] || { completed: [] };

    const isMarked = dayData.completed.some(
      (val) => Math.abs(val) === taskIndex
    );

    if (isMarked) return;

    const markValue = isDone
      ? taskIndex
      : -(taskIndex + 1);

    const pointsToAdd = isDone
      ? TASKS[taskIndex].points
      : 0;

    try {
      const updatedCompleted = [
        ...dayData.completed,
        markValue,
      ];

      const updates = {
        [`dailyProgress.${dayStr}`]: {
          completed: updatedCompleted,
        },
        totalScore: totalScore + pointsToAdd,
      };

      await updateDoc(userRef, updates);

      setDailyProgress((prev) => ({
        ...prev,
        [dayStr]: { completed: updatedCompleted },
      }));

      setTotalScore((prev) => prev + pointsToAdd);

      checkAndDeductHearts();
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الحفظ");
    }
  };

  /* ================= TASK STATUS ================= */

  const getTaskStatus = (dayStr, taskIndex) => {
    const dayData =
      dailyProgress[dayStr] || { completed: [] };

    const value = dayData.completed.find(
      (v) => Math.abs(v) === taskIndex
    );

    if (value === undefined) return "pending";

    return value >= 0 ? "done" : "missed";
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="loading">جاري التحميل...</div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="home-container" dir="rtl">
      <h2>مرحباً بك {userName}</h2>
      <h3>تحدي رمضان ٣٠ يوم</h3>

      <div className="summary-box">
        <p>
          اليوم في رمضان:{" "}
          <strong>{currentRamadanDay}</strong>
        </p>

        <p>قلوبك: {"❤️".repeat(hearts)}</p>

        <p>
          مجموع النقاط:{" "}
          <strong>{totalScore}</strong>
        </p>

        <small style={{ color: "#d32f2f" }}>
          عدم إكمال الفجر أو التحدي يخصم قلباً
        </small>
      </div>

      <div className="accordion-days">
        {Array.from({ length: 30 }, (_, i) => {
          const dayNum = i + 1;
          const dayStr = dayNum.toString();

          const isPastOrToday =
            dayNum <= currentRamadanDay;

          const completed =
            dailyProgress[dayStr]?.completed || [];

          const dayCompleted = completed.filter(
            (v) => v >= 0
          ).length;

          const dayScore = completed
            .filter((v) => v >= 0)
            .reduce(
              (sum, idx) =>
                sum + TASKS[idx].points,
              0
            );

          return (
            <details
              key={dayNum}
              open={dayNum === currentRamadanDay}
            >
              <summary>
                اليوم {dayNum}{" "}
                {dayNum === currentRamadanDay &&
                  "(اليوم)"}
                {dayScore > 0 &&
                  ` — ${dayScore} نقطة`}
                {dayCompleted === TASKS.length &&
                  " ✓ مكتمل"}
              </summary>

              <div className="tasks-list">
                {TASKS.map((task, idx) => {
                  const status = getTaskStatus(
                    dayStr,
                    idx
                  );

                  const disabled =
                    !isPastOrToday ||
                    status !== "pending";

                  return (
                    <div
                      key={idx}
                      className={`task-row ${status}`}
                    >
                      <span className="task-name">
                        {task.name}
                      </span>

                      <div className="task-controls">
                        <button
                          className="btn-done"
                          onClick={() =>
                            markTask(
                              dayStr,
                              idx,
                              true
                            )
                          }
                          disabled={disabled}
                        >
                          ✓
                        </button>

                        <button
                          className="btn-miss"
                          onClick={() =>
                            markTask(
                              dayStr,
                              idx,
                              false
                            )
                          }
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
