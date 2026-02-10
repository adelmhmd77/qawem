import React from "react";
import "../styles/Login.css";

export default function Login() {
  function checkid() {
    const useridinput = document.querySelector("#userid").value;
    const error = document.querySelector("#error");

    if (useridinput === "1223854") {
      window.location = "/home";
    } else {
      error.innerHTML = "الرجاء التاكد من ال id الخاص بك";
      error.style.display = "block";
    }
  }

  return (
    <div className="Container">
      <img src="Qawem.jpg" alt="Qawem Logo" />

      <div id="error"></div>
      <input type="text" id="userid" placeholder="ادخل ال id الخاص بك" />
      <button onClick={checkid}>ابدء قاوم</button>
      <a href="/register">ليس لديك حساب؟ <span>سجل هنا</span></a>
    </div>
  );
}
