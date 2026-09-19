// ManageUsers.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

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

  const visibleUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = term
      ? users.filter(
          (u) =>
            (u.name || "").toLowerCase().includes(term) ||
            (u.memberId || "").toLowerCase().includes(term) ||
            (u.phone || "").toLowerCase().includes(term)
        )
      : users;

    return [...filtered].sort(
      (a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0)
    );
  }, [users, search]);

  // ── Heart Management ───────────────────────────────────────
  const changeHearts = async (userId, currentHearts, delta) => {
    if (updatingUserId) return;

    setUpdatingUserId(userId);

    try {
      const userRef = doc(db, "users", userId);
      const newHearts = Math.max(0, Math.min(10, (currentHearts || 5) + delta));

      const updates = { hearts: newHearts };
      if (newHearts === 0) updates.disabled = true;

      await updateDoc(userRef, updates);
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

  // ── Reactivate Disabled Account ──────────────────────────────
  const reactivateUser = async (userId) => {
    if (updatingUserId) return;

    setUpdatingUserId(userId);

    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { disabled: false, hearts: 5 });
    } catch (err) {
      console.error("Failed to reactivate user:", err);
      alert("حدث خطأ أثناء إعادة التفعيل");
    } finally {
      setUpdatingUserId(null);
    }
  };

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
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("حدث خطأ أثناء الحذف – تحقق من صلاحياتك");
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <div className="manage" dir="rtl">
      <button className="backtoadmin" onClick={() => navigate("/admin")}>
        ← الرجوع إلى لوحة التحكم
      </button>

      <div className="manage-header">
        <h2>إدارة المستخدمين الموثقين</h2>
        <input
          className="manage-search"
          type="text"
          placeholder="ابحث بالاسم أو رقم العضوية أو الهاتف..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {users.length === 0 ? (
        <p>لا يوجد مستخدمين موثقين بعد</p>
      ) : visibleUsers.length === 0 ? (
        <p>لا توجد نتائج مطابقة</p>
      ) : (
        <div className="table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>الهاتف</th>
                <th>رقم العضوية</th>
                <th>النقاط</th>
                <th>القلوب</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((user) => {
                const currentHearts = user.hearts ?? 5;
                const isUpdating = updatingUserId === user.id;
                const isEditing = editingUser && editingUser.id === user.id;
                const isDisabled = user.disabled || currentHearts <= 0;

                return (
                  <tr key={user.id}>
                    <td data-label="الاسم">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingUser.name}
                          onChange={(e) =>
                            setEditingUser({ ...editingUser, name: e.target.value })
                          }
                          placeholder="الاسم"
                        />
                      ) : (
                        user.name || "غير محدد"
                      )}
                    </td>

                    <td data-label="الهاتف">
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editingUser.phone}
                          onChange={(e) =>
                            setEditingUser({ ...editingUser, phone: e.target.value })
                          }
                          placeholder="رقم الهاتف"
                        />
                      ) : (
                        user.phone || "غير محدد"
                      )}
                    </td>

                    <td data-label="رقم العضوية">{user.memberId || "غير متوفر"}</td>

                    <td data-label="النقاط">{user.totalScore ?? 0}</td>

                    <td data-label="القلوب">
                      <div className="hearts-cell">
                        <span className="hearts-display">
                          {currentHearts > 0 ? "❤️".repeat(currentHearts) : "🖤"}
                        </span>
                        <div className="heart-buttons">
                          <button
                            className="btn-add"
                            onClick={() => addHeart(user.id, currentHearts)}
                            disabled={isUpdating || currentHearts >= 10}
                          >
                            +
                          </button>
                          <button
                            className="btn-remove"
                            onClick={() => removeHeart(user.id, currentHearts)}
                            disabled={isUpdating || currentHearts <= 0}
                          >
                            −
                          </button>
                        </div>
                      </div>
                    </td>

                    <td data-label="الحالة">
                      {isDisabled ? (
                        <span className="status-disabled">معطّل ⛔</span>
                      ) : (
                        <span className="status-active">مفعّل ✅</span>
                      )}
                    </td>

                    <td data-label="الإجراءات">
                      <div className="user-actions">
                        {isEditing ? (
                          <>
                            <button onClick={saveEdit} disabled={isUpdating}>
                              {isUpdating ? "جاري الحفظ..." : "حفظ"}
                            </button>
                            <button onClick={cancelEdit} disabled={isUpdating}>
                              إلغاء
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn-edit"
                              onClick={() => startEdit(user)}
                              disabled={isUpdating}
                            >
                              تعديل
                            </button>
                            {isDisabled && (
                              <button
                                className="btn-reactivate"
                                onClick={() => reactivateUser(user.id)}
                                disabled={isUpdating}
                              >
                                تفعيل
                              </button>
                            )}
                            <button
                              className="btn-delete"
                              onClick={() => deleteUser(user.id, user.name)}
                              disabled={isUpdating}
                            >
                              حذف
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
