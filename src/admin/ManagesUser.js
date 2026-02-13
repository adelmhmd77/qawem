import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import '../styles/ManageUsers.css'

export default function ManagesUser() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "users"), where("status", "==", "approved"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const approvedUsers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(approvedUsers);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="manage">
      <h2>ادارة المستخدمين</h2>

      {users.length === 0 ? (
        <p>No verified users yet</p>
      ) : (
        users.map((user) => (
          <div key={user.id} className="user-v">
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
            <p>
              <strong>Member ID:</strong> {user.memberId}
            </p>

            <div style={{ fontSize: "24px" }}>
              {"❤️".repeat(user.hearts || 3)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
