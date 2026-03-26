import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

<<<<<<< HEAD
import Register from "./pages/Register";
import Login from "./pages/Login";
import Main from "./pages/Main";
import StorePage from "./pages/StorePage";
import ProductPage from "./pages/ProductPage";
import Profile from "./pages/Profile";
=======
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Main from "./Pages/Main";
import StorePage from "./Pages/StorePage";
import ProductPage from "./Pages/ProductPage";
import Profile from "./Pages/Profile";
import AddProduct from "./Pages/AddProduct";
>>>>>>> 28d98c3e9e54276cdaab043dafffdcf62df70f0b

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