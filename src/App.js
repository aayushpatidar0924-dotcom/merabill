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
import Workers from "./componantes/workers";
import Worker from "./componantes/Worker";

function AppContent() {
  const location = useLocation();

  // HIDE NAVBAR FOR ADMIN & WORKER
  const hideNavbar =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/worker");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ADMIN */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/workers" element={<Workers />} />

        {/* WORKER */}
        <Route path="/worker" element={<Worker />} />
      </Routes>

      <Footer />
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
