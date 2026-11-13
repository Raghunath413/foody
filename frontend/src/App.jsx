import { Routes, Route, Navigate } from "react-router-dom";
import ChooseRegister from "./pages/auth/ChooseRegister.jsx";
import UserRegister from "./pages/auth/UserRegister.jsx";
import UserLogin from "./pages/auth/UserLogin.jsx";
import FoodPartnerRegister from "./pages/auth/FoodPartnerRegister.jsx";
import FoodPartnerLogin from "./pages/auth/FoodPartnerLogin.jsx";
import Home from "./pages/general/Home.jsx";
import Saved from "./pages/general/Saved.jsx";
import CreateFood from "./pages/food-partner/CreateFood.jsx";
import Profile from "./pages/food-partner/Profile.jsx";
import Dashboard from "./pages/food-partner/Dashboard.jsx";

export default function App() {
    return (
        <Routes>
            <Route path="/register" element={<ChooseRegister />} />
            <Route path="/user/register" element={<UserRegister />} />
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
            <Route path="/food-partner/login" element={<FoodPartnerLogin />} />

            <Route path="/" element={<Home />} />
            <Route path="/saved" element={<Saved />} />

            <Route path="/food-partner/dashboard" element={<Dashboard />} />
            <Route path="/create-food" element={<CreateFood />} />
            <Route path="/food-partner/:id" element={<Profile />} />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
