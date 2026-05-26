import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<h1 className="text-center mt-20 text-2xl">Home Page</h1>} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}