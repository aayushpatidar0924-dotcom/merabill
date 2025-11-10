import React from "react";
import "./i18n";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './App.css';
import Navbar from './componantes/Nav_bar';
import Footer from './componantes/footer';
import Home from './componantes/home';
import About from './componantes/about';
import Contact from './componantes/contact';
import Login from './componantes/login';
import Signup from "./componantes/sign up";
import Admin from "./componantes/admin";

function AppContent() {
  const location = useLocation();

  // agar path /admin se start ho raha ho to Navbar aur Footer hide kar do
  const hideNavbarFooter = location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbarFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      {!hideNavbarFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
