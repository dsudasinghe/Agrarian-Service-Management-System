import { Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./components/admin/dashboard";
import Login from "./components/auth/login";
import Signup from "./components/auth/signup";
import Categories from "./components/admin/categories";
import Events from "./components/admin/events";
import Users from "./components/admin/users";
import Announcements from "./components/admin/announcements";
import EventsList from "./components/eventslist";
import AnnouncementsList from "./components/announcementslist";
import AdminAdvisors from "./components/admin/adminadvisors";
import Loans from "./components/admin/loan";
import Product from "./components/admin/products";
import Orders from "./components/admin/orders";
import Landingpage from "./components/landingpage";

function App() {
  const user = localStorage.getItem("token");
  const getUserData = () => {
    return JSON.parse(localStorage.getItem("user"));
  };

  return (
    <Routes>
      {" "}
      {user && (
        <Route path="/" element={<Navigate replace to="/home" />} />
      )}{" "}
      <Route path="/" element={<Navigate replace to="/login" />} />{" "}
      <Route path="/home" element={<Landingpage />} />{" "}
      {user && (
        <Route path="/login" element={<Navigate replace to="/home" />} />
      )}{" "}
      <Route path="/login" element={<Login />} />{" "}
      <Route path="/signup" element={<Signup />} />{" "}
      {getUserData() &&
        (getUserData().usertype === 1 || getUserData().usertype === 2) && (
          <Route path="/categories" element={<Categories />} />
        )}{" "}
      <Route path="/categories" element={<Navigate replace to="/home" />} />{" "}
      {getUserData() &&
        (getUserData().usertype === 1 || getUserData().usertype === 2) && (
          <Route path="/events" element={<Events />} />
        )}{" "}
      <Route path="/events" element={<Navigate replace to="/home" />} />{" "}
      {getUserData() &&
        (getUserData().usertype === 1 || getUserData().usertype === 2) && (
          <Route path="/announcements" element={<Announcements />} />
        )}{" "}
      <Route path="/announcements" element={<Navigate replace to="/home" />} />{" "}
      <Route path="/productlist" element={<Dashboard />} />{" "}
      <Route path="/eventslist" element={<EventsList />} />{" "}
      <Route path="/announcementslist" element={<AnnouncementsList />} />{" "}
      {getUserData() && getUserData().usertype === 1 && (
        <Route path="/users" element={<Users />} />
      )}{" "}
      <Route path="/users" element={<Navigate replace to="/home" />} />{" "}
      <Route path="/admin/advisors" element={<AdminAdvisors />} />{" "}
      <Route path="/admin/loans" element={<Loans />} />{" "}
      <Route path="/admin/loans" element={<Loans />} />{" "}
      {getUserData() &&
        (getUserData().usertype === 1 || getUserData().usertype === 2) && (
          <Route path="/products" element={<Product />} />
        )}{" "}
      <Route path="/products" element={<Product />} />{" "}
      <Route path="/admin/orders" element={<Orders />} />{" "}
    </Routes>
  );
}

export default App;
