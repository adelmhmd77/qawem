import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import '../styles/VerifyUsers.css'
export default function VerifyUser() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("status", "==", "pending"),
      );

      const querySnapshot = await getDocs(q);

      const usersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const generateRandomId = () => {
    return "QW-" + Math.floor(100000 + Math.random() * 900000);
  };

  const handleVerify = async (id) => {
    try {
      const userRef = doc(db, "users", id);

      await updateDoc(userRef, {
        status: "approved",
        memberId: generateRandomId(),
        hearts: 3,
      });

      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error verifying user:", error);
    }
  };

  return (
    <div  className="verify">
      <h2>مستخدمين في انتظار التوثيق</h2>

      {users.length === 0 ? (
        <p>No users pending review</p>
      ) : (
        users.map((user) => (
          <div className="user"
            key={user.id}
       
          >
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Birth Date:</strong> {user.birthDate}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>

            <button onClick={() => handleVerify(user.id)}>Verify</button>
          </div>
        ))
      )}
    </div>
  );
}
