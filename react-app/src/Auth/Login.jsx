import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import UserNotFound from '../NotFound';
import { Ring } from 'react-css-spinners'



// Composant pour la page de connexion
const Login = () => {
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState(""); 
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  
    async function Submit(e) { 
      e.preventDefault();
      setLoading(true);
  
      let dataBody = {
        email: email,
        password: password
      };
  
      try {
        const response = await fetch('http://localhost:3000/auth/sign-in', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(dataBody),
        });
        const data = await response.json();
        
        setTimeout(() => {
          if (response.status === 200){
            localStorage.setItem('token', data.token);
            navigate('/home');
          } else {
            setError(true);
            setLoading(false);
          }
        },1000)
      } catch(error) {
        console.error('Error', error);
      }
    };
  
    return (
      <div className='App'>
        {loading ? ( <Ring color='white' size={40} className='my-ring'/>) : (
      <div className="form-login">
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
      )}
      </div>
    );
  };

  export default Login;