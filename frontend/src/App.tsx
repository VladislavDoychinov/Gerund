import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Main from "./Pages/Main";
import StorePage from "./Pages/StorePage";
import ProductPage from "./Pages/ProductPage";
import Profile from "./Pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<Main />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;