import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import UserNotFound from './NotFound';


// Composant pour la page de connexion
const Login = () => {
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState(""); 
    const [error, setError] = useState(false);
    const navigate = useNavigate();
  
    const Submit = async (e) => { 
      e.preventDefault();
  
      let dataBody = {
        email: email,
        password: password
      };
  
      try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(dataBody),
        });
        const data = await response.json();
  
        if (response.status === 200){
          localStorage.setItem('token', data.token)
          navigate('/home');
        } else {
          setError(true);
        }
  
      } catch(error) {
        console.error('Error', error);
      }
    };
  
    return (
      <div className='App'>
      <div className="form">
        <form onSubmit={Submit}>
          <fieldset>
            <h2>Login</h2>
            <div className="Field">
              <label>Email address</label>
              <input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email address" 
              /> 
            </div>
            <div className="Field">
              <label>Password</label>
              <input 
                value={password} 
                type="password" 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" 
              />
            </div>
            {error && UserNotFound()}
            <button type="submit">Login</button>
          </fieldset>
        </form>
        <button onClick={() =>navigate('/signup')}>Sign Up</button>
      </div>
      </div>
    );
  };

  export default Login;