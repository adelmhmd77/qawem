import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home"; 
import NavPar from "./Componan/NavPar";

function App() {
  return (
    <div>
    <NavPar/>

    <Router>
      <Routes>
        {/* USER ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Login />} />

        {/* ADMIN LOGIN PROTECTOR */}
        <Route path="/login" element={<Login />} />

        {/* ADMIN PROTECTED ROUTES */}
        <Route path="/admin" element={<Login />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
