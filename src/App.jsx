import { useEffect, useState } from 'react';
import { useNavigate, Routes, Route, HashRouter as Router } from 'react-router-dom';

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from './pages/Register';
import Home from './pages/Home';
import Create from './pages/Create';
import './App.css';

function AppRoutes() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("userToken");

    if (token) {
      setIsLoggedIn(true);
      // Redirect only if not already on a protected route
      const currentPath = window.location.hash.replace('#', '');
      if (currentPath === '/' || currentPath === '') {
        navigate("/home");
      }
    } else {
      setIsLoggedIn(false);
      const currentPath = window.location.hash.replace('#', '');
      if (currentPath !== '/login' && currentPath !== '/register') {
        navigate("/");
      }
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes: only accessible if logged in */}
      <Route path="/home" element={isLoggedIn ? <Home /> : <Login />} />
      <Route path="/create" element={isLoggedIn ? <Create /> : <Login />} />
      <Route path="/edit/:id" element={isLoggedIn ? <Create /> : <Login />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
