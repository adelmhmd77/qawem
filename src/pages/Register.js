import React from "react";
import "../styles/Register.css";
export default function Register() {
function popup() {
  const popup = document.querySelector("#pop");
  popup.style.visibility = "visible";
  popup.style.opacity = "1";
  popup.style.transform = "translateY(0)";
}

  function tohome() {
    window.location = "/";
  }
  return (
    <div className="register-form">
      <img src="logo.jpeg" alt="Qawem Logo" />
      <form>
        <input type="text" placeholder="اسمك" required/>
        <input type="date" placeholder="سنك" required/>
        <input type="tel" placeholder="رقم تيليفونك مع رمز الدولة" required/>
        <input
          type="submit"
          value="ارسل بياناتك"
          onClick={(e) => {
            e.preventDefault();
            popup();
          }}
        />
      </form>
      <a href="/">انت جزء من مجتمع قاوم؟ سجل دخول الان</a>

      <div className="popup" id="pop">
        <h2>تم تسجيلك بنجاح</h2>
        <p>
          سيتم مراجعة بياناتك بعناية وستستلم رسالة علي الواتس اب بالid الخاص بك
        </p>
        <button onClick={tohome}>العودة للصفحة الرئيسية</button>
      </div>
    </div>
  );
}
