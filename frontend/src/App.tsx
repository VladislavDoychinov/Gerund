import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


import Register from "./pages/Register";
import Login from "./pages/Login";
import Main from "./pages/Main";
import StorePage from "./pages/StorePage";
import ProductPage from "./pages/ProductPage";
import Profile from "./pages/Profile";
import AddProduct from "./pages/AddProduct";

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
        <Route path="/addproduct" element={<AddProduct />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;