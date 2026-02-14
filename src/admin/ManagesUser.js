// ManageUsers.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import "../styles/ManageUsers.css";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [editingUser, setEditingUser] = useState(null); // {id, name, phone}

  useEffect(() => {
    const q = query(collection(db, "users"), where("status", "==", "approved"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const approvedUsers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(approvedUsers);
      },
      (error) => {
        console.error("Error fetching approved users:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // ── Heart Management ───────────────────────────────────────
  const changeHearts = async (userId, currentHearts, delta) => {
    if (updatingUserId) return;

    setUpdatingUserId(userId);

    try {
      const userRef = doc(db, "users", userId);
      const newHearts = Math.max(0, Math.min(10, (currentHearts || 3) + delta));

      await updateDoc(userRef, { hearts: newHearts });
      // onSnapshot will auto-refresh the list
    } catch (err) {
      console.error("Failed to update hearts:", err);
      alert("حدث خطأ أثناء تعديل القلوب");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const addHeart = (userId, currentHearts) => changeHearts(userId, currentHearts, 1);
  const removeHeart = (userId, currentHearts) => changeHearts(userId, currentHearts, -1);

  // ── Edit User ──────────────────────────────────────────────
  const startEdit = (user) => {
    setEditingUser({
      id: user.id,
      name: user.name || "",
      phone: user.phone || "",
    });
  };

  const cancelEdit = () => setEditingUser(null);

  const saveEdit = async () => {
    if (!editingUser || updatingUserId) return;

    setUpdatingUserId(editingUser.id);

    try {
      const userRef = doc(db, "users", editingUser.id);
      await updateDoc(userRef, {
        name: editingUser.name.trim(),
        phone: editingUser.phone.trim(),
      });
      setEditingUser(null);
      // onSnapshot refreshes automatically
    } catch (err) {
      console.error("Failed to update user:", err);
      alert("حدث خطأ أثناء حفظ التعديلات");
    } finally {
      setUpdatingUserId(null);
    }
  };

  // ── Delete User ────────────────────────────────────────────
  const deleteUser = async (userId, userName) => {
    if (!window.confirm(`هل أنت متأكد من حذف المستخدم "${userName || "غير معروف"}" نهائياً؟`)) {
      return;
    }

    if (updatingUserId) return;

    setUpdatingUserId(userId);

    try {
      const userRef = doc(db, "users", userId);
      await deleteDoc(userRef);
      // onSnapshot will remove it from the list automatically
      alert("تم حذف المستخدم بنجاح");
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("حدث خطأ أثناء الحذف – تحقق من صلاحياتك");
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <div className="manage" dir="rtl">
      <h2>إدارة المستخدمين الموثقين</h2>

      {users.length === 0 ? (
        <p>لا يوجد مستخدمين موثقين بعد</p>
      ) : (
        users.map((user) => {
          const currentHearts = user.hearts ?? 3;
          const isUpdating = updatingUserId === user.id;
          const isEditing = editingUser && editingUser.id === user.id;

          return (
            <div key={user.id} className="user-card">
              {isEditing ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    placeholder="الاسم"
                  />
                  <input
                    type="tel"
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    placeholder="رقم الهاتف"
                  />
                  <div className="edit-actions">
                    <button onClick={saveEdit} disabled={isUpdating}>
                      {isUpdating ? "جاري الحفظ..." : "حفظ"}
                    </button>
                    <button onClick={cancelEdit} disabled={isUpdating}>
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p><strong>الاسم:</strong> {user.name || "غير محدد"}</p>
                  <p><strong>الهاتف:</strong> {user.phone || "غير محدد"}</p>
                  <p><strong>رقم العضوية:</strong> {user.memberId || "غير متوفر"}</p>

                  <div className="hearts-row">
                    <div className="hearts-display">
                      {"❤️".repeat(currentHearts)}
                    </div>

                    <div className="heart-buttons">
                      <button
                        className="btn-add"
                        onClick={() => addHeart(user.id, currentHearts)}
                        disabled={isUpdating || currentHearts >= 10}
                      >
                        +1 قلب
                      </button>
                      <button
                        className="btn-remove"
                        onClick={() => removeHeart(user.id, currentHearts)}
                        disabled={isUpdating || currentHearts <= 0}
                      >
                        -1 قلب
                      </button>
                    </div>
                  </div>

                  <div className="user-actions">
                    <button
                      className="btn-edit"
                      onClick={() => startEdit(user)}
                      disabled={isUpdating}
                    >
                      تعديل
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => deleteUser(user.id, user.name)}
                      disabled={isUpdating}
                    >
                      حذف المستخدم
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}