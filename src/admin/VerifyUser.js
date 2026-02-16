// VerifyUser.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/VerifyUsers.css";

export default function VerifyUser() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("status", "==", "pending")
      );

      const querySnapshot = await getDocs(q);

      const usersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching pending users:", error);
    }
  };

  const generateRandomId = () => {
    return "QW-" + Math.floor(100000 + Math.random() * 900000);
  };

  const handleVerify = async (id) => {
    if (!window.confirm("هل أنت متأكد من قبول هذا المستخدم؟")) return;

    try {
      const userRef = doc(db, "users", id);

      await updateDoc(userRef, {
        status: "approved",
        memberId: generateRandomId(),
        hearts: 3,
        verifiedAt: serverTimestamp(),
      });

      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error verifying user:", error);
      alert("حدث خطأ أثناء القبول");
    }
  };

  const handleReject = async (id, userName = "") => {
    if (
      !window.confirm(
        `هل أنت متأكد من رفض المستخدم "${
          userName || "غير معروف"
        }"؟\nهذا الإجراء لا يمكن التراجع عنه.`
      )
    ) {
      return;
    }

    try {
      const userRef = doc(db, "users", id);

      await updateDoc(userRef, {
        status: "rejected",
        rejectedAt: serverTimestamp(),
      });

      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error rejecting user:", error);
      alert("حدث خطأ أثناء الرفض");
    }
  };

  return (
    <div className="verify">
      
      {/* Back Button */}
      <button
        className="backtoadmin"
        onClick={() => navigate("/admin")}
      >
        ← الرجوع إلى لوحة التحكم
      </button>

      <h2>مستخدمين في انتظار التوثيق</h2>

      {users.length === 0 ? (
        <p>لا يوجد مستخدمين في انتظار المراجعة</p>
      ) : (
        users.map((user) => (
          <div className="user" key={user.id}>
            <p>
              <strong>الاسم:</strong> {user.name || "غير محدد"}
            </p>
            <p>
              <strong>تاريخ الميلاد:</strong> {user.birthDate || "غير محدد"}
            </p>
            <p>
              <strong>رقم الهاتف:</strong> {user.phone || "غير محدد"}
            </p>

            <div className="action-buttons">
              <button
                className="btn-verify"
                onClick={() => handleVerify(user.id)}
              >
                قبول
              </button>

              <button
                className="btn-reject"
                onClick={() => handleReject(user.id, user.name)}
              >
                رفض
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
