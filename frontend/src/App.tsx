import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Main from "./pages/Main";
<<<<<<< HEAD
import StorePage from "./pages/StorePage";
import ProductPage from "./pages/ProductPage";
=======
import Profile from "./pages/Profile";
>>>>>>> 9fbdde90c88017aaff1c0c96bcfcba8cf0fade31

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<Main />} />
<<<<<<< HEAD
        <Route path="/store" element={<StorePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
=======
        <Route path="/profile" element={<Profile />} />
>>>>>>> 9fbdde90c88017aaff1c0c96bcfcba8cf0fade31
      </Routes>
    </BrowserRouter>
  );
}

export default App;