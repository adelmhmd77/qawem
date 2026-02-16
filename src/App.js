import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NavPar from "./Componan/NavPar";
import VerifyUser from "./admin/VerifyUser";
import ManagesUser from "./admin/ManagesUser";
import Leaderboard from "./pages/Leaderboard";
import AdminLogin from "./admin/adminlogin";
import UserProtectedRoute from "./utils/UserProtectedRoute";
import AdminProtectedRoute from "./utils/AdminProtectedRoute";
import AdminHome from "./admin/AdminHome";
import Footer from "./Componan/Footer";

function Layout() {
  const location = useLocation();

  // الصفحات اللي مش عايزين فيها Navbar
  const hideNavbar =
    location.pathname === "/" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <NavPar />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User protected routes */}
        <Route element={<UserProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route
            path="/profile"
            element={<div>صفحة الملف الشخصي (تحت التطوير)</div>}
          />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Route>

        {/* Admin login */}
        <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/verify" element={<VerifyUser />} />
          <Route path="/manage-users" element={<ManagesUser />} />
          <Route path="/admin" element={<AdminHome />} />

        {/* Admin protected routes */}
        <Route element={<AdminProtectedRoute />}>
        </Route>

        {/* 404 */}
        <Route path="*" element={<div>404 - الصفحة غير موجودة</div>} />
      </Routes>

      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
