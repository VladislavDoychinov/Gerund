import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Map from "./pages/Map/Map";
import StorePage from "./pages/StorePage";
import ProductPage from "./pages/ProductPage";
import Profile from "./pages/Profile";
import AddProduct from "./pages/AddProduct";
import MainPage from "./pages/Main";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/home" element={<MainPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/map" element={<Map />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/marketplace" element={<Navigate to="/store" replace />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/addproduct" element={<AddProduct />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
