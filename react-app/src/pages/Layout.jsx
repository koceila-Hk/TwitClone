import React from 'react';
import { Outlet, Link } from "react-router-dom";
import '../App.css';

const Layout = () => {
  return (
    <div className='home'>
        <nav>
          <ul>
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/blogs">Blogs</Link>
            </li>
            <li>
              <Link to="/logout">Log out</Link>
            </li>
          </ul>
        </nav>
      
      <main>
        <Outlet />
      </main>
{/* 
      <footer>
        <p>Footer</p>
      </footer> */}
    </div>
  );
};

export default Layout;
