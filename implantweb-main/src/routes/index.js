import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import SignIn from '../Login_Page/SignIn';
import ContactUs from '../pages/ContactUs';

const AppRoutes = () => (
  <Router>
    <Routes>
    <Route path="/" element={<Home />} />
          <Route path="/login" element={<SignIn />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<ContactUs />} />
          {/* Add other routes as needed */}
    </Routes>
  </Router>
);

export default AppRoutes;
