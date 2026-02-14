import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home"; 
import NavPar from "./Componan/NavPar";
import VerifyUser from "./admin/VerifyUser";
import ManagesUser from "./admin/ManagesUser";
import Leaderboard from "./admin/Leaderboard";
import AdminLogin from "./admin/adminlogin";

// Import the protection wrappers
import UserProtectedRoute from "./utils/UserProtectedRoute";
import AdminProtectedRoute from "./utils/AdminProtectedRoute";
import AdminHome from "./admin/AdminHome";

function App() {
  return (
    <div>
      <NavPar />

      <Router>
        <Routes>

          {/* Public routes - anyone can access */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected user routes - must have memberId */}
          <Route element={<UserProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<div>صفحة الملف الشخصي (تحت التطوير)</div>} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Route>

          {/* Admin login - public */}
          <Route path="/adminlogin" element={<AdminLogin />} />

          {/* Protected admin routes - must be admin logged in */}
          <Route element={<AdminProtectedRoute />}>
            <Route path="/verify" element={<VerifyUser />} />
            <Route path="/manage-users" element={<ManagesUser />} />
            <Route path="/admin" element={<AdminHome />} />
            {/* Add more admin pages here when needed */}
          </Route>

          {/* Optional: 404 fallback */}
          <Route path="*" element={<div>404 - الصفحة غير موجودة</div>} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;