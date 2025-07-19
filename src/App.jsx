import { useState } from 'react';
import Landing from "./pages/Landing";
import Login from "./pages/Login"
import Register from './pages/Register';
import Home from './pages/Home';
import Create from './pages/Create'
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
function App() {
 
  const [count, setCount] = useState(0); 

  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Register/>}/>
        <Route path='/home' element={<Home />}/>
        <Route path="/create" element={<Create />}/>
        <Route path="/edit/:id" element={<Create />} />
      </Routes>
    </Router>
  );
}

export default App;