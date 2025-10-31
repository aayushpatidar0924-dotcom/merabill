import React from "react";
import "./main.css";

function MainArea() {
  return (
    <main className="main-area">
      <section className="hero">
        <h1>Welcome to MySite</h1>
        <p>This is the main content area between Navbar and Footer.</p>
        <button className="hero-btn">Get Started</button>
      </section>

      <section className="features">
        <div className="card">
          <h3>Feature One</h3>
          <p>Simple and clean React components to start your project fast.</p>
        </div>

        <div className="card">
          <h3>Feature Two</h3>
          <p>Fully responsive design with modern CSS techniques.</p>
        </div>

        <div className="card">
          <h3>Feature Three</h3>
          <p>Easy customization for your brand or theme.</p>
        </div>
      </section>
    </main>
  );
}
export default MainArea;