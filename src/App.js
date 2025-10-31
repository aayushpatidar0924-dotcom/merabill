import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from './componantes/Nav_bar';
import Footer from './componantes/footer';
import Home from './componantes/home';
import About from './componantes/about';


function App() {
  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </Router>
    </>
  );
}

export default App;
