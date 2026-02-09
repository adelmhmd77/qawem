import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Routes>
        {/* USER ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Login />} />
        <Route path="/profile" element={<Login />} />

        {/* ADMIN LOGIN PROTECTOR */}
        <Route path="/login" element={<Login />} />

        {/* ADMIN PROTECTED ROUTES */}
        <Route path="/admin" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
