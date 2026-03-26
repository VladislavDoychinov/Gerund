import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

<<<<<<< HEAD

import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Main from "./Pages/Main";
import StorePage from "./Pages/StorePage";
import ProductPage from "./Pages/ProductPage";
import Profile from "./Pages/Profile";
import AddProduct from "./Pages/AddProduct";
=======
import Register from "./pages/Register";
import Login from "./pages/Login";
import Main from "./pages/Main";
import StorePage from "./pages/StorePage";
import ProductPage from "./pages/ProductPage";
import Profile from "./pages/Profile";
import AddProduct from "./pages/AddProduct";
>>>>>>> f3f1aa055014a53e72b44e6f2491e54757f2a9b9

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