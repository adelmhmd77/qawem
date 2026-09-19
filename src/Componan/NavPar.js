import React from "react";
import { NavLink } from "react-router-dom";

export default function NavPar() {
  return (
    <div className="navbar">
      <div className="navbar-inner">
        <NavLink to="/home" className="navbar-brand">
          <img src="/logo-light.png" alt="قاوم" />
          <span>قاوم</span>
        </NavLink>

        <ul>
          <li>
            <NavLink to="/home">الصفحة الرئيسية</NavLink>
          </li>
          <li>
            <NavLink to="/leaderboard">ترتيب المتصدرين</NavLink>
          </li>
          <li>
            <NavLink to="/profile">ملفي الشخصي</NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}
