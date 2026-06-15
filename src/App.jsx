import Login from "./components/Login";
import Home from "./components/Home";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import About from "./components/About";
import Contact from "./components/Contact";
import SignUp from "./components/SignUp";
import Users from "./components/Users";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup/:editId" element={<SignUp />} />
      </Routes>
    </div>
  );
};

export default App;
