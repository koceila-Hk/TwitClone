import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './pages/Layout';
import NoPage from './pages/NoPage';
import Home from './pages/Home';
import Blogs from './pages/Blog';
import SignUp from '../SignUp';
import Login from '../Login';

// Composant principal pour gérer l'affichage des pages
const App = () => {
  const [isLoginPage, setIsLoginPage] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* <Route index element={<Home />} /> */}
          <Route path="/home" element={<Home />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="*" element={<NoPage />} />
        </Route>
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route index element={<SignUp/>} />
      </Routes>
    </BrowserRouter>
  );
};


export default App;
